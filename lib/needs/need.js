const Ajv = require("ajv")

class Need {
  constructor(schema, input) {
    let ajv = new Ajv()
    this.validator = ajv.compile(schema)
    this.data = input

    return this.validate()
  }

  validate() {
    let valid = this.validator(this.data)
    if (!valid) {
      throw new Need.ValidationError(`data for type "${this.constructor.type}" is not valid`, this.validator.errors)
    }
  }

  check() {
    throw new Error("base level check() called")
  }
}

class ValidationError extends Error {
  constructor(message, details) {
    super(message)
    this.details = details
    this.name = "ValidationError"
  }
}

Need.ValidationError = ValidationError

module.exports = Need