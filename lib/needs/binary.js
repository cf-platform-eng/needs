const Need = require("./need.js")
class Binary extends Need {
  constructor(input) {
    super(Binary.schema, input)
    if (input.name) {
      this.name = input.name
    }
    if (input.path) {
      this.path = input.path
    }

    const util = require("util")
    this.isExecutable = util.promisify(require("isexe"))
    this.which = util.promisify(require("which"))
  }

  async checkByName(binaryName) {
    try {
      await this.which(binaryName)
      this.satisfied = true
    } catch (err) {
      if (err.code == "ENOENT") {
        this.satisfied = false
      } else if (err) {
        return Promise.reject({
          need: this,
          reason: "failed to find executable binary"
        })
      }
    }

    return Promise.resolve(this)
  }

  async checkByPath(binaryPath) {
    try {
      this.satisfied = await this.isExecutable(binaryPath)
    } catch (err) {
      if (err && err.code == "ENOENT") {
        this.satisfied = false
      } else if (err) {
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
Binary.schema = {
  type: "object",
  properties: {
    type:        { type: "string", pattern: "^binary$" },
    path:        { type: "string" },
    name:        { type: "string" },

    description: { type: "string" },
    identify:    { type: "string" },
    metadata:    { type: "object" },
    optional:    { type: "boolean" }
  },
  oneOf: [
    { required: ["type", "path"] },
    { required: ["type", "name"] } 
  ],
  additionalProperties: false
}

module.exports = Binary
