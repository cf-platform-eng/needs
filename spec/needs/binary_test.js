let Binary = require("../../lib/needs/binary.js")

describe("binary", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new Binary("")
      }).toThrowError(Binary.ValidationError, "data is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new Binary({})
      }).toThrowError(Binary.ValidationError, "data is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new Binary({
          "type": "the-wrong-type",
          "path": "pete"
        })
      }).toThrowError(Binary.ValidationError, "data is not valid")
    })

    it("throws on missing path or name", function () {
      expect(function () {
        new Binary({
          "type": "binary"
        })
      }).toThrowError(Binary.ValidationError, "data is not valid")
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
      }).toThrowError(Binary.ValidationError, "data is not valid")
    })
  })

  describe("check", function () {
    // it("returns false if the file is not present", function () {
    //   let need = new File({
    //     "type": "file",
    //     "path": "/this/file/does/not/exist"
    //   })

    //   expectAsync(need.check()).toBeResolvedTo(false)
    // })

    // it("returns an error if there was a problem looking for the file", function () {
    //   let need = new File({
    //     "type": "file",
    //     "path": "file-path"
    //   })

    //   spyOn(need.fs, "access")
    //   need.fs.access.and.callFake((path, callback) => {
    //     callback("some-other-error")
    //   })

    //   expectAsync(need.check()).toBeRejected()
    //   expect(need.fs.access).toHaveBeenCalledWith("file-path",  jasmine.any(Function))
    // })

    // it("returns true if the file is present", function () {
    //   let need = new File({
    //     "type": "file",
    //     "path": __filename
    //   })

    //   expectAsync(need.check()).toBeResolvedTo(true)
    // })
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