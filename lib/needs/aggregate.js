let Need = require("./need.js")
let Types = require("../types.js")
class Aggregate extends Need {
  constructor(schema, input, types) {
    super(schema, input)
    types = types || new Types()

    this.needs = []
    for (let need of input.needs) {
      if (!types.has(need.type)) {
        throw new Need.ValidationError("Invalid need", `Need type "${need.type}" does not exist`)
      }

      let type = types.get(need.type)
      this.needs.push(new type(need))
    }
  }

  isSatisfied() {
    throw new Error("base level isSatisfied() called")
  }

  check() {
    return new Promise((resolve, reject) => {
      let promises = []
      for (let need of this.needs) {
        promises.push({ need, promise: need.check() })
      }

      Promise.all(promises.map(x => x.promise)).then(values => {
        let unsatisfiedCount = values.map(need => need.satisfied ? 0 : 1).reduce((val, total) => val + total, 0)
        this.satisfied = this.isSatisfied(unsatisfiedCount)
        resolve(this)
      }).catch(reason => {
        reject({
          need: this,
          reason
        })
      })
    })
  }
  
  filter(field, value) {
    return this.needs.filter(need => need[field] == value)
  }

  getSatisfiedNeeds() {
    return this.filter("satisfied", true)
  }

  getUnsatisfiedNeeds() {
    return this.filter("satisfied", false)
  }
}

module.exports = Aggregate