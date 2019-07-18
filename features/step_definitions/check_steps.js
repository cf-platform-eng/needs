const assert = require("assert")
const { Given, Then } = require("cucumber")

Given("the needs are satisfied", function () {
  process.env.MY_ENVIRONMENT_VARIABLE_1 = "set"
  process.env.MY_ENVIRONMENT_VARIABLE_2 = "set"
})

Given("a need is unsatisfied", function () {
  process.env.MY_ENVIRONMENT_VARIABLE_1 = "set"
  delete process.env.MY_ENVIRONMENT_VARIABLE_2
})

Then("I don't see any needs", function () {
  assert.equal(this.stdout, "[]")
})

Then("I see the satisfied need", function () {
  assert.equal(this.stdout, "[{\"type\":\"environment_variable\",\"name\":\"MY_ENVIRONMENT_VARIABLE_1\"}]")
})

Then("I see the unsatisfied need", function () {
  assert.equal(this.stdout, "[{\"type\":\"environment_variable\",\"name\":\"MY_ENVIRONMENT_VARIABLE_2\"}]")
})

Then("I see all of the needs", function () {
  assert.equal(this.stdout, "[{\"type\":\"environment_variable\",\"name\":\"MY_ENVIRONMENT_VARIABLE_1\"},{\"type\":\"environment_variable\",\"name\":\"MY_ENVIRONMENT_VARIABLE_2\"}]")
})
