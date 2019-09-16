let OpsManager = require("../../lib/needs/ops_manager.js")

describe("ops_manager", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new OpsManager("")
      }).toThrowError(OpsManager.ValidationError, "data for type \"ops_manager\" is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new OpsManager({})
      }).toThrowError(OpsManager.ValidationError, "data for type \"ops_manager\" is not valid")
    })
    
    it("throws on invalid type", function () {
      expect(function () {
        new OpsManager({
          "type": "the-wrong-type",
          "name": "pete"
        })
      }).toThrowError(OpsManager.ValidationError, "data for type \"ops_manager\" is not valid")
    })
    
    it("works with valid type", function () {
      expect(function () {
        new OpsManager({
          "type": "ops_manager"
        })
      }).not.toThrow()
    })
  
    it("throws on invalid iaas", function () {
      expect(function () {
        new OpsManager({
          "type": "ops_manager",
          "iaas": 123
        })
      }).toThrowError(OpsManager.ValidationError, "data for type \"ops_manager\" is not valid")
    })
    
    it("works with valid iaas", function () {
      expect(function () {
        new OpsManager({
          "type": "ops_manager",
          "iaas": "gcp"
        })
      }).not.toThrow()
    })
    
    it("works with the description field", function () {
      expect(function () {
        new OpsManager({
          "type": "ops_manager",
          "description": "This is my description"
        })
      }).not.toThrow()
    })

    it("works with the identify field", function () {
      expect(function () {
        new OpsManager({
          "type": "ops_manager",
          "identify": "echo \"Hello World\""
        })
      }).not.toThrow()
    })

    it("works with the optional field", function () {
      expect(function () {
        new OpsManager({
          "type": "ops_manager",
          "optional": true
        })
      }).not.toThrow()
    })
  })

  describe("check", function () {
    let need
    beforeEach(function () {
      need = new OpsManager({
        "type": "ops_manager"
      })
      spyOn(need, "exec").and.callFake(() => Promise.resolve({stdout: JSON.stringify({
        infrastructure_type: "google"
      })}))

      spyOn(need.needs[0], "which").and.callFake(() => Promise.resolve(["/path/to/om"]))

      process.env.OM_TARGET="my-opsman.isv.ci"
      process.env.OM_USERNAME="admin"
      process.env.OM_PASSWORD="fake-password"
      process.env.OM_SKIP_SSL_VALIDATION="true"
    })

    it("returns false if om is not on the path", async function () {
      need.needs[0].which.and.callFake(() => Promise.reject({code: "ENOENT"}))
      await expectAsync(need.check()).toBeResolvedTo(need)
      expect(need.satisfied).toBe(false)
    })

    it("returns false if the environment variables are not defined", async function () {
      delete process.env.OM_TARGET
      await expectAsync(need.check()).toBeResolvedTo(need)
      expect(need.satisfied).toBe(false)
    })

    it("returns false if the pcf is not accessible", async function () {
      need.exec.and.callFake(() => Promise.reject({stderr: "om diagnostic-report failed"}))
      await expectAsync(need.check()).toBeRejectedWith({
        need,
        reason: "Could not communicate with PCF: om diagnostic-report failed"
      })
      expect(need.satisfied).toBe(false)
    })

    it("returns true if the pcf environment is available", async function () {
      await expectAsync(need.check()).toBeResolvedTo(need)
      expect(need.satisfied).toBe(true)
    })

    describe("with iaas filter", function () {
      it("returns false if the pcf environment is on the wrong iaas", async function () {
        need.iaas = "petes-discount-cloud-computer-company"
        await expectAsync(need.check()).toBeResolvedTo(need)
        expect(need.satisfied).toBe(false)
      })

      it("returns true if the pcf environment is on the right iaas", async function () {
        need.iaas = "google"
        await expectAsync(need.check()).toBeResolvedTo(need)
        expect(need.satisfied).toBe(true)
      })
    })
  })

  describe("info", function () {
    it("is set", function () {
      expect(OpsManager.info).toBeDefined()
    })
  })

  describe("name", function () {
    it("is set", function () {
      expect(OpsManager.type).toBe("ops_manager")
    })
  })
})