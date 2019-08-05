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
      
      describe("binary path is not a file", function () {
        let binaryPath = ""
        beforeEach(function (done) {
          fs.mkdtemp("binary-test-temp", async (err, directory) => {
            expect(err).toBeNull()
            binaryPath = directory
            done()
          })
        })

        afterEach(function (done) {
          fs.rmdir(binaryPath, (err) => {
            expect(err).toBeNull()
            done()
          })
        })
        
        it("returns false", async function () {
          let need = new Binary({
            "type": "binary",
            "path": binaryPath
          })
    
          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
        })
      })

      describe("binary path is not executable", function () {
        let dir = ""
        let binaryPath = ""
        beforeEach(function (done) {
          fs.mkdtemp("binary-test-temp", async (err, directory) => {
            expect(err).toBeNull()
            dir = directory

            binaryPath = path.join(dir, "test-binary")
            fs.writeFile(binaryPath, "touched", (err) => {
              expect(err).toBeNull()
            })
            done()
          })
        })

        afterEach(function (done) {
          fs.unlink(binaryPath, (err) => {
            expect(err).toBeNull()
            fs.rmdir(dir, (err) => {
              expect(err).toBeNull()
              done()
            })  
          })
        })

        it("returns false", async function () {
          let need = new Binary({
            "type": "binary",
            "path": binaryPath
          })

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
        })
      })

      describe("looking for the binary path fails", function () {
        it("returns an error", async function () {
          let need = new Binary({
            "type": "binary",
            "path": "/some/file/path"
          })

          spyOn(need, "isExecutable")
          need.isExecutable.and.callFake((path, callback) => {
            callback("some-other-error")
          })
  
          await expectAsync(need.check()).toBeRejected()
          expect(need.isExecutable).toHaveBeenCalledWith("/some/file/path",  jasmine.any(Function))
        })
      })

      describe("binary was found and executable", function () {
        it("returns true", async function () {
          let need = new Binary({
            "type": "binary",
            "path": "/bin/bash"
          })

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)
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

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
        })
      })

      describe("looking for the binary fails", function () {
        it("returns an error", async function () {
          let need = new Binary({
            "type": "binary",
            "name": "some-binary"
          })

          spyOn(need, "which")
          need.which.and.callFake((path, callback) => {
            callback("some-other-error")
          })
  
          await expectAsync(need.check()).toBeRejected()
          expect(need.which).toHaveBeenCalledWith("some-binary",  jasmine.any(Function))
        })
      })

      describe("binary found in the PATH", function () {
        it("returns true", async function () {
          let need = new Binary({
            "type": "binary",
            "name": "node"
          })

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)    
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