const Ajv = require("ajv")
const schema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      pattern: "^file$"
    },
    path: {
      type: "string"
    },
    validate: {
      type: "object",
      properties: {
        jsonschema: {
          type: "object"
        }
      },
      additionalProperties: false
    },
    description: {
      type: "string"
    },
    identify: {
      type: "string"
    },
    optional: {
      type: "boolean"
    }
  },
  required: ["type", "path"],
  additionalProperties: false
}

const util = require("util")
const Need = require("./need.js")
class File extends Need {
  constructor(input) {
    super(schema, input)
    this.glob = util.promisify(require("glob"))
    this.fs = require("fs").promises
    this.path = input.path
    this.validate = input.validate

    if (this.validate && this.validate.jsonschema) {
      let ajv = new Ajv()
      this.validator = ajv.compile(this.validate.jsonschema)
    }
  }

  async check(andIdentify) {
    let files
    try {
      files = await this.glob(this.path)
      this.satisfied = files.length > 0
    } catch (e) {
      return Promise.reject({
        need: this,
        reason: "failed to check for file"
      })
    }

    if (andIdentify) {
      await this.runIdentify()
    }

    if (this.satisfied) {
      try {
        await this.checkContents(files[0])
      } catch (reason) {
        return Promise.reject({
          need: this,
          reason
        })
      }
    }

    return Promise.resolve(this)
  }

  async checkContents(path) {
    if (this.validator) {
      let contents = await this.fs.readFile(path)
      try {
        let jsonContents = JSON.parse(contents)
        this.satisfied = this.valid = Boolean(this.validator(jsonContents))
      } catch (err) {
        this.satisfied = this.valid = false
      }
    }
  }
}

File.type = "file"
File.info = `Checks the environment for a file
Examples:
{
  "path": "/input/configuration.json",
  "type": "file",
  "identify": "shasum /input/configuration.json"
}
OR
{
  "path": "/input/*.pivotal",
  "type": "file"
}
OR
{
  "path": "/input/credentials.json",
  "type": "file",
  "validate": {
    "jsonschema": {
      "type": "object",
      "properties": {
        "hostname": { "type": "string" },
        "username": { "type": "string" },
        "password": { "type": "string" }
      }
    }
  }
}`

module.exports = File
