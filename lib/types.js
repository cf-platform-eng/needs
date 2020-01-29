class Types {
  constructor() {
    this.types = {
      "and": require("./needs/and.js"),
      "binary": require("./needs/binary.js"),
      "environment_variable": require("./needs/environment_variable.js"),
      "file": require("./needs/file.js"),
      "or": require("./needs/or.js")
    }
  }

  get(typeName) {
    return this.types[typeName]
  }

  has(typeName) {
    return Boolean(this.get(typeName))
  }

  all() {
    return Object.keys(this.types)
  }
}

module.exports = Types
