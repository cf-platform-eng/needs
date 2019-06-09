let check = require("../lib/check.js")
let AlwaysHappy = require("./helpers/needs/always_happy.js")
let AlwaysSad = require("./helpers/needs/always_sad.js")
let AlwaysBroken = require("./helpers/needs/always_broken.js")

describe("check", function () {
  it("handles empty list", function () {
    let callback = jasmine.createSpy("check callback")
    callback.and.callFake((err, remaining) => {
      expect(err).toBeNull()
      expect(remaining).toEqual([])
    })
    check([], callback)
  })

  it("returns an empty list when all needs are satisfied", function () {
    let needs = [
      new AlwaysHappy(),
      new AlwaysHappy()
    ]

    let callback = jasmine.createSpy("check callback")
    callback.and.callFake((err, remaining) => {
      expect(err).toBeNull()
      expect(remaining).toEqual([])
    })

    check(needs, callback)
  })

  it("returns the unsatisfied needs", function () {
    let needs = [
      new AlwaysHappy(),
      new AlwaysSad()
    ]

    let callback = jasmine.createSpy("check callback")
    callback.and.callFake((err, remaining) => {
      expect(err).toBeNull()
      expect(remaining).toContain(needs[1])
    })

    check(needs, callback)
  })

  it("returns an error if there was an error", function () {
    let needs = [
      new AlwaysHappy(),
      new AlwaysBroken(),
      new AlwaysSad()
    ]

    let callback = jasmine.createSpy("check callback")
    // eslint-disable-next-line no-unused-vars
    callback.and.callFake((err, remaining) => {
      expect(err).toBeDefined()
    })

    check(needs, callback)
  })
})