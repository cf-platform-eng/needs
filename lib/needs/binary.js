let isExecutable = require("isexe")
let which = require("which")

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

let Need = require("./need.js")
class Binary extends Need {
  constructor(input) {
    super(schema, input)
    this.fs = require("fs")
  }
  
  check(callback) {
    if (this.data.name) {
      return which(this.data.name, (err, path) => {
        if (err && err.code == "ENOENT") {
          return callback(null, false)
        }
        callback(err, path != null)
      })
    }

    isExecutable(this.data.path, (err, executable) => {
      if (err && err.code == "ENOENT") {
        return callback(null, false)
      }

      callback(err, executable)
    })
  }
}

Binary.type = "binary"
Binary.info = `Checks the environment for an executable binary
Example:
{
  "path": "/path/to/binary",
  "type": "file"
}
  OR
{
  "path": "/path/to/binary",
  "type": "file"
}`

module.exports = Binary
