const { Given, Then } = require("cucumber")
const { expect } = require("chai")
const fs = require("fs").promises
const path = require("path")

Given("a needs file with a description field", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "description": "some description"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file with an incorrect description field", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "description": [2]
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Then("I see the description in the output", async function () {
  expect(this.stdout).to.match(/some description/)
})
