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
    }
  },
  "required": ["type", "needs"],
  "additionalProperties": false
}

let Need = require("./need.js")
class Or extends Need {
  constructor(input, types) {
    super(schema, input, types)
  }

  isSatisfied(numUnsatisfied) {
    return numUnsatisfied < this.needs.length
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