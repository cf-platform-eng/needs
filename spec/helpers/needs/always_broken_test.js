const AlwaysBroken = require("./always_broken.js")

describe("AlwaysBroken", function () {
  describe("check", function () {
    it("always rejects", async function () {
      let need = new AlwaysBroken()
      await expectAsync(need.check()).toBeRejectedWith({
        need,
        reason: "I'm always broken"
      })
    })
  })
})
