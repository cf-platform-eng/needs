let Need = require("../../../lib/needs/need.js")
class AlwaysSad extends Need {
  constructor(input) {
    super({}, input)
  }

  check() {
    this.satisfied = false
    return Promise.resolve(this)
  }
}

AlwaysSad.type = "always_sad"
AlwaysSad.info = ""
module.exports = AlwaysSad
