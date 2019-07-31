const schema = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "pattern": "^file$"
    },
    "path": {
      "type": "string"
    }
  },
  "required": ["type", "path"],
  "additionalProperties": false
}

let debug = require("debug")("file")
let Need = require("./need.js")
class File extends Need {
  constructor(input) {
    super(schema, input)
    this.glob = require("glob")
  }

  check() {
    debug(`Looking for "${this.data.path}"...`)
    return new Promise((resolve, reject) => {
      this.glob(this.data.path, (err, files) => {
        if (err) {
          debug(`encountered an error looking for "${this.data.path}"`)
          return reject({
            need: this,
            reason: "failed to check for file"
          })
        }

        if (files.length == 0) {
          debug(`"${this.data.path}" does not exist`)
          return resolve({
            need: this,
            satisfied: false
          })
        }

        debug(`"${this.data.path}" exists`)
        resolve({
          need: this,
          satisfied: true
        })
      })
    })
  }
}

File.type = "file"
File.info = `Checks the environment for a file
Example:
{
  "path": "/input/configuration.json",
  "type": "file"
}
OR
{
  "path": "/input/*.pivotal",
  "type": "file"
}`

module.exports = File
