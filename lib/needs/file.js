const schema = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "pattern": "^file$"
    },
    "path": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "identify": {
      "type": "string"
    },
    "optional": {
      "type": "boolean"
    }
  },
  "required": ["type", "path"],
  "additionalProperties": false
}

const debug = require("debug")("file")
const util = require("util")
const Need = require("./need.js")
class File extends Need {
  constructor(input) {
    super(schema, input)
    this.glob = util.promisify(require("glob"))
    this.path = input.path
  }

  async check(andIdentify) {
    debug(`Looking for "${this.path}"...`)
    try {
      let files = await this.glob(this.path)
      this.satisfied = files.length > 0
    } catch (e) {
      debug(`encountered an error looking for "${this.path}"`)
      return Promise.reject({
        need: this,
        reason: "failed to check for file"
      })
    }

    if (andIdentify) {
      await this.runIdentify()
    }
  
    debug(`"${this.path}" ${this.satisfied ? "does" : "does not"} exist`)
    return Promise.resolve(this)
  }
}

File.type = "file"
File.info = `Checks the environment for a file
Example:
{
  "path": "/input/configuration.json",
  "type": "file",
  "identify": "shasum /input/configuration.json"
}
OR
{
  "path": "/input/*.pivotal",
  "type": "file"
}`

module.exports = File
