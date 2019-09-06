const { Given } = require("cucumber")
const fs = require("fs").promises
const path = require("path")

Given("a needs file that checks for a json file with a schema", async function () {
  this.exampleFile = path.join(this.tmpDir, "my-file.json")
  let data = [{
    type: "file",
    path: this.exampleFile,
    validate: {
      jsonschema: {
        type: "object",
        properties: {
          name: { type: "string"  },
          cool: { type: "boolean" }
        }
      }
    }
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("a needs file that checks for a json file with an invalid schema", async function () {
  let data = [{
    type: "file",
    path: this.exampleFile,
    validate: {
      jsonschema: "this is not json"
    }
  }]
  this.needsFile = path.join(this.tmpDir, "needs.json")
  await fs.writeFile(this.needsFile, JSON.stringify(data))
})

Given("that file is not json", async function () {
  await fs.writeFile(this.exampleFile, "This not not valid JSON")
})

Given("that file does not meet the schema", async function () {
  await fs.writeFile(this.exampleFile, JSON.stringify({
    "cool": "ice cold",
    "name": 123
  }))
})

Given("that file meets the schema", async function () {
  await fs.writeFile(this.exampleFile, JSON.stringify({
    "cool": false,
    "name": "George McFly"
  }))
})
