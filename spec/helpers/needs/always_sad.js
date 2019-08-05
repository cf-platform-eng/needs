let Need = require("../../../lib/needs/need.js")
class AlwaysSad extends Need {
  constructor() {
    super({}, {
      type: AlwaysSad.type
    })
  }

  check() {
    this.satisfied = false
    return Promise.resolve(this)
  }
}

AlwaysSad.type = "alwasy_sad"
AlwaysSad.info = ""
module.exports = AlwaysSad
