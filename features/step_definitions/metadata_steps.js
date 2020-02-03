const { Given, Then } = require("cucumber")
const { expect } = require("chai")
const fs = require("fs").promises
const path = require("path")

Given("a needs file with a metadata field", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "metadata": {
      "name": "feature-test-need",
      "version-range": {
        "min": 0,
        "max": 1
      }
    }
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file with an invalid metadata field", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "metadata": [2]
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Then("I see the metadata in the output", async function () {
  expect(this.stdout).to.match(/feature-test-need/)
})
