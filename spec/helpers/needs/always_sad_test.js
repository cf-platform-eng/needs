const AlwaysSad = require("./always_sad.js")

describe("AlwaysSad", function () {
  describe("check", function () {
    it("always resolves to false", async function () {
      let need = new AlwaysSad({
        type: "always_sad"
      })
      await expectAsync(need.check()).toBeResolvedTo(need)
      expect(need.satisfied).toBe(false)
    })
  })
})
