const Binary = require("../../lib/needs/binary.js")
const fs = require("fs")
const path = require("path")

describe("binary", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new Binary("")
      }).toThrowError(Binary.ValidationError, "data for type \"binary\" is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new Binary({})
      }).toThrowError(Binary.ValidationError, "data for type \"binary\" is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new Binary({
          "type": "the-wrong-type",
          "path": "pete"
        })
      }).toThrowError(Binary.ValidationError, "data for type \"binary\" is not valid")
    })

    it("throws on missing path or name", function () {
      expect(function () {
        new Binary({
          "type": "binary"
        })
      }).toThrowError(Binary.ValidationError, "data for type \"binary\" is not valid")
    })

    it("returns true on valid path input", function () {
      expect(function () {
        new Binary({
          "type": "binary",
          "path": "/a/path/to/a/file"
        })
      }).not.toThrow()
    })

    it("returns true on valid name input", function () {
      expect(function () {
        new Binary({
          "type": "binary",
          "name": "my-binary"
        })
      }).not.toThrow()
    })

    it("throws with both name and path specified", function () {
      expect(function () {
        new Binary({
          "type": "binary",
          "name": "my-binary",
          "path": "/a/path/to/a/file"
        })
      }).toThrowError(Binary.ValidationError, "data for type \"binary\" is not valid")
    })
  })

  describe("check", function () {
    describe("binary path given", function () {
      describe("binary path is not present", function () {
        it("returns false", async function () {
          let need = new Binary({
            "type": "binary",
            "path": "/this/binary/does/not/exist"
          })

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
        })
      })

      describe("binary path is not executable", function () {
        it("returns false", async function () {
          let need = new Binary({
            "type": "binary",
            "path": "/some/file/path"
          })

          spyOn(need, "isExecutable").and.callFake(() => Promise.resolve(false))

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
          expect(need.isExecutable).toHaveBeenCalledWith("/some/file/path")
        })
      })

      describe("looking for the binary path fails", function () {
        it("returns an error", async function () {
          let need = new Binary({
            "type": "binary",
            "path": "/some/file/path"
          })

          spyOn(need, "isExecutable").and.callFake(() => Promise.reject("some-other-error"))
  
          await expectAsync(need.check()).toBeRejected()
          expect(need.isExecutable).toHaveBeenCalledWith("/some/file/path")
        })
      })

      describe("binary was found and executable", function () {
        it("returns true", async function () {
          let need = new Binary({
            "type": "binary",
            "path": "/some/file/path"
          })

          spyOn(need, "isExecutable").and.callFake(() => Promise.resolve(true))

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)
          expect(need.isExecutable).toHaveBeenCalledWith("/some/file/path")
        })
      })
    })
  
    describe("binary name given", function () {
      describe("binary is not found", function () {
        it("returns false", async function () {
          let need = new Binary({
            "type": "binary",
            "name": "this-binary-does-not-exist"
          })

          spyOn(need, "which").and.callFake(() => Promise.reject({code: "ENOENT"}))

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
          expect(need.which).toHaveBeenCalledWith("this-binary-does-not-exist")
        })
      })

      describe("looking for the binary fails", function () {
        it("returns an error", async function () {
          let need = new Binary({
            "type": "binary",
            "name": "this-binary-fails"
          })

          spyOn(need, "which").and.callFake(() => Promise.reject("some-other-error"))
  
          await expectAsync(need.check()).toBeRejected()
          expect(need.which).toHaveBeenCalledWith("this-binary-fails")
        })
      })

      describe("binary found in the PATH", function () {
        it("returns true", async function () {
          let need = new Binary({
            "type": "binary",
            "name": "this-binary-exists"
          })

          spyOn(need, "which").and.callFake(() => Promise.resolve(["/path/to/this-binary-exists"]))

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)
          expect(need.which).toHaveBeenCalledWith("this-binary-exists")
        })
      })
    })
  })

  describe("info", function () {
    it("is set", function () {
      expect(Binary.info).toBeDefined()
    })
  })

  describe("name", function () {
    it("is set", function () {
      expect(Binary.type).toBe("binary")
    })
  })
})