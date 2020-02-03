const { Given, Then } = require("cucumber")
const { expect } = require("chai")

Given("the needs are satisfied", function () {
  process.env.MY_ENVIRONMENT_VARIABLE_1 = "set"
  process.env.MY_ENVIRONMENT_VARIABLE_2 = "set"
})

Given("the needs are not satisfied", function () {
  delete process.env.MY_ENVIRONMENT_VARIABLE_1
  delete process.env.MY_ENVIRONMENT_VARIABLE_2
})

Given("a need is unsatisfied", function () {
  process.env.MY_ENVIRONMENT_VARIABLE_1 = "set"
  delete process.env.MY_ENVIRONMENT_VARIABLE_2
})

Then("I don't see any needs", function () {
  expect(this.stdout).to.equal("[]")
})

Then("I see the satisfied need", function () {
  let expected = JSON.stringify([{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_1",
    "satisfied": true
  }], null, 2)
  expect(this.stdout).to.equal(expected)
})

Then("I see the unsatisfied need", function () {
  let expected = JSON.stringify([{
    "type": "environment_variable",
    "name": "MY_ENVIRONMENT_VARIABLE_2",
    "satisfied": false
  }], null, 2)
  expect(this.stdout).to.equal(expected)
})

Then("I see all of the needs", function () {
  let expected = JSON.stringify([
    {
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE_1",
      "satisfied": true
    }, {
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE_2",
      "satisfied": true
    }
  ], null, 2)
  expect(this.stdout).to.equal(expected)
})

Then("I see all of the needs showing the unsatisfied need", function () {
  let expected = JSON.stringify([
    {
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE_1",
      "satisfied": true
    }, {
      "type": "environment_variable",
      "name": "MY_ENVIRONMENT_VARIABLE_2",
      "satisfied": false
    }
  ], null, 2)
  expect(this.stdout).to.equal(expected)
})
