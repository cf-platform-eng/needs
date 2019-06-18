class FakeTypes {
  constructor() {
    this.types = {
      "always_broken": require("./needs/always_broken.js"),
      "always_happy": require("./needs/always_happy.js"),
      "always_sad": require("./needs/always_sad.js")
    }
  }

  get(typeName) {
    return this.types[typeName]
  }

  has(typeName) {
    return this.get(typeName) != undefined
  }
}

module.exports = FakeTypes