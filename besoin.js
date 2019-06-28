#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const readFile = promisify(fs.readFile)

const defaultNeedsFile = path.join(__dirname, "needs.json")

const And = require("./lib/needs/and.js")
const Types = require("./lib/types.js")
const types = new Types()

function needsToJSON(needs) {
  return JSON.stringify(needs.map((need) => need.data))
}

async function loadNeedsFromFile(file) {
  try {
    let raw = await readFile(file)
    let data = JSON.parse(raw)
    return new And({
      type: "and",
      needs: data
    }, types)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

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
  }, async (args) => {
    let needs = await loadNeedsFromFile(args.file)

    if (!args.unsatisfied) {
      console.log(needsToJSON(needs.needs))
      return
    }

    try {
      let result = await needs.check()
      console.log(needsToJSON(result.unsatisfiedNeeds))
    } catch (err) {
      console.error("error: ", err)
      process.exit(1)
    }
  })
  .command("check", "check current needs", yargs => yargs, async (args) => {
    let needs = await loadNeedsFromFile(args.file)

    try {
      let result = await needs.check()
      if (result.satisfied) {
        console.error("Some needs were unsatisfied:")
        console.log(needsToJSON(result.unsatisfiedNeeds))
      }
    } catch (err) {
      console.error("error: ", err)
      process.exit(1)
    }
  })
  .command("types", "list installed types", () => {
    types.all().sort().forEach((type) => {
      console.log(type)
    })
  })
  .command("type", "get info for a given type", (args) => {
    let typeName = args.argv._[1]
    if (types.has(typeName)) {
      let type = types.get(args.argv._[1])
      console.log(type.info)
    } else {
      console.error(`Type "${typeName}" does not exist`)
      process.exit(1)
    }
  })
  .demandCommand(1, "Please specify a command")
  .help()
  .alias("h", "help")
  .argv
