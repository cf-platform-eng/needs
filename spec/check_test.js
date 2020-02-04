const { check, colorize, formatNeeds } = require("../cmd/check.js")
const colors = require("colors/safe")
const And = require("../lib/needs/and.js")
const AlwaysHappy = require("./helpers/needs/always_happy.js")
const AlwaysSad = require("./helpers/needs/always_sad.js")
const FakeTypes = require("./helpers/fake_types.js")

describe("colorize", function () {
  describe("unsatisfied need", function () {
    it("colors the need red", function () {
      let need = new AlwaysSad()
      need.satisfied = false
      let result = colorize(need)
      expect(result).toBe(colors.red(`{
  "type": "always_sad",
  "satisfied": false
}`))
    })
  })

  describe("unsatisfied, but optional need", function () {
    it("colors the need yellow", function () {
      let need = new AlwaysSad()
      need.optional = true
      need.satisfied = false
      let result = colorize(need)
      expect(result).toBe(colors.yellow(`{
  "type": "always_sad",
  "optional": true,
  "satisfied": false
}`))
    })
  })

  describe("satisfied need", function () {
    it("does not color the need", function () {
      let need = new AlwaysHappy()
      need.satisfied = true
      let result = colorize(need)
      expect(result).toBe((`{
  "type": "always_happy",
  "satisfied": true
}`))
    })
  })

  describe("undefined satisfied need", function () {
    it("does not color the need", function () {
      let need = new AlwaysHappy()
      let result = colorize(need)
      expect(result).toBe(`{
  "type": "always_happy"
}`)
    })
  })
})

describe("formatNeeds", function () {
  let needs
  beforeEach(function () {
    needs = [
      new AlwaysHappy(),
      new AlwaysSad(),
      new AlwaysSad()
    ]
    needs[0].satisfied = true
    needs[1].satisfied = false
    needs[2].optional = true
    needs[2].satisfied = false
  })

  describe("colorized", function () {
    it("returns the stringified needs without colors", function () {
      let result = formatNeeds(needs, true)
      expect(result).toBe(`[
  {
    "type": "always_happy",
    "satisfied": true
  },
  ` + colors.red("{") + `
  ` + colors.red("  \"type\": \"always_sad\",") + `
  ` + colors.red("  \"satisfied\": false") + `
  ` + colors.red("}") + `,
  ` + colors.yellow("{") + `
  ` + colors.yellow("  \"type\": \"always_sad\",") + `
  ` + colors.yellow("  \"optional\": true,") + `
  ` + colors.yellow("  \"satisfied\": false") + `
  ` + colors.yellow("}") + `
]`)
    })
  })

  describe("not colorized", function () {
    it("returns the stringified needs without colors", function () {
      let result = formatNeeds(needs, false)
      expect(result).toBe(`[
  {
    "type": "always_happy",
    "satisfied": true
  },
  {
    "type": "always_sad",
    "satisfied": false
  },
  {
    "type": "always_sad",
    "optional": true,
    "satisfied": false
  }
]`)
    })
  })
})

describe("check", function () {
  let needs
  beforeEach(function () {
    spyOn(console, "error")
    spyOn(console, "log")
  })

  describe("all satisfied needs", function () {
    beforeEach(function () {
      needs = new And({
        type: "and",
        needs: [{
          type: "always_happy"
        }],
      }, new FakeTypes())
    })

    it("returns true and prints all needs", async function () {
      await expectAsync(check(needs, {})).toBeResolvedTo(true)

      expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
        type: "always_happy",
        satisfied: true
      }], null, 2))
    })

    describe("list only satisfied needs", function () {
      it("prints the list of needs", async function () {
        await expectAsync(check(needs, {
          satisfied: true
        })).toBeResolvedTo(true)

        expect(console.log).toHaveBeenCalledWith(JSON.stringify([
          {
            type: "always_happy",
            satisfied: true
          }
        ], null, 2))
      })
    })

    describe("list only unsatisfied needs", function () {
      it("prints an empty list", async function () {
        await expectAsync(check(needs, {
          unsatisfied: true
        })).toBeResolvedTo(true)

        expect(console.log).toHaveBeenCalledWith("[]")
      })
    })

    describe("identify option is true", function () {
      it("calls check on the needs with andIdentify true", async function () {
        await expectAsync(check(needs, {
          identify: true
        })).toBeResolvedTo(true)

        expect(console.log).toHaveBeenCalledWith(JSON.stringify([
          {
            type: "always_happy",
            satisfied: true,
            identity: "identified!"
          }
        ], null, 2))
      })
    })
  })

  describe("one unsatisfied satisfied need", function () {
    beforeEach(function () {
      needs = new And({
        type: "and",
        needs: [{
          type: "always_happy"
        }, {
          type: "always_sad"
        }],
      }, new FakeTypes())
    })

    it("returns false and prints all needs", async function () {
      await expectAsync(check(needs, {})).toBeResolvedTo(false)

      expect(console.error).toHaveBeenCalledWith("Some needs were unsatisfied:")
      expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
        type: "always_happy",
        satisfied: true
      }, {
        type: "always_sad",
        satisfied: false
      }], null, 2))
    })

    describe("list only satisfied needs", function () {
      it("prints the list of satisfied needs", async function () {
        await expectAsync(check(needs, {
          satisfied: true
        })).toBeResolvedTo(false)

        expect(console.error).toHaveBeenCalledWith("Some needs were unsatisfied:")
        expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
          type: "always_happy",
          satisfied: true
        }], null, 2))
      })
    })

    describe("list only unsatisfied needs", function () {
      it("prints the list of unsatisfied needs", async function () {
        await expectAsync(check(needs, {
          unsatisfied: true
        })).toBeResolvedTo(false)

        expect(console.error).toHaveBeenCalledWith("Some needs were unsatisfied:")
        expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
          type: "always_sad",
          satisfied: false
        }], null, 2))
      })
    })
  })

  describe("one optional unsatisfied satisfied need", function () {
    beforeEach(function () {
      needs = new And({
        type: "and",
        needs: [{
          type: "always_sad",
          optional: true
        }],
      }, new FakeTypes())
    })

    it("returns true", async function () {
      await expectAsync(check(needs, {})).toBeResolvedTo(true)

      expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
        type: "always_sad",
        optional: true,
        satisfied: false
      }], null, 2))
    })

    describe("list only satisfied needs", function () {
      it("prints the list of satisfied needs", async function () {
        await expectAsync(check(needs, {
          satisfied: true
        })).toBeResolvedTo(true)

        expect(console.log).toHaveBeenCalledWith("[]")
      })
    })

    describe("list only unsatisfied needs", function () {
      it("prints the list of unsatisfied needs", async function () {
        await expectAsync(check(needs, {
          unsatisfied: true
        })).toBeResolvedTo(true)

        expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
          type: "always_sad",
          optional: true,
          satisfied: false
        }], null, 2))
      })
    })
  })

  describe("a broken need", function () {
    beforeEach(function () {
      needs = new And({
        type: "and",
        needs: [{
          type: "always_broken"
        }],
      }, new FakeTypes())
    })

    it("throws", async function () {
      let brokenNeed = needs.needs[0]
      await expectAsync(check(needs, {})).toBeRejectedWith({
        need: needs,
        reason: {
          need: brokenNeed,
          reason: "I'm always broken"
        }
      })
    })
  })
})