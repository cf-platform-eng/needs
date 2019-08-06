const assert = require("assert")
const { Before, After, Given, When, Then } = require("cucumber")
const { exec } = require("child_process")
const fs = require("fs").promises
const path = require("path")
const util = require("util")
const rimraf = util.promisify(require("rimraf"))

Before(async function () {
  this.tmpDir = await fs.mkdtemp("needs-features-")
})

After(async function () {
  await rimraf(this.tmpDir)
})

Given("no needs file", async function () {
  this.needsFile = path.join(this.tmpDir, "this", "path", "does", "not", "exist", "needs.json")
})

Given("a needs file", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
  }, {
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_2"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file that's not valid JSON", async function () {
  let data = "totally not json!! [}"
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, data)
})

Given("a needs file with invalid data", async function () {
  let data = [{
    "needs": "cannot",
    "have": "these",
    "keys": "!"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

When("I check the needs", function (done) {
  this.needsProcess = exec(`./needs.js check --file ${this.needsFile}`, {
    env: process.env
  }, (err, stdout, stderr) => {
    this.needsReturnCode = err ? err.code : 0
    this.stdout = stdout.trim()
    this.stderr = stderr.trim()
    done()
  })
})

When("I check the needs with --identify", function (done) {
  this.needsProcess = exec(`./needs.js check --file ${this.needsFile} --identify`, {
    env: process.env
  }, (err, stdout, stderr) => {
    this.needsReturnCode = err ? err.code : 0
    this.stdout = stdout.trim()
    this.stderr = stderr.trim()
    done()
  })
})

When("I check the needs with --satisfied", function (done) {
  this.needsProcess = exec(`./needs.js check --file ${this.needsFile} --satisfied`, {
    env: process.env
  }, (err, stdout, stderr) => {
    this.needsReturnCode = err ? err.code : 0
    this.stdout = stdout.trim()
    this.stderr = stderr.trim()
    done()
  })
})

When("I check the needs with --unsatisfied", function (done) {
  this.needsProcess = exec(`./needs.js check --file ${this.needsFile} --unsatisfied`, {
    env: process.env
  }, (err, stdout, stderr) => {
    this.needsReturnCode = err ? err.code : 0
    this.stdout = stdout.trim()
    this.stderr = stderr.trim()
    done()
  })
})

When("I list the needs", function (done) {
  this.needsProcess = exec(`./needs.js list --file ${this.needsFile}`, {
    env: process.env
  }, (err, stdout, stderr) => {
    this.needsReturnCode = err ? err.code : 0
    this.stdout = stdout.trim()
    this.stderr = stderr.trim()
    done()
  })
})

Then("the needs check passes", function () {
  assert.equal(this.needsReturnCode, 0)
})

Then("the needs list passes", function () {
  assert.equal(this.needsReturnCode, 0)
})

Then("the needs check fails", function () {
  assert.equal(this.needsReturnCode, 1)
})

Then("the needs list fails", function () {
  assert.equal(this.needsReturnCode, 1)
})

Then("tells me that the needs file was invalid", function () {
  assert.equal(this.stdout, "")
  assert(this.stderr.startsWith("Needs file was invalid"))
})

Then("tells me that the needs file was missing", function () {
  assert.equal(this.stdout, "")
  assert.equal(this.stderr, "Needs file not found. Please try again with the \"--file\" option.")
})

Then("I see the list of needs", function () {
  assert(this.stdout.length > 0)
})

Then("outputs the unsatisfied need", function () {
  assert.equal(this.stderr.trim(), "Some needs were unsatisfied:")
  assert(this.stdout.length > 0)
})

