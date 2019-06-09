let async = require("async")

function check(needs, callback) {
  async.filter(needs, (need, next) => {
    need.check((err, satisfied) => {
      next(err, !satisfied)
    })
  }, callback)
}

module.exports = check