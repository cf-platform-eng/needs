const { Given } = require("cucumber")
const fs = require("fs").promises
const path = require("path")

Given("a needs file that uses AND to combine two environment variable needs", async function () {
  let data = [{
    "type": "and",
    "needs": [{
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE_1"
    }, {
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE_2"
    }]
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})
