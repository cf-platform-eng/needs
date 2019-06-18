const Needs = require("../lib/needs.js")
const FakeTypes = require("./helpers/fake_types.js")
const AlwaysBroken = require("./helpers/needs/always_broken.js")
const AlwaysHappy = require("./helpers/needs/always_happy.js")
const AlwaysSad = require("./helpers/needs/always_sad.js")
// const Types = require("../lib/types.js")

describe("Needs", function () {
  describe("getUnsatisfied", function () {
    it("returns an empty list on an empty input", async function () {
      let needs = new Needs()
      await expectAsync(needs.getUnsatisfied()).toBeResolvedTo([])
    })

    it("returns an empty list with all satisfied needs", async function () {
      let needs = new Needs([
        new AlwaysHappy(),
        new AlwaysHappy()
      ])
      await expectAsync(needs.getUnsatisfied()).toBeResolvedTo([])
    })

    it("returns the unsatisfied needs", async function () {
      let unsatisfied = new AlwaysSad()
      let needs = new Needs([
        new AlwaysHappy(),
        unsatisfied,
        new AlwaysHappy()
      ])
      await expectAsync(needs.getUnsatisfied()).toBeResolvedTo([unsatisfied])
    })

    it("rejects with a broken need", async function () {
      let needs = new Needs([
        new AlwaysHappy(),
        new AlwaysBroken(),
        new AlwaysHappy()
      ])
      await expectAsync(needs.getUnsatisfied()).toBeRejected()
    })
  })

  describe("load", function () {
    it("rejects invalid need lists", async function () {
      let needs = new Needs()
      await expectAsync(needs.load("a string isn't correct")).toBeRejected()
      await expectAsync(needs.load({
        "objects": "aren't correct"
      })).toBeRejected()
      await expectAsync(needs.load(false)).toBeRejected()
    })

    it("accepts empty arrays", async function () {
      let needs = new Needs()
      await expectAsync(needs.load([])).toBeResolvedTo([])
    })

    it("rejects needs with no types", async function () {
      let needs = new Needs()
      let types = new FakeTypes()
      let data = [{
        type: "wrong"
      }]

      await expectAsync(needs.load(data, types)).toBeRejectedWith({
        reason: "No need type found for type \"wrong\""
      })
    })

    it("accepts valid needs", async function () {
      let needs = new Needs()
      let types = new FakeTypes()
      let data = [{
        type: "always_broken"
      }, {
        type: "always_sad"
      }]

      await expectAsync(needs.load(data, types)).toBeResolved()
    })
  })
})
