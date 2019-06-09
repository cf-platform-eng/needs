let Need = require("../../../lib/needs/need.js")
class AlwaysSad extends Need {
  constructor(input) {
    super({}, input)
  }

  check(callback) {
    callback(null, false)
  }
}

AlwaysSad.type = "alwasy_sad"
AlwaysSad.info = ""
module.exports = AlwaysSad
