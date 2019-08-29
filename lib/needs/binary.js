const schema = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "pattern": "^binary$"
    },
    "path": {
      "type": "string"
    },
    "name": {
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
  "oneOf": [
    { "required": ["type", "path"] },
    { "required": ["type", "name"] } 
  ],
  "additionalProperties": false
}

const debug = require("debug")("binary")
const util = require("util")
const Need = require("./need.js")
class Binary extends Need {
  constructor(input) {
    super(schema, input)
    if (input.name) {
      this.name = input.name
    }
    if (input.path) {
      this.path = input.path
    }
    this.isExecutable = util.promisify(require("isexe"))
    this.which = util.promisify(require("which"))
  }

  async checkByName(binaryName) {
    debug(`Checking for "${binaryName}"...`)
    try {
      await this.which(binaryName)
      this.satisfied = true
    } catch (err) {
      if (err.code == "ENOENT") {
        this.satisfied = false
      } else if (err) {
        debug(`Failed to check "${binaryName}"`)
        return Promise.reject({
          need: this,
          reason: "failed to find executable binary"
        })
      }
    }

    debug(`"${binaryName}" was ${this.satisfied ? "found" : "not found"}`)
    return Promise.resolve(this)
  }

  async checkByPath(binaryPath) {
    debug(`Checking for "${binaryPath}"...`)

    try {
      this.satisfied = await this.isExecutable(binaryPath)
      debug(`"${binaryPath}" exists and ${this.satisfied ? "is" : "is not"} executable`)
    } catch (err) {
      if (err && err.code == "ENOENT") {
        debug(`"${binaryPath}" does not exist`)
        this.satisfied = false
      } else if (err) {
        debug(`Failed to check path "${binaryPath}"`)
        return Promise.reject({
          need: this,
          reason: "failed to check if binary is executable"
        })
      }
    }

    return Promise.resolve(this)
  }

  async check(andIdentify) {
    let result
    if (this.name) {
      result = await this.checkByName(this.name)
    } else {
      result = await this.checkByPath(this.path)
    }

    if (this.satisfied && andIdentify) {
      await this.runIdentify()
    }

    return result
  }
}

Binary.type = "binary"
Binary.info = `Checks the environment for an executable binary
Example:
{
  "name": "mybinary",
  "type": "file",
  "identify": "mybinary --version"
}
  OR
{
  "path": "/path/to/binary",
  "type": "file"
}`

module.exports = Binary
