const Ajv = require("ajv")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

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
    this.description = input.description
    this.identify = input.identify
    this.optional = input.optional
  }

  check() {
    throw new Error("base level check() called")
  }

  async runIdentify() {
    if (this.satisfied && this.identify) {
      try {
        let { stdout } = await exec(this.identify)
        this.identity = stdout.trim()
      } catch (e) {
        this.identity = `Failed to run identify: ${e}`.trim()
      }
    }
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
