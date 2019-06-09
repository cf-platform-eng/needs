const schema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "pattern": "^[a-z_]+$"
      }
    },
    "required": ["type"]
  }
}

const Ajv = require("ajv")
let ajv = new Ajv()
let validator = ajv.compile(schema)

const async = require("async")
const fs = require("fs")
const path = require("path")

class Needs {
  constructor(callback) {
    this.needsDir = path.join(__dirname, "needs")
    this.needsFile = path.join(__dirname, "..", "..", "environmentvars.json")
    this.loadNeedClasses(callback)
  }

  loadNeedClasses(callback) {
    this.needClasses = {}
    fs.readdir(this.needsDir, (err, files) => {
      if (err) {
        console.error("Failed to load need types: ", err)
        process.exit(1)
      }
    
      async.each(files, (file, next) => {
        if (file.endsWith(".js") && file != "need.js") {
          let need = require(path.join(this.needsDir, file))
          this.needClasses[need.type] = need
        }
        next()
      }, callback)
    })
  }

  needsClass(type) {
    return this.needClasses[type]
  }

  needTypes() {
    return Object.keys(this.needClasses)
  }

  load(callback) {
    fs.readFile(this.needsFile, (err, data) => {
      if (err) {
        return callback(err)
      }
      
      try {
        let needObjects = JSON.parse(data)

        let valid = validator(needObjects)
        if (!valid) {
          console.error("Needs file is not valid:")
          console.error(validator.errors)
          process.exit(1)
        }

        let needs = []
        async.each(needObjects, (needObject, next) => {
          if (!this.needClasses[needObject.type]) {
            next("No need type found for type " + needObject.type)
          }
  
          let need = new this.needClasses[needObject.type](needObject)
          needs.push(need)
          next()
        }, (err) => {
          callback(err, needs)
        })
      } catch (err) {
        return callback(err)
      }
    })
  }
}
  
module.exports = Needs