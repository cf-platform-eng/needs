let File = require("../../lib/needs/file.js")

describe("file", function () {
  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new File("")
      }).toThrowError(File.ValidationError, "data is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new File({})
      }).toThrowError(File.ValidationError, "data is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new File({
          "type": "the-wrong-type",
          "path": "pete"
        })
      }).toThrowError(File.ValidationError, "data is not valid")
    })

    it("returns true on valid input", function () {
      expect(function () {
        new File({
          "type": "file",
          "path": "/a/path/to/a/file"
        })
      }).not.toThrow()
    })
  })

  describe("check", function () {
    describe("file does not exist", function () {
      it("returns false", async function () {
        let need = new File({
          "type": "file",
          "path": "/path/to/a/file",
        })

        spyOn(need, "glob")
        need.glob.and.callFake((path, callback) => {
          callback(null, [])
        })

        await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: false })
        expect(need.glob).toHaveBeenCalledWith("/path/to/a/file",  jasmine.any(Function))
      })
    })

    describe("there was a problem looking for the file", function () {
      it("returns an error", async function () {
        let need = new File({
          "type": "file",
          "path": "/path/to/a/file",
        })

        spyOn(need, "glob")
        need.glob.and.callFake((path, callback) => {
          callback("some-other-error")
        })

        await expectAsync(need.check()).toBeRejected()
        expect(need.glob).toHaveBeenCalledWith("/path/to/a/file",  jasmine.any(Function))
      })
    })

    it("returns true if the file is present", async function () {
      let need = new File({
        "type": "file",
        "path": "/path/to/a/file",
      })

      spyOn(need, "glob")
      need.glob.and.callFake((path, callback) => {
        callback(null, ["/path/to/a/file"])
      })

      await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true })
      expect(need.glob).toHaveBeenCalledWith("/path/to/a/file",  jasmine.any(Function))
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