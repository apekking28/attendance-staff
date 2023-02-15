"use strict";

const validate = require("validate.js");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const async = require("async");
const _ = require("underscore");
const { Console } = require("console");

module.exports = function (Attedance) {
  Attedance.view = async function (req) {
    if (req != null) req.setTimeout(0);

    try {
      const { connector, ObjectID } = Attedance.getDataSource();
      const collection = connector.collection("Attedance");
      const cursor = await collection.aggregate(
        [
          {
            $match: {
              $or: [
                {
                  isDeleted: false,
                },
                {
                  isDeleted: { $exists: false },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "Staff",
              let: {
                stf: "$staffId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$stf"],
                    },
                  },
                },
              ],
              as: "Staff",
            },
          },
        ],
        { allowDiskUse: true }
      );
      const result = await cursor.toArray();
      await cursor.close();
      return Promise.resolve({
        message: "succsesfully get attendance data",
        count: result.length,
        data: result,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Attedance.remoteMethod("view", {
    description: ["set burnt"],
    accepts: [{ arg: "req", type: "object", http: { source: "req" } }],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "get" },
  });

  Attedance.report = async function (req, name) {
    if (req != null) req.setTimeout(0);

    try {
      let $$NAME = {};
      if (name) {
        $$NAME = { "_id.name": name };
      }

      const { connector, ObjectID } = Attedance.getDataSource();
      const collection = connector.collection("Attedance");
      const cursor = await collection.aggregate(
        [
          {
            $match: {
              $or: [
                {
                  isDeleted: false,
                },
                {
                  isDeleted: { $exists: false },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "Staff",
              let: {
                stf: "$staffId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$stf"],
                    },
                  },
                },
              ],
              as: "Staff",
            },
          },
          {
            $group: {
              _id: {
                status: "$status",
                name: "$name",
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              total: {
                $sum: 1,
              },
              data: {
                $push: "$$ROOT",
              },
            },
          },
          {
            $match: $$NAME,
          },
        ],
        { allowDiskUse: true }
      );
      const result = await cursor.toArray();
      await cursor.close();

      // HADIR , TELAT , IZIN
      let present = 0;
      let late = 0;
      let absent = 0;
      let leave = 0;
      for (let doc of result) {
        if (doc._id.status === "izin") {
          const diffInMs = doc.data[0].endDate - doc.data[0].startDate;
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          let diff = Math.round(diffInDays);
          doc.total = diff;
          leave = diff;
        } else if (doc._id.status === "present") {
          present = doc.total;
        } else if (doc._id.status === "late") {
          late = doc.total;
        }
      }

      // TIDAK HADIR
      const date = new Date("2023-02-01T00:00:00.000Z");
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      absent = Math.abs(present + leave + late - daysInMonth);

      return Promise.resolve({
        message: "succsesfully get attendance staff",
        Name: name,
        present: present,
        late: late,
        leave: leave,
        absent: absent,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Attedance.remoteMethod("report", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      {
        arg: "name",
        type: "string",
        description: "name",
      },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "get" },
  });

  Attedance.checkIn = async function (req, body) {
    {
      if (req != null) req.setTimeout(0);
      try {
        const constraints = {
          staffId: { presence: true },
          checkIn: { presence: true },
        };

        const validation = validate(body, constraints);
        if (validation) {
          const error = new Error(JSON.stringify(validation));
          error.status = 412;
          throw error;
        }

        const Staff = Attedance.app.models.Staff;
        let checkUser = await Staff.find({ where: { id: body.staffId } });
        // console.log(checkUser);
        if (!checkUser.length) return "Staff is not found";
        else if (checkUser[0].isDeleted) return "Staff is not found";

        let ci = body.checkIn;
        let status = "not present";
        if (typeof ci !== "number") return "check in must be a number";
        if (ci <= 100 || ci >= 2359) return "number is not in range";

        if (ci >= 700 && ci <= 800) status = "present";
        else if (ci > 800 && ci < 1600) status = "late";
        else if (ci >= 1600) status = "not present";

        const payload = {
          staffId: body.staffId,
          name: checkUser[0].name,
          status: status,
          createdAt: new Date(),
          checkIn: body.checkIn,
        };

        const attendance = await Attedance.create(payload);

        return Promise.resolve({
          status: "Succedfully check in",
          createdId: attendance.id,
        });
      } catch (err) {
        return Promise.reject({
          status: 400,
          message: err.message,
        });
      }
    }
  };

  Attedance.remoteMethod("checkIn", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      {
        arg: "body",
        type: "object",
        http: { source: "body" },
        required: true,
        description: "body",
      },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "post" },
  });

  Attedance.checkOut = async function (req, body) {
    {
      if (req != null) req.setTimeout(0);
      try {
        const constraints = {
          staffId: { presence: true },
          attendanceId: { presence: true },
          checkOut: { presence: true },
        };

        const validation = validate(body, constraints);
        if (validation) {
          const error = new Error(JSON.stringify(validation));
          error.status = 412;
          throw error;
        }

        let co = body.checkOut;
        let attendanceId = body.attendanceId;

        let chekAttendance = await Attedance.find({
          where: { id: attendanceId },
        });
        if (!chekAttendance.length) return "user is not check in";

        const payload = {
          staffId: body.staffId,
          checkOut: co,
          createdAt: new Date(),
        };

        if (attendanceId) {
          const attendance = await Attedance.updateAll(
            { id: attendanceId },
            payload
          );
        }

        return Promise.resolve({
          status: "Succedfully check out",
          attendanceId: attendanceId,
        });
      } catch (err) {
        return Promise.reject({
          status: 400,
          message: err.message,
        });
      }
    }
  };

  Attedance.remoteMethod("checkOut", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      {
        arg: "body",
        type: "object",
        http: { source: "body" },
        required: true,
        description: "body",
      },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "post" },
  });
};
