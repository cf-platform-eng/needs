const schema = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "pattern": "^and$"
    },
    "needs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "pattern": "^[a-z_]+$"
          }
        },
        "required": ["type"]
      }
    },
    "description": {
      "type": "string"
    },
    "identify": {
      "type": "string"
    },
    "optional": {
      "type": "boolean"
    }
  },
  "required": ["type", "needs"],
  "additionalProperties": false
}

let Aggregate = require("./aggregate.js")
class And extends Aggregate {
  constructor(input, types) {
    super(schema, input, types)
  }

  isSatisfied(numUnsatisfied) {
    return numUnsatisfied == 0
  }
}

And.type = "and"
And.info = `Combines multiple needs where all are required
Example:
{
  "type": "and"
  "needs": [
    { "type": ... },
    { "type": ... }
  ]
}`

module.exports = And
