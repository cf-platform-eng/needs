let Need = require("../../../lib/needs/need.js")
class AlwaysHappy extends Need {
  constructor() {
    super({}, {
      type: AlwaysHappy.type
    })
  }

  check() {
    this.satisfied = true
    return Promise.resolve(this)
  }
}

AlwaysHappy.type = "alwasy_happy"
AlwaysHappy.info = ""
module.exports = AlwaysHappy
