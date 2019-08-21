const schema = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "pattern": "^or$"
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
    "identify": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  },
  "required": ["type", "needs"],
  "additionalProperties": false
}

let Aggregate = require("./aggregate.js")
class Or extends Aggregate {
  constructor(input, types) {
    super(schema, input, types)
  }

  isSatisfied(numUnsatisfied) {
    return this.needs.length == 0 || numUnsatisfied < this.needs.length
  }
}

Or.type = "or"
Or.info = `Combines multiple needs where at least one is required
Example:
{
  "type": "or"
  "needs": [
    { "type": ... },
    { "type": ... }
  ]
}`

module.exports = Or
