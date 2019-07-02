const { Given } = require("cucumber")
const fs = require("fs").promises
const path = require("path")

Given("a needs file that checks for a binary using a path", async function () {
  let data = [{
    "type": "binary",
    "path": path.join(this.tmpDir, "my-test-binary")
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file that checks for a binary using a name", async function () {
  let data = [{
    "type": "binary",
    "name": "my-test-binary"
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("that binary does not exist", function () {})

Given("that binary exists, but it is not executable", async function () {
  this.exampleFile = path.join(this.tmpDir, "my-test-binary")
  await fs.writeFile(this.exampleFile, "hi")
})

Given("that binary exists", async function () {
  this.exampleFile = path.join(this.tmpDir, "my-test-binary")
  await fs.writeFile(this.exampleFile, "hi")
  await fs.chmod(this.exampleFile, "0755")
})

Given("that binary exists in the PATH", async function () {
  this.exampleFile = path.join(this.tmpDir, "my-test-binary")
  await fs.writeFile(this.exampleFile, "hi")
  await fs.chmod(this.exampleFile, "0755")
  process.env.PATH = `${this.tmpDir}:${process.env.PATH}`
})

