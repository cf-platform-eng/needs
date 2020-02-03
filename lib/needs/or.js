const Aggregate = require("./aggregate.js")
class Or extends Aggregate {
  constructor(input, types) {
    super(Or.schema, input, types)
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
Or.schema = {
  type: "object",
  properties: {
    type: { type: "string", pattern: "^or$" },
    needs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", pattern: "^[a-z_]+$" }
        },
        required: ["type"]
      }
    },

    description: { type: "string" },
    identify:    { type: "string" },
    metadata:    { type: "object" },
    optional:    { type: "boolean" }
  },
  required: ["type", "needs"],
  additionalProperties: false
}

module.exports = Or
