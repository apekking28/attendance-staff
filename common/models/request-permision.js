"use strict";

const validate = require("validate.js");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const async = require("async");
const _ = require("underscore");
const { match } = require("assert");

module.exports = function (RequestPermission) {
  RequestPermission.view = async function (req) {
    if (req != null) req.setTimeout(0);
    // console.log(req);
    try {
      const { connector, ObjectID } = RequestPermission.getDataSource();
      const collection = connector.collection("RequestPermission");
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

      // IZIN dan TIDAK dizinkan
      let leave = 0;
      let reject = 0;

      for (const doc of result) {
        if (doc.isApproved === true) {
          leave++;
        } else if (doc.isApproved === false) {
          reject++;
        }
      }
      return Promise.resolve({
        message: "succsesfully get data requestPermission",
        leave: leave,
        reject: reject,
        total: result.length,
        data: result,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  RequestPermission.remoteMethod("view", {
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

  RequestPermission.requestPermision = async function (req, body) {
    {
      if (req != null) req.setTimeout(0);
      try {
        const constraints = {
          id: { presence: true },
          reason: { presence: true },
          startDate: { presence: true },
          endDate: { presence: true },
        };

        const validation = validate(body, constraints);
        if (validation) {
          const error = new Error(JSON.stringify(validation));
          error.status = 412;
          throw error;
        }

        const Staff = RequestPermission.app.models.Staff;
        const checkSubmit = await Staff.findOne({
          where: {
            id: body.id,
            isDeleted: false,
          },
        });

        console.log(checkSubmit);

        if (!checkSubmit) {
          const error = new Error("Staff data not found");
          error.status = 404;
          throw error;
        }

        const submittingOvertimePayload = {
          createdAt: new Date(),
          reason: body.reason,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          isApproved: false,
          isDeleted: false,
          staffId: checkSubmit["id"],
          name: checkSubmit["name"],
        };

        const createRequest = await RequestPermission.create(
          submittingOvertimePayload
        );

        return Promise.resolve({
          status: "Succedfully create request permession",
          createdId: createRequest.id,
        });
      } catch (err) {
        return Promise.reject({
          status: 400,
          message: err.message,
        });
      }
    }
  };

  RequestPermission.remoteMethod("requestPermision", {
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

  RequestPermission.edit = async function (req, body, id) {
    if (req != null) req.setTimeout(0);
    try {
      body.updateAt = new Date();
      if (id) {
        await RequestPermission.updateAll({ id: id }, body);
      }

      return Promise.resolve({
        status: 200,
        data: body,
        message: "Succesfully Update RequestPermission",
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  RequestPermission.remoteMethod("edit", {
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
      { arg: "id", type: "string", required: true, description: "id" },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "put" },
  });

  RequestPermission.approve = async function (req, idRequest) {
    if (req != null) req.setTimeout(0);
    try {
      const Attedance = RequestPermission.app.models.Attedance;
      if (idRequest) {
        //NOTE: APPROVE REQUEST
        await RequestPermission.updateAll(
          { id: idRequest },
          { isApproved: true, updateAt: new Date() }
        );

        //NOTE: CREATE DATA ATTENDACE
        let requestPermission = await RequestPermission.findById(idRequest);

        let payload = {
          staffId: requestPermission.staffId,
          name: requestPermission.name,
          status: "izin",
          startDate: requestPermission.startDate,
          endDate: requestPermission.endDate,
          createdAt: new Date(),
          checkIn: null,
        };

        await Attedance.create(payload);
      }

      return Promise.resolve({
        status: 200,
        idRequest: idRequest,
        message: "Succesfully approved RequestPermission",
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  RequestPermission.remoteMethod("approve", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "idRequest", type: "string", required: true, description: "id" },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "put" },
  });

  RequestPermission.reject = async function (req, idRequest) {
    if (req != null) req.setTimeout(0);
    try {
      if (idRequest) {
        //NOTE: APPROVE REQUEST
        await RequestPermission.updateAll(
          { id: idRequest },
          { isApproved: false, updateAt: new Date() }
        );
      }

      return Promise.resolve({
        status: 200,
        message: "Succesfully reject RequestPermission",
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  RequestPermission.remoteMethod("reject", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "idRequest", type: "string", required: true, description: "id" },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "put" },
  });

  RequestPermission.deleteSoft = async function (req, id) {
    {
      if (req != null) req.setTimeout(0);
      try {
        if (id) {
          var dataRequestPermission = await RequestPermission.findOne({
            where: {
              id: id,
              isDeleted: false,
            },
          });
        }
        console.log(id);

        if (!dataRequestPermission) {
          const error = new Error("Data Not Found");
          error.status = 401;
          throw error;
        }

        (dataRequestPermission.isDeleted = true),
          await dataRequestPermission.save();

        return Promise.resolve({
          status: "succeedfully deleted",
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };

  RequestPermission.remoteMethod("deleteSoft", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "id", type: "string", required: true, description: "id" },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "post" },
  });

  RequestPermission.deleteHard = async function (req, id) {
    {
      if (req != null) req.setTimeout(0);
      try {
        var deletedRequestPermissionHard = await RequestPermission.destroyAll({
          id: id,
        });

        return Promise.resolve({
          status: "successfully deleted hardly",
          deletedHard: deletedRequestPermissionHard,
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };

  RequestPermission.remoteMethod("deleteHard", {
    description: ["set burnt"],
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "id", type: "string", required: true, description: "id" },
    ],
    returns: {
      arg: "status",
      type: "object",
      root: true,
      description: "Return value",
    },
    http: { verb: "delete" },
  });
};
