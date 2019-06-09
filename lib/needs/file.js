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

let Need = require("./need.js")
class File extends Need {
  constructor(input) {
    super(schema, input)
    this.fs = require("fs")
  }

  check(callback) {
    this.fs.access(this.data.path, (err) => {
      if (err && err.code === "ENOENT") {
        return callback(null, false)
      } else if (err) {
        return callback(err)
      }
      return callback(null, true)
    })
  }
}

File.type = "file"
File.info = `Checks the environment for a file
Example:
{
  "path": "/input/configuration.json",
  "type": "file"
}`

module.exports = File
