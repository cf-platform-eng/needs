const schema = {
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

const Ajv = require("ajv")
let ajv = new Ajv()
let validator = ajv.compile(schema)

class Needs {
  constructor(needs) {
    this.needs = []
    if (typeof needs == "object") {
      this.needs = needs
    }
  }

  getUnsatisfied() {
    return new Promise((resolve, reject) => {
      let promises = []
      for (let need of this.needs) {
        promises.push({ need, promise: need.check() })
      }

      Promise.all(promises.map(x => x.promise)).then(values => {
        let unsatisfied = promises.filter((elem, index) => !values[index].satisfied).map(elem => elem.need)
        resolve(unsatisfied)
      }).catch(reason => {
        reject("one of them failed", reason)
      })
    })
  }

  load(data, types) {
    return new Promise((resolve, reject) => {
      let valid = validator(data)
      if (!valid) {
        return reject({
          details: validator.errors,
          reason: "invalid data"
        })
      }

      for (let need of data) {
        if (!types.has(need.type)) {
          return reject({
            reason: `No need type found for type "${need.type}"`
          })
        }

        let type = types.get(need.type)
        this.needs.push(new type(need))
      }

      return resolve(this.needs)
    })
  }
}
  
module.exports = Needs