class Types {
  constructor() {
    this.types = {
      "binary": require("./needs/binary.js"),
      "environment_variable": require("./needs/environment_variable.js"),
      "file": require("./needs/file.js")
    }
  }

  get(typeName) {
    return this.types[typeName]
  }

  has(typeName) {
    return this.get(typeName) != undefined
  }

  all() {
    return Object.keys(this.types)
  }
}

module.exports = Types