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
    this.path = input.path
  }

  check() {
    debug(`Looking for "${this.path}"...`)
    return new Promise((resolve, reject) => {
      this.glob(this.path, (err, files) => {
        if (err) {
          debug(`encountered an error looking for "${this.path}"`)
          return reject({
            need: this,
            reason: "failed to check for file"
          })
        }

        this.satisfied = files.length > 0
        debug(`"${this.path}" ${this.satisfied ? "does" : "does not"} exist`)
        return resolve(this)
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
