let File = require("../../lib/needs/file.js")

describe("file", function () {
  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new File("")
      }).toThrowError(File.ValidationError, "data for type \"file\" is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new File({})
      }).toThrowError(File.ValidationError, "data for type \"file\" is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new File({
          "type": "the-wrong-type",
          "path": "pete"
        })
      }).toThrowError(File.ValidationError, "data for type \"file\" is not valid")
    })

    it("returns true on valid input", function () {
      expect(function () {
        new File({
          "type": "file",
          "path": "/a/path/to/a/file"
        })
      }).not.toThrow()
    })

    it("works with the description field", function () {
      expect(function () {
        new File({
          "type": "file",
          "path": "/a/path/to/a/file",
          "description": "This is my description"
        })
      }).not.toThrow()
    })

    it("works with the identify field", function () {
      expect(function () {
        new File({
          "type": "file",
          "path": "/a/path/to/a/file",
          "identify": "echo \"Hello World\""
        })
      }).not.toThrow()
    })

    it("works with the metadata field", function () {
      expect(function () {
        new File({
          "type": "file",
          "path": "/a/path/to/a/file",
          "metadata": {
            "test-environment": "units"
          }
        })
      }).not.toThrow()
    })

    it("works with the optional field", function () {
      expect(function () {
        new File({
          "type": "file",
          "path": "/a/path/to/a/file",
          "optional": true
        })
      }).not.toThrow()
    })

    it("works with the validate.jsonschema field", function () {
      expect(function () {
        new File({
          type: "file",
          path: "/a/path/to/a/file",
          validate: {
            jsonschema: {}
          }
        })
      }).not.toThrow()
    })

    it("throws on invalid jsonschema", function () {
      expect(function () {
        new File({
          type: "file",
          path: "/a/path/to/a/file",
          validate: {
            jsonschema: "this is not valid"
          }
        })
      }).toThrowError(File.ValidationError, "data for type \"file\" is not valid")
    })
  })

  describe("check", function () {
    describe("file does not exist", function () {
      it("returns false", async function () {
        let need = new File({
          "type": "file",
          "path": "/path/to/a/file",
        })

        spyOn(need, "glob").and.callFake(() => Promise.resolve([]))

        await expectAsync(need.check()).toBeResolvedTo(need)
        expect(need.satisfied).toBe(false)  
        expect(need.glob).toHaveBeenCalledWith("/path/to/a/file")
      })
    })

    describe("there was a problem looking for the file", function () {
      it("returns an error", async function () {
        let need = new File({
          "type": "file",
          "path": "/path/to/a/file",
        })

        spyOn(need, "glob").and.callFake(() => Promise.reject("some-other-error"))

        await expectAsync(need.check()).toBeRejectedWith({
          need,
          reason: "failed to check for file"
        })
        expect(need.glob).toHaveBeenCalledWith("/path/to/a/file")
      })
    })

    it("returns true if the file is present", async function () {
      let need = new File({
        "type": "file",
        "path": "/path/to/a/file",
      })

      spyOn(need, "glob").and.callFake(() => Promise.resolve(["/path/to/a/file"]))

      await expectAsync(need.check()).toBeResolvedTo(need)
      expect(need.satisfied).toBe(true)
      expect(need.glob).toHaveBeenCalledWith("/path/to/a/file")
    })

    describe("jsonschema", function () {
      describe("file check is not satisfied", function () {
        it("does not invoke the schema check", async function () {
          let need = new File({
            "type": "file",
            "path": "/path/to/a/file",
            "validate": {
              "jsonschema": {}
            }
          })

          spyOn(need, "glob").and.callFake(() => Promise.resolve([]))

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
          expect(need.valid).toBeUndefined()
        })
      })

      describe("file can't be read", function () {
        it("does not invoke the schema check", async function () {
          let need = new File({
            "type": "file",
            "path": "/path/to/a/file",
            "validate": {
              "jsonschema": {}
            }
          })

          spyOn(need, "glob").and.callFake(() => Promise.resolve(["/path/to/a/file"]))
          spyOn(need, "readFile").and.throwError("failed to read file")

          await expectAsync(need.check()).toBeRejectedWith({
            need,
            reason: new Error("failed to read file")
          })
        })
      })

      describe("file is not json", function () {
        it("does not invoke the schema check", async function () {
          let need = new File({
            "type": "file",
            "path": "/path/to/a/file",
            "validate": {
              "jsonschema": {}
            }
          })

          spyOn(need, "glob").and.callFake(() => Promise.resolve(["/path/to/a/file"]))
          spyOn(need, "readFile").and.returnValue("This is just a file")
          spyOn(need, "validator").and.callThrough()

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
          expect(need.valid).toBe(false)
          expect(need.validator).not.toHaveBeenCalled()
        })
      })

      describe("file contents do not meet the schema", function () {
        it("returns false", async function () {
          let need = new File({
            type: "file",
            path: "/path/to/a/file",
            validate: {
              jsonschema: {
                type: "string"
              }
            }
          })

          spyOn(need, "glob").and.callFake(() => Promise.resolve(["/path/to/a/file"]))
          spyOn(need, "readFile").and.returnValue("[1, 2, 3]")
          spyOn(need, "validator")

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(false)
          expect(need.validator).toHaveBeenCalledWith([1, 2, 3])
          expect(need.valid).toBe(false)
        })
      })

      describe("file contents meets the schema", function () {
        it("returns true", async function () {
          let need = new File({
            type: "file",
            path: "/path/to/a/file",
            validate: {
              jsonschema: {
                type: "array"
              }
            }
          })

          spyOn(need, "glob").and.callFake(() => Promise.resolve(["/path/to/a/file"]))
          spyOn(need, "readFile").and.returnValue("[1, 2, 3]")
          spyOn(need, "validator").and.callThrough()

          await expectAsync(need.check()).toBeResolvedTo(need)
          expect(need.satisfied).toBe(true)
          expect(need.validator).toHaveBeenCalledWith([1, 2, 3])
          expect(need.valid).toBe(true)
        })
      })
    })
  })

  describe("info", function () {
    it("is set", function () {
      expect(File.info).toBeDefined()
    })
  })

  describe("name", function () {
    it("is set", function () {
      expect(File.type).toBe("file")
    })
  })
})