let Or = require("../../lib/needs/or.js")
const FakeTypes = require("../helpers/fake_types.js")

describe("or", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new Or("")
      }).toThrowError(Or.ValidationError, "data is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new Or({})
      }).toThrowError(Or.ValidationError, "data is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new Or({
          "type": "the-wrong-type",
          "needs": []
        })
      }).toThrowError(Or.ValidationError, "data is not valid")
    })

    it("throws on invalid needs", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": "pete"
        })
      }).toThrowError(Or.ValidationError, "data is not valid")
    })

    it("works on empty needs list", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": []
        })
      }).not.toThrow()
    })

    it("works on valid input", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": [{
            "type": "always_happy"
          }]
        }, new FakeTypes())
      }).not.toThrow()
    })
  })

  describe("check", function () {
    describe("empty needs list", function () {
      it("returns true", async function () {
        let need = new Or({
          "type": "or",
          "needs": []
        }, new FakeTypes())
        
        await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true, unsatisfiedNeeds: [] })
      })

      describe("satisfied needs list", function () {
        it("returns true", async function () {
          let need = new Or({
            "type": "or",
            "needs": [
              { "type": "always_happy" },
              { "type": "always_happy" },
              { "type": "always_happy" },
              { "type": "always_happy" }
            ]
          }, new FakeTypes())
          
          await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true, unsatisfiedNeeds: [] })
        })
      })

      describe("single unsatisfied need", function () {
        it("returns true", async function () {
          let need = new Or({
            "type": "or",
            "needs": [
              { "type": "always_happy" },
              { "type": "always_sad" },
              { "type": "always_happy" },
              { "type": "always_happy" }
            ]
          }, new FakeTypes())

          await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true, unsatisfiedNeeds: [ need.needs[1] ] })
        })
      })

      describe("all unsatisfied needs", function () {
        it("returns false", async function () {
          let need = new Or({
            "type": "or",
            "needs": [
              { "type": "always_sad" },
              { "type": "always_sad" },
              { "type": "always_sad" }
            ]
          }, new FakeTypes())

          await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: false, unsatisfiedNeeds: need.needs })
        })
      })

      describe("single broken need", function () {
        it("returns false", async function () {
          let need = new Or({
            "type": "or",
            "needs": [
              { "type": "always_happy" },
              { "type": "always_sad" },
              { "type": "always_broken" },
              { "type": "always_happy" }
            ]
          }, new FakeTypes())
          let brokenNeed = need.needs[2]

          await expectAsync(need.check()).toBeRejectedWith({ need, reason: {
            need: brokenNeed,
            reason: "I'm always broken"
          }})
        })
      })
    })
  })

  describe("info", function () {
    it("is set", function () {
      expect(Or.info).toBeDefined()
    })
  })

  describe("name", function () {
    it("is set", function () {
      expect(Or.type).toBe("or")
    })
  })
})