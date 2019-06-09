let Need = require("../../../lib/needs/need.js")
class AlwaysBroken extends Need {
  constructor(input) {
    super({}, input)
  }

  check(callback) {
    callback(new Error("I'm always broken"))
  }
}

AlwaysBroken.type = "alwasy_broken"
AlwaysBroken.info = ""
module.exports = AlwaysBroken
