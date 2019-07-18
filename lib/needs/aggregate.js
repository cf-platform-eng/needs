let Need = require("./need.js")
let Types = require("../types.js")
class Aggregate extends Need {
  constructor(schema, input, types) {
    super(schema, input)

    this.types = types || new Types()
    this.needs = []
    for (let need of input.needs) {
      if (!this.types.has(need.type)) {
        throw new Need.ValidationError("Invalid need", `Need type "${need.type}" does not exist`)
      }

      let type = this.types.get(need.type)
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
        let satisfiedNeeds = promises.filter((elem, index) => values[index].satisfied).map(elem => elem.need)
        let unsatisfiedNeeds = promises.filter((elem, index) => !values[index].satisfied).map(elem => elem.need)
        resolve({
          need: this,
          satisfied: this.isSatisfied(unsatisfiedNeeds.length),
          satisfiedNeeds,
          unsatisfiedNeeds
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

module.exports = Aggregate