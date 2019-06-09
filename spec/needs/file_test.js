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
    it("returns false if the file is not present", function (done) {
      let need = new File({
        "type": "file",
        "path": "/this/file/does/not/exist"
      })

      need.check((err, satisfied) => {
        expect(err).toBeNull()
        expect(satisfied).toBe(false)
        done()
      })
    })

    it("returns an error if there was a problem looking for the file", function (done) {
      let need = new File({
        "type": "file",
        "path": "file-path"
      })

      spyOn(need.fs, "access")
      need.fs.access.and.callFake((path, callback) => {
        callback("some-other-error")
      })

      // eslint-disable-next-line no-unused-vars
      need.check((err, satisfied) => {
        expect(need.fs.access).toHaveBeenCalledWith("file-path",  jasmine.any(Function))
        expect(err).not.toBeNull()
        done()
      })
    })

    it("returns true if the file is present", function (done) {
      let need = new File({
        "type": "file",
        "path": __filename
      })

      need.check((err, satisfied) => {
        expect(err).toBeNull()
        expect(satisfied).toBe(true)
        done()
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