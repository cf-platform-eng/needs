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
    }
  },
  "required": ["type", "needs"],
  "additionalProperties": false
}

let Need = require("./need.js")
let Types = require("../types.js")
class And extends Need {
  constructor(input, types) {
    super(schema, input)

    this.types = types || new Types()
    this.needs = []
    for (let need of input.needs) {
      if (!types.has(need.type)) {
        throw new Need.ValidationError(`need is not valid: ${need.type}`)
      }

      let type = types.get(need.type)
      this.needs.push(new type(need))
    }
  }

  check() {
    return new Promise((resolve, reject) => {
      let promises = []
      for (let need of this.needs) {
        promises.push({ need, promise: need.check() })
      }

      Promise.all(promises.map(x => x.promise)).then(values => {
        let unsatisfied = promises.filter((elem, index) => !values[index].satisfied).map(elem => elem.need)
        resolve({
          need: this,
          satisfied: unsatisfied.length == 0
        })
      }).catch(reason => {
        reject({
          need: this,
          reason
        })
      })
    })
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