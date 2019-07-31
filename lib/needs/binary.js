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
    this.isExecutable = require("isexe")
    this.which = require("which")
  }

  checkByName(binaryName) {
    debug(`Checking for "${binaryName}"...`)
    return new Promise((resolve, reject) => {
      return this.which(binaryName, (err, path) => {
        if (err && err.code == "ENOENT") {
          debug(`"${binaryName}" does not exist`)
          return resolve({
            need: this,
            satisfied: false
          })
        } else if (err) {
          debug(`Failed to check "${binaryName}"`)
          return reject({
            need: this,
            reason: "failed to find executable binary"
          })
        }
        let result = path != null
        debug(`"${binaryName}" was ${result ? "found" : "not found"}`)
        return resolve({
          need: this,
          satisfied: result
        })
      })
    })
  }

  checkByPath(binaryPath) {
    debug(`Checking for "${binaryPath}"...`)
    return new Promise((resolve, reject) => {
      this.isExecutable(binaryPath, (err, executable) => {
        if (err && err.code == "ENOENT") {
          debug(`"${binaryPath}" does not exist`)
          return resolve({
            need: this,
            satisfied: false
          })
        } else if (err) {
          debug(`Failed to check path "${binaryPath}"`)
          return reject({
            need: this,
            reason: "failed to check if binary is executable"
          })
        }

        let result = Boolean(executable)
        debug(`"${binaryPath}" exists and ${result ? "is" : "is not"} executable`)
        return resolve({
          need: this,
          satisfied: result
        })
      })
    })
  }

  check() {
    if (this.data.name) {
      return this.checkByName(this.data.name)
    } else {
      return this.checkByPath(this.data.path)
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
