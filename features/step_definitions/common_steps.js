const { Before, After, Given, When, Then } = require("cucumber")
const { exec } = require("child_process")
const { expect } = require("chai")
const fs = require("fs").promises
const path = require("path")
const { rimraf } = require("rimraf")

Before(async function () {
  this.initialPath = process.env.PATH
  this.tmpDir = await fs.mkdtemp("needs-features-")
})

After(async function () {
  await rimraf(this.tmpDir)
  process.env.PATH = this.initialPath
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

When("I check the needs with --no-identify", function (done) {
  this.needsProcess = exec(`./needs.js check --file ${this.needsFile} --no-identify`, {
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
  expect(this.needsReturnCode).to.equal(0)
})

Then("the needs list passes", function () {
  expect(this.needsReturnCode).to.equal(0)
})

Then("the needs check fails", function () {
  expect(this.needsReturnCode).to.equal(1)
})

Then("the needs list fails", function () {
  expect(this.needsReturnCode).to.equal(1)
})

Then("tells me that the needs file was invalid", function () {
  expect(this.stdout).to.be.empty
  expect(this.stderr).to.include("Needs file was invalid")
})

Then("tells me that the needs file was missing", function () {
  expect(this.stdout).to.be.empty
  expect(this.stderr).to.include("Needs file not found. Please try again with the \"--file\" option.")
})

Then("I see the list of needs", function () {
  expect(this.stdout).to.not.be.empty
})

Then("outputs the unsatisfied need", function () {
  expect(this.stderr).to.include("Some needs were unsatisfied:")
  expect(this.stdout).to.not.be.empty
})

