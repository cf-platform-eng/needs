const Aggregate = require("./aggregate.js")
const Binary = require("./binary.js")
const EnvironmentVariable = require("./environment_variable.js")

class OpsManager extends Aggregate {
  constructor(input, types) {
    super(OpsManager.schema, input, types)
    this.needs = [
      new Binary({type: "binary", name: "om"}),
      new EnvironmentVariable({type: "environment_variable", name: "OM_TARGET"}),
      new EnvironmentVariable({type: "environment_variable", name: "OM_USERNAME"}),
      new EnvironmentVariable({type: "environment_variable", name: "OM_PASSWORD"}),
      new EnvironmentVariable({type: "environment_variable", name: "OM_SKIP_SSL_VALIDATION", optional: true})
    ]
    this.iaas = input.iaas
  }
  
  isSatisfied(numUnsatisfied) {
    return numUnsatisfied === 0
  }

  async check(andIdentify) {
    await super.check(andIdentify)

    if (!this.satisfied) {
      return Promise.resolve(this)
    }

    let diagnosticReport
    try {
      let { stdout } = await this.exec("om diagnostic-report")
      diagnosticReport = JSON.parse(stdout)
    } catch (e) {
      this.satisfied = false
      return Promise.reject({
        need: this,
        reason: "Could not communicate with PCF: " + e.stderr
      })
    }

    this.actual_iaas = diagnosticReport.infrastructure_type

    if (this.iaas && this.iaas !== this.actual_iaas) {
      this.satisfied = false
    }

    return Promise.resolve(this)
  }
}

OpsManager.type = "ops_manager"
OpsManager.info = `Checks for access to an Ops Manager environment

This will automatically create needs for:
  * Binary: om (used to check access to the Ops Manager environment)
  * Environment variable: OM_TARGET (The URL for the Ops Manager)
  * Environment variable: OM_USERNAME
  * Environment variable: OM_PASSWORD
  * Environment variable: OM_SKIP_SSL_VALIDATION (optional)

An optional "iaas" filter can be added to limit which IaaS the Ops Manager should be using

Example:
{
  "type": "ops_manager",
  "iaas": "google"
}`
OpsManager.schema = {
  type: "object",
  properties: {
    type:        { type: "string", pattern: `^${OpsManager.type}$` },
    iaas:        { type: "string" },

    description: { type: "string" },
    identify:    { type: "string" },
    optional:    { type: "boolean" }
  },
  required: ["type"],
  additionalProperties: false
}

module.exports = OpsManager
