const Ajv = require("ajv")

class Need {
  constructor(schema, input) {
    let ajv = new Ajv()
    this.validator = ajv.compile(schema)
    return this.validate(input)
  }

  validate(input) {
    let valid = this.validator(input)
    if (!valid) {
      throw new Need.ValidationError(`data for type "${this.constructor.type}" is not valid`, this.validator.errors)
    }
    this.type = input.type
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