const Aggregate = require("./aggregate.js")
class And extends Aggregate {
  constructor(input, types) {
    super(And.schema, input, types)
  }

  isSatisfied(numUnsatisfied) {
    return numUnsatisfied === 0
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
And.schema = {
  type: "object",
  properties: {
    type: { type: "string", pattern: "^and$" },
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

module.exports = And
