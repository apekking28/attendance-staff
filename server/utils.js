const Promise = require("bluebird");

module.exports = {
    wrap: function (genFn) {
      var cr = Promise.coroutine(genFn);
      return function (req, res, next) {
        cr(req, res, next).catch(next);
      }
    },
};