const { Given } = require("cucumber")
const fs = require("fs").promises
const path = require("path")

Given("a needs file that checks for a file", async function () {
  let data = [{
    "type": "file",
    "path": path.join(this.tmpDir, "my-file")
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file that checks for a file with a glob", async function () {
  let data = [{
    "type": "file",
    "path": path.join(this.tmpDir, "*file")
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("that file exists", async function () {
  this.exampleFile = path.join(this.tmpDir, "my-file")
  await fs.writeFile(this.exampleFile, "hi")
})
Given("a matching file exists", async function () {
  this.exampleFile = path.join(this.tmpDir, "my-file")
  await fs.writeFile(this.exampleFile, "hi")
})
Given("that file does not exist", async function () {})
