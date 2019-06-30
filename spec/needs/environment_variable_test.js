let EnvironmentVariable = require("../../lib/needs/environment_variable.js")

describe("environment_variable", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new EnvironmentVariable("")
      }).toThrowError(EnvironmentVariable.ValidationError, "data is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new EnvironmentVariable({})
      }).toThrowError(EnvironmentVariable.ValidationError, "data is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "the-wrong-type",
          "name": "pete"
        })
      }).toThrowError(EnvironmentVariable.ValidationError, "data is not valid")
    })

    it("throws on invalid environment variable", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "environment_variable",
          "name": "this is = wrong"
        })
      }).toThrowError(EnvironmentVariable.ValidationError, "data is not valid")
    })

    it("works on valid name", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "environment_variable",
          "name": "PIVNET_TOKEN"
        })
      }).not.toThrow()
    })

    it("throws on empty names", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "environment_variable",
          "names": []
        })
      }).toThrowError(EnvironmentVariable.ValidationError, "data is not valid")
    })

    it("throws on invalid names", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "environment_variable",
          "names": "what is this, some kind of string?"
        })
      }).toThrowError(EnvironmentVariable.ValidationError, "data is not valid")
    })

    it("works on valid names", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "environment_variable",
          "names": [
            "PIVNET_TOKEN"
          ]
        })
      }).not.toThrow()
    })

    it("works on valid name and names", function () {
      expect(function () {
        new EnvironmentVariable({
          "type": "environment_variable",
          "name": "PRODUCT_NAME",
          "names": [
            "PIVNET_TOKEN"
          ]
        })
      }).not.toThrow()
    })
  })

  describe("check with name", function () {
    let need = new EnvironmentVariable({
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE"
    })

    it("returns false if the environment variable is not set", async function () {
      delete process.env.MY_ENVIRONMENT_VARIABLE
      await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: false })
    })

    it("returns true if the environment variable is set", async function () {
      process.env.MY_ENVIRONMENT_VARIABLE = "set"
      await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true })
    })
  })


  describe("check with names", function () {
    let need = new EnvironmentVariable({
      "type": "environment_variable",
      "names": [
        "MY_ENVIRONMENT_VARIABLE"
      ]
    })

    it("returns false if the environment variable is not set", async function () {
      delete process.env.MY_ENVIRONMENT_VARIABLE
      await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: false })
    })

    it("returns true if the environment variable is set", async function () {
      process.env.MY_ENVIRONMENT_VARIABLE = "set"
      await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true })
    })
  })

  describe("info", function () {
    it("is set", function () {
      expect(EnvironmentVariable.info).toBeDefined()
    })
  })

  describe("name", function () {
    it("is set", function () {
      expect(EnvironmentVariable.type).toBe("environment_variable")
    })
  })
})