let Need = require("../../../lib/needs/need.js")
class AlwaysBroken extends Need {
  constructor() {
    super({}, {
      type: AlwaysBroken.type
    })
  }

  check() {
    return Promise.reject({
      need: this,
      reason: "I'm always broken"
    })
  }
}

AlwaysBroken.type = "always_broken"
AlwaysBroken.info = ""
module.exports = AlwaysBroken
