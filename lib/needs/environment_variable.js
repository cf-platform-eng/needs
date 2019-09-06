let debug = require("debug")("environment_variable")
let Need = require("./need.js")
class EnvironmentVariable extends Need {
  constructor(input) {
    super(EnvironmentVariable.schema, input)
    this.name = input.name
  }

  async check(andIdentify) {
    this.satisfied = Boolean(process.env[this.name])
    if (this.satisfied) {
      debug(`"${this.name}" is set (${process.env[this.ame]})`)
    } else {
      debug(`"${this.name}" is not set`)
    }

    if (andIdentify) {
      await this.runIdentify()
    }

    return Promise.resolve(this)
  }
}

EnvironmentVariable.type = "environment_variable"
EnvironmentVariable.info = `Checks the environment for a set environment variable
Example:
{
  "name": "REQUIRED_ENVIRONMENT_VARIABLE",
  "type": "environment_variable"
}`
EnvironmentVariable.schema = {
  type: "object",
  properties: {
    type:        { type: "string", pattern: "^environment_variable$" },
    name:        { type: "string", pattern: "^[a-zA-Z_][a-zA-Z0-9_]*$" },
    description: { type: "string" },
    identify:    { type: "string" },
    optional:    { type: "boolean" }
  },
  required: ["type", "name"],
  additionalProperties: false
}

module.exports = EnvironmentVariable
