const check = require("../cmd/check.js")
const And = require("../lib/needs/and.js")
const FakeTypes = require("./helpers/fake_types.js")

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

    it("returns 0 and prints all needs", async function () {
      await expectAsync(check(needs, {})).toBeResolvedTo(0)

      expect(console.log).toHaveBeenCalledWith(JSON.stringify([{
        type: "always_happy",
        satisfied: true
      }], null, 2))
    })

    describe("list only satisfied needs", function () {
      it("prints the list of needs", async function () {
        await expectAsync(check(needs, {
          satisfied: true
        })).toBeResolvedTo(0)

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
        })).toBeResolvedTo(0)

        expect(console.log).toHaveBeenCalledWith("[]")
      })
    })

    describe("identify option is true", function () {
      it("calls check on the needs with andIdentify true", async function () {
        await expectAsync(check(needs, {
          identify: true
        })).toBeResolvedTo(0)

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

    it("returns 1 and prints all needs", async function () {
      await expectAsync(check(needs, {})).toBeResolvedTo(1)

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
        })).toBeResolvedTo(1)

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
        })).toBeResolvedTo(1)

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

    it("returns 0", async function () {
      await expectAsync(check(needs, {})).toBeResolvedTo(0)

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
        })).toBeResolvedTo(0)

        expect(console.log).toHaveBeenCalledWith("[]")  
      })
    })

    describe("list only unsatisfied needs", function () {
      it("prints the list of unsatisfied needs", async function () {
        await expectAsync(check(needs, {
          unsatisfied: true
        })).toBeResolvedTo(0)

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