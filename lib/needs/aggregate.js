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

  async check(andIdentify) {
    let promises = []
    for (let need of this.needs) {
      promises.push({ need, promise: need.check(andIdentify) })
    }

    try {
      let values = await Promise.all(promises.map(x => x.promise))
      let unsatisfiedCount = values.map(need => need.satisfied || need.optional ? 0 : 1).reduce((val, total) => val + total, 0)
      this.satisfied = this.isSatisfied(unsatisfiedCount)
    } catch (reason) {
      return Promise.reject({
        need: this,
        reason
      })
    }

    if (andIdentify) {
      await this.runIdentify()
    }
  
    return Promise.resolve(this)
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