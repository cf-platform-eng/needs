const { Given } = require("cucumber")
const fs = require("fs").promises
const path = require("path")

Given("a needs file that checks for an environment variable", async function () {
  let data = [{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file that checks for a list of environment variables", async function () {
  let data = [{
    "type": "environment_variable",
    "names": [
      "MY_ENVIRONMENT_VARIABLE_1",
      "MY_ENVIRONMENT_VARIABLE_2"
    ]
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

Given("those environment variables are defined", function () {
  process.env.MY_ENVIRONMENT_VARIABLE_1 = "set"
  process.env.MY_ENVIRONMENT_VARIABLE_2 = "set"
})

Given("only one environment variable is defined", function () {
  process.env.MY_ENVIRONMENT_VARIABLE_1 = "set"
})

Given("those environment variables are not defined", function () {
  delete process.env.MY_ENVIRONMENT_VARIABLE_1
  delete process.env.MY_ENVIRONMENT_VARIABLE_2
})
