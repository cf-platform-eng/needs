let Need = require("../../../lib/needs/need.js")
class AlwaysSad extends Need {
  constructor(input) {
    super({}, input)
  }

  check() {
    return Promise.resolve({
      need: this,
      satisfied: false
    })
  }
}

AlwaysSad.type = "alwasy_sad"
AlwaysSad.info = ""
module.exports = AlwaysSad
