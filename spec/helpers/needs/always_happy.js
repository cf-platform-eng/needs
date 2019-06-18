let Need = require("../../../lib/needs/need.js")
class AlwaysHappy extends Need {
  constructor(input) {
    super({}, input)
  }

  check() {
    return Promise.resolve({
      need: this,
      satisfied: true
    })
  }
}

AlwaysHappy.type = "alwasy_happy"
AlwaysHappy.info = ""
module.exports = AlwaysHappy
