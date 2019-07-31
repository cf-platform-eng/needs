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
    },
    "names": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$"
      },
      "minItems": 1
    }
  },
  "anyOf": [
    {"required": ["type", "name"]},
    {"required": ["type", "names"]}
  ],
  "additionalProperties": false
}

let debug = require("debug")("environment_variable")
let Need = require("./need.js")
class EnvironmentVariable extends Need {
  constructor(input) {
    super(schema, input)
    this.names = [...this.data.names || []]
    if (this.data.name) {
      this.names.push(this.data.name)
    }
  }

  check() {
    let satisfied = this.names.map(name => {
      let result = Boolean(process.env[name])
      if (result) {
        debug(`"${name}" is set (${process.env[name]})`)
      } else {
        debug(`"${name}" is not set`)
      }
      return result
    }).reduce((result, value) => result && value, true)
    return Promise.resolve({
      need: this,
      satisfied
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