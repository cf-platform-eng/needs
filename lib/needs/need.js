const Ajv = require("ajv")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

class Need {
  constructor(schema, input) {
    return this.validate(schema, input)
  }

  validate(schema, input) {
    let ajv = new Ajv()
    let valid = ajv.validate(schema, input)
    if (!valid) {
      throw new Need.ValidationError(`data for type "${this.constructor.type}" is not valid`, ajv.errors)
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
