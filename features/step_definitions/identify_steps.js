const assert = require("assert")
const { Given, Then } = require("cucumber")
const { expect } = require("chai")
const fs = require("fs").promises
const path = require("path")

Given("a needs file with an identify field", async function () {
  this.resultFile = path.join(this.tmpDir, "identify-called")
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "identify": `touch ${this.resultFile} && echo "hello world"`
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file with a failing identify field", async function () {
  this.resultFile = path.join(this.tmpDir, "identify-called")
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "identify": `touch ${this.resultFile} && echo "error field" >&2 && exit 1`
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Then("the identity command was called", async function () {
  await assert.doesNotReject(fs.access(this.resultFile))
})

Then("the identity command was not called", async function () {
  await assert.rejects(fs.access(this.resultFile), {
    code: "ENOENT"
  })
})

Then("the identity field is populated", function () {
  let output = JSON.parse(this.stdout)
  expect(output[0].identity).to.equal("hello world")
})

Then("the identity field is not populated", function () {
  let output = JSON.parse(this.stdout)
  expect(output[0].identity).to.be.undefined
})

Then("the identity field is populated with an error", function () {
  let output = JSON.parse(this.stdout)
  expect(output[0].identity).to.equal(`Failed to run identify: Error: Command failed: touch ${this.tmpDir}/identify-called && echo "error field" >&2 && exit 1\nerror field`)
})