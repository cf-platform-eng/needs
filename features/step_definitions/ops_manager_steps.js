const { Given } = require("cucumber")
const fs = require("fs").promises
const path = require("path")

Given("a needs file with an ops_manager need", async function () {
  let data = [{
    "type": "ops_manager"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file with an ops_manager need with an iaas filter", async function () {
  let data = [{
    "type": "ops_manager",
    "iaas": "google"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("no ops manager environment is available", async function () {
  this.exampleFile = path.join(this.tmpDir, "om")
  await fs.writeFile(this.exampleFile, "echo \"om diagnostic-report failed\" >&2; exit 1")
  await fs.chmod(this.exampleFile, "0755")
  process.env.PATH = `${this.tmpDir}:${process.env.PATH}`
  delete process.env.OM_TARGET
  delete process.env.OM_USERNAME
  delete process.env.OM_PASSWORD
})

Given("a working ops manager", async function () {
  let result = {
    infrastructure_type: "google"
  }

  this.exampleFile = path.join(this.tmpDir, "om")
  await fs.writeFile(this.exampleFile, `echo '${JSON.stringify(result)}'`)
  await fs.chmod(this.exampleFile, "0755")
  process.env.PATH = `${this.tmpDir}:${process.env.PATH}`
  process.env.OM_TARGET="pcf.examle.com"
  process.env.OM_USERNAME="admin"
  process.env.OM_PASSWORD="password"
})

Given("a working ops manager in the right iaas", async function () {
  let result = {
    infrastructure_type: "google"
  }

  this.exampleFile = path.join(this.tmpDir, "om")
  await fs.writeFile(this.exampleFile, `echo '${JSON.stringify(result)}'`)
  await fs.chmod(this.exampleFile, "0755")
  process.env.PATH = `${this.tmpDir}:${process.env.PATH}`
  process.env.OM_TARGET="pcf.examle.com"
  process.env.OM_USERNAME="admin"
  process.env.OM_PASSWORD="password"
})

Given("a working ops manager in the wrong iaas", async function () {
  let result = {
    infrastructure_type: "petes-discount-cloud-computer-company"
  }

  this.exampleFile = path.join(this.tmpDir, "om")
  await fs.writeFile(this.exampleFile, `echo '${JSON.stringify(result)}'`)
  await fs.chmod(this.exampleFile, "0755")
  process.env.PATH = `${this.tmpDir}:${process.env.PATH}`
  process.env.OM_TARGET="pcf.examle.com"
  process.env.OM_USERNAME="admin"
  process.env.OM_PASSWORD="password"
})
