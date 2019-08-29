let Need = require("../../../lib/needs/need.js")
class AlwaysHappy extends Need {
  constructor() {
    super({}, {
      type: AlwaysHappy.type
    })
  }

  check(andIdentify) {
    this.satisfied = true
    if (andIdentify) {
      this.identity = "identified!"
    }
    return Promise.resolve(this)
  }
}

AlwaysHappy.type = "always_happy"
AlwaysHappy.info = ""
module.exports = AlwaysHappy
