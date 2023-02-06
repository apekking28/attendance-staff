"use strict";

const validate = require("validate.js");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const async = require("async");
const _ = require("underscore");

module.exports = function (Staff) {
  Staff.view = async function (req) {
    if (req != null) req.setTimeout(0);
    try {
      const result = await Staff.find({
        where: {
          isActived: true,
          isDeleted: false,
        },
      });
      return Promise.resolve({
        message: "succsesfully get staff data",
        data: result,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  Staff.remoteMethod("view", {
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

  Staff.add = async function (req, body) {
    {
      if (req != null) req.setTimeout(0);
      try {
        const constraints = {
          name: { presence: true },
          age: { presence: true },
        };

        const validation = validate(body, constraints);
        if (validation) {
          const error = new Error(JSON.stringify(validation));
          error.status = 412;
          throw error;
        }

        body.isDeleted = false;
        body.isActived = true;
        body.createdAt = new Date();
        await Staff.create(body);

        return Promise.resolve({
          status: 200,
          data: body,
          message: "Succesfully Create Staff",
        });
      } catch (err) {
        return Promise.reject({
          status: 400,
          message: err.message,
        });
      }
    }
  };

  Staff.remoteMethod("add", {
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

  Staff.edit = async function (req, body, id) {
    {
      if (req != null) req.setTimeout(0);
      try {
        body.updateAt = new Date();
        if (id) {
          await Staff.updateAll({ id: id }, body);
        }
        console.log(body);

        return Promise.resolve({
          status: 200,
          data: body,
          message: "Succesfully Updated Staff",
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };

  Staff.remoteMethod("edit", {
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

  Staff.deleteSoft = async function (req, id) {
    {
      if (req != null) req.setTimeout(0);
      try {
        if (id) {
          var dataStaff = await Staff.findOne({
            where: {
              id: id,
            },
          });
        }
        console.log(dataStaff);

        if (!dataStaff) {
          const error = new Error("Data Not Found");
          error.status = 401;
          throw error;
        }

        (dataStaff.isDeleted = true),
          (dataStaff.isActived = false),
          await dataStaff.save();

        return Promise.resolve({
          status: "succeed",
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };

  Staff.remoteMethod("deleteSoft", {
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

  Staff.deleteHard = async function (req, id) {
    {
      if (req != null) req.setTimeout(0);
      try {
        var deletedStaffHard = await Staff.destroyAll({ id: id });

        return Promise.resolve({
          status: "successfully deleted hardly",
          deletedHard: deletedStaffHard,
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };

  Staff.remoteMethod("deleteHard", {
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
