const Or = require("../../lib/needs/or.js")
const FakeTypes = require("../helpers/fake_types.js")

describe("or", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new Or("")
      }).toThrowError(Or.ValidationError, "data for type \"or\" is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new Or({})
      }).toThrowError(Or.ValidationError, "data for type \"or\" is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new Or({
          "type": "the-wrong-type",
          "needs": []
        })
      }).toThrowError(Or.ValidationError, "data for type \"or\" is not valid")
    })

    it("throws on invalid needs", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": "pete"
        })
      }).toThrowError(Or.ValidationError, "data for type \"or\" is not valid")
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

    it("works with the description field", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": [{
            "type": "always_happy"
          }],
          "description": "This is my description"
        }, new FakeTypes())
      }).not.toThrow()
    })

    it("works with the identify field", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": [{
            "type": "always_happy"
          }],
          "identify": "echo \"Hello World\""
        }, new FakeTypes())
      }).not.toThrow()
    })

    it("works with the metadata field", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": [{
            "type": "always_happy"
          }],
          "metadata": {
            "test-environment": "units"
          }
        }, new FakeTypes())
      }).not.toThrow()
    })

    it("works with the optional field", function () {
      expect(function () {
        new Or({
          "type": "or",
          "needs": [{
            "type": "always_happy"
          }],
          "optional": true
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
        
        await expectAsync(need.check()).toBeResolvedTo(need)
        expect(need.satisfied).toBe(true)
        expect(need.getSatisfiedNeeds()).toEqual([])
        expect(need.getUnsatisfiedNeeds()).toEqual([])
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
          
          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)
          expect(need.getSatisfiedNeeds()).toEqual(need.needs)
          expect(need.getUnsatisfiedNeeds()).toEqual([])
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

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)
          expect(need.getSatisfiedNeeds()).toEqual([ need.needs[0], need.needs[2], need.needs[3] ])
          expect(need.getUnsatisfiedNeeds()).toEqual([ need.needs[1] ])
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

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
          expect(need.getSatisfiedNeeds()).toEqual([])
          expect(need.getUnsatisfiedNeeds()).toEqual(need.needs)
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