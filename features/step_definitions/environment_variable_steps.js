const assert = require("assert")
const { Before, After, Given, When, Then } = require("cucumber")
const { exec } = require("child_process")
const fs = require("fs").promises
const path = require("path")

Before(async function () {
  this.tmpDir = await fs.mkdtemp("needs-features-")
})

After(async function () {
  if (this.needsFile) {
    await fs.unlink(this.needsFile)
  }
  if (this.tmpDir) {
    await fs.rmdir(this.tmpDir)
  }
})

Given("a needs file that checks for an environment variable", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("that environment variable is defined", function () {
  process.env.MY_ENVIRONMENT_VARIABLE = "set"
})

Given("that environment variable is not defined", function () {
  delete process.env.MY_ENVIRONMENT_VARIABLE
})

When("I check the needs", function (done) {
  this.needsProcess = exec(`./needs.js check --file ${this.needsFile}`, {
    env: process.env    
  }, (err, stdout, stderr) => {
    this.needsReturnCode = err ? err.code : 0
    this.stdout = stdout
    this.stderr = stderr
    done()
  })
})

Then("the needs check passes", function () {
  assert.equal(this.needsReturnCode, 0)
})

Then("the needs check fails", function () {
  assert.equal(this.needsReturnCode, 1)
})

Then("outputs the unsatisfied need", function () {
  assert.equal(this.stderr.trim(), "Some needs were unsatisfied:")
  assert.equal(this.stdout.trim(), "[{\"type\":\"environment_variable\",\"name\":\"MY_ENVIRONMENT_VARIABLE\"}]")
})
