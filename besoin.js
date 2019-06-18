#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const defaultNeedsFile = path.join(__dirname, "environmentvars.json")
// const defaultNeedsTypes = path.join(__dirname, "lib", "needs")

const Needs = require("./lib/needs.js")
const Types = require("./lib/types.js")
const types = new Types()

require("yargs")
  .option("file", {
    type: "string",
    normalize: true,
    default: defaultNeedsFile,
  })
  .command("list", "list needs", (yargs) => {
    return yargs.option("unsatisfied", {
      type: "boolean",
      describe: "only list unsatisfied needs"
    })
  }, (args) => {
    fs.readFile(args.file, (err, raw) => {
      if (err) {
        console.error(err)
        return 1
      }

      let data = JSON.parse(raw)
      let needs = new Needs()
      needs.load(data, types)
      console.log(JSON.stringify(needs.data()))
    })
  })
  .command("check", "check current needs", yargs => yargs, (args) => {
    fs.readFile(args.file, async (err, raw) => {
      if (err) {
        console.error(err)
        return 1
      }

      let data = JSON.parse(raw)
      let needs = new Needs()
      needs.load(data, types)
      needs.getUnsatisfied().then((unsatisfied) => {
        if (unsatisfied.length > 0) {
          console.log(JSON.stringify(unsatisfied))
        }
      }).catch((err) => {
        console.error(err)
      })
    })
  })
  .command("types", "list installed types", () => {
    types.all().sort().forEach((type) => {
      console.log(type)
    })
  })
  .command("info", "", (args) => {
    let typeName = args.argv._[1]
    if (types.has(typeName)) {
      let type = types.get(args.argv._[1])
      console.log(type.info)
    } else {
      console.error(`Type "${typeName}" does not exist`)
      // TODO: return bad
    }
  })
  .help()
  .argv

// let check = require("./lib/check.js")
// let Needs = require("./lib/needs.js")
// let needs = new Needs(() => {
//   if (command == "list") {
//     needs.load((err, myneeds) => {
//       if (err) {
//         console.error("Failed to read needs file", err)
//         process.exit(1)
//       }

//       let output = myneeds.map(myneed => myneed.data)
//       console.log(JSON.stringify(output))
//       process.exit(0)
//     })
//   }

//   else if (command == "check") {
//     needs.load((err, myneeds) => {
//       if (err) {
//         console.error("Failed to read needs file", err)
//         process.exit(1)
//       }

//       check(myneeds, (err, remaining) => {
//         if (err) {
//           console.log("Failed to check needs", err)
//           process.exit(1)
//         }
        
//         if (remaining.length > 0) {
//           console.error("There are still unsatisfied needs:")
//           let output = remaining.map(myneed => myneed.data)
//           console.log(JSON.stringify(output))  
//           process.exit(1)
//         }
//         process.exit(0)
//       })
//     })
//   }

//   else if (command == "unsatisfied") {
//     needs.load((err, myneeds) => {
//       if (err) {
//         console.error("Failed to read needs file", err)
//         process.exit(1)
//       }

//       check(myneeds, (err, remaining) => {
//         if (err) {
//           console.log("Failed to check needs", err)
//           process.exit(1)
//         }

//         let output = remaining.map(myneed => myneed.data)
//         console.log(JSON.stringify(output))
//         process.exit(0)
//       })
//     })
//   }

//   else if (command == "types") {
//     let types = needs.needTypes()
//     types.forEach((type) => {
//       console.log(type)
//     })
//     process.exit(0)
//   }

//   else if (command == "info") {
//     let type = process.argv[3]
//     let need = needs.needsClass(type)
//     if (!need) {
//       console.error("No need with type " + type + " exists")
//       process.exit(1)
//     }
  
//     console.log(need.info)
//     process.exit(0)
//   }

//   else {
//     console.error("invalid command")
//     process.exit(1)
//   }
// })

