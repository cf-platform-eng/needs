const { Given, Then } = require("cucumber")
const { expect } = require("chai")
const fs = require("fs").promises
const path = require("path")

Given("a needs file with an optional need", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "optional": true
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file with an incorrect optional need", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "description": [2]
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Then("I see the optional need in the output", function () {
  let expected = JSON.stringify([{
    "type": "environment_variable",
    "optional": true,
    "name": "MY_ENVIRONMENT_VARIABLE_1"
  }], null, 2)
  expect(this.stdout).to.equal(expected)
})

Then("I see the unsatisfied optional need in the output", function () {
  let expected = JSON.stringify([{
    "type": "environment_variable",
    "optional": true,
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "satisfied": false
  }], null, 2)
  expect(this.stdout).to.equal(expected)
})
