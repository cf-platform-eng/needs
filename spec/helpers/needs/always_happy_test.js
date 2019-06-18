const AlwaysHappy = require("./always_happy.js")

describe("AlwaysHappy", function () {
  describe("check", function () {
    it("always resolves to true", async function () {
      let need = new AlwaysHappy()
      await expectAsync(need.check()).toBeResolvedTo({
        need,
        satisfied: true
      })
    })
  })
})
