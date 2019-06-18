const schema = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "pattern": "^environment_variable$"
    },
    "name": {
      "type": "string",
      "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$"
    }
  },
  "required": ["type", "name"],
  "additionalProperties": false
}

let Need = require("./need.js")
class EnvironmentVariable extends Need {
  constructor(input) {
    super(schema, input)
  }

  check() {
    return Promise.resolve({
      need: this,
      satisfied: Boolean(process.env[this.data.name])
    })
  }
}

EnvironmentVariable.type = "environment_variable"
EnvironmentVariable.info = `Checks the environment for a set environment variable
Example:
{
  "name": "REQUIRED_ENVIRONMENT_VARIABLE",
  "type": "environment_variable"
}`

module.exports = EnvironmentVariable