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
  
  check() {
    return new Promise((resolve, reject) => {
      if (this.data.name) {
        return which(this.data.name, (err, path) => {
          if (err && err.code == "ENOENT") {
            return resolve({
              need: this,
              satisfied: false
            })
          } else if (err) {
            return reject({
              need: this,
              reason: "failed to find executable binary"
            })
          }
          return resolve({
            need: this,
            satisfied: path != null
          })
        })
      }
  
      isExecutable(this.data.path, (err, executable) => {
        if (err && err.code == "ENOENT") {
          return resolve({
            need: this,
            satisfied: false
          })
        } else if (err) {
          return reject({
            need: this,
            reason: "failed to check if binary is executable"
          })
        }
        return resolve({
          need: this,
          satisfied: executable
        })
      })
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
