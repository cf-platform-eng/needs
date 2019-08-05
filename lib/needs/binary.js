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
    }
  },
  "oneOf": [
    { "required": ["type", "path"] },
    { "required": ["type", "name"] } 
  ],
  "additionalProperties": false
}

let debug = require("debug")("binary")
let Need = require("./need.js")
class Binary extends Need {
  constructor(input) {
    super(schema, input)
    if (input.name) {
      this.name = input.name
    }
    if (input.path) {
      this.path = input.path
    }
    this.isExecutable = require("isexe")
    this.which = require("which")
  }

  checkByName(binaryName) {
    debug(`Checking for "${binaryName}"...`)
    return new Promise((resolve, reject) => {
      return this.which(binaryName, (err, path) => {
        if (err && err.code == "ENOENT") {
          debug(`"${binaryName}" does not exist`)
          this.satisfied = false
          return resolve(this)
        } else if (err) {
          debug(`Failed to check "${binaryName}"`)
          return reject({
            need: this,
            reason: "failed to find executable binary"
          })
        }

        this.satisfied = path != null
        debug(`"${binaryName}" was ${this.satisfied ? "found" : "not found"}`)
        return resolve(this)
      })
    })
  }

  checkByPath(binaryPath) {
    debug(`Checking for "${binaryPath}"...`)
    return new Promise((resolve, reject) => {
      this.isExecutable(binaryPath, (err, executable) => {
        if (err && err.code == "ENOENT") {
          debug(`"${binaryPath}" does not exist`)
          this.satisfied = false
          return resolve(this)
        } else if (err) {
          debug(`Failed to check path "${binaryPath}"`)
          return reject({
            need: this,
            reason: "failed to check if binary is executable"
          })
        }

        this.satisfied = Boolean(executable)
        debug(`"${binaryPath}" exists and ${this.satisfied ? "is" : "is not"} executable`)
        return resolve(this)
      })
    })
  }

  check() {
    if (this.name) {
      return this.checkByName(this.name)
    } else {
      return this.checkByPath(this.path)
    }
  }
}

Binary.type = "binary"
Binary.info = `Checks the environment for an executable binary
Example:
{
  "name": "mybinary",
  "type": "file"
}
  OR
{
  "path": "/path/to/binary",
  "type": "file"
}`

module.exports = Binary
