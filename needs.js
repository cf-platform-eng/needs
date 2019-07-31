#!/usr/bin/env node

const debug = require("debug")("needs")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const readFile = promisify(fs.readFile)

const Types = require("./lib/types.js")
const types = new Types()
const And = types.get("and")

function needsToJSON(needs) {
  return JSON.stringify(needs.map((need) => need.data))
}

async function loadNeedsFromFile(file) {
  debug(`Loading needs file "${file}..."`)
  try {
    let raw = await readFile(file)
    let data = JSON.parse(raw)
    return new And({
      type: "and",
      needs: data
    }, types)
  } catch (err) {
    if (err.code == "ENOENT") {
      console.error("Needs file not found. Please try again with the \"--file\" option.")
    } else if (err.name == "SyntaxError") {
      console.error("Needs file was invalid: Invalid JSON")
    } else if (err.name == "ValidationError") {
      console.error(`Needs file was invalid: ${err.message}`)
      console.error("  Details:", err.details)
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

async function loadVersion() {
  let rawVersion = await readFile(path.join(__dirname, "version"))
  return rawVersion.toString()
}

async function run() {
  let version = await loadVersion()

  require("yargs")
    .option("f", {
      alias: "file",
      default: path.join(process.cwd(), "needs.json"),
      describe: "The needs.json file to use",
      demandOption: true,
      type: "string",
      normalize: true,
    })
    .option("d", {
      alias: "debug",
      default: false,
      describe: "Show more information",
      type: "boolean"
    })
    .coerce("d", (enabled) => {
      if (enabled) {
        require("debug").enable("*")
      }
    })
    .command("list", "list needs", async (args) => {
      debug("Listing needs...")
      let needs = await loadNeedsFromFile(args.argv.file)
      console.log(needsToJSON(needs.needs))
    })
    .command("check", "check current needs", (yargs) => {
      return yargs
        .option("satisfied", {
          type: "boolean",
          describe: "only list satisfied needs"
        })
        .option("unsatisfied", {
          type: "boolean",
          describe: "only list unsatisfied needs"
        })
    }, async (argv) => {
      debug("Checking needs...")
      let needs = await loadNeedsFromFile(argv.file)

      try {
        let result = await needs.check()
        if (!result.satisfied) {
          console.error("Some needs were unsatisfied:")
        }

        if (argv.satisfied) {
          console.log(needsToJSON(result.satisfiedNeeds))
        } else if (argv.unsatisfied) {
          console.log(needsToJSON(result.unsatisfiedNeeds))
        } else {
          console.log(needsToJSON(needs.needs))
        }

        process.exit(result.satisfied ? 0 : 1)
      } catch (err) {
        console.error("Failed to check needs: ", err)
        process.exit(1)
      }
    })
    .command("types", "list installed types", () => {
      debug("Listing need types...")
      types.all().sort().forEach((type) => {
        console.log(type)
      })
    })
    .command("type", "get info for a given type", (args) => {
      let typeName = args.argv._[1]
      debug(`Getting info for need type "${typeName}...`)
      if (types.has(typeName)) {
        let type = types.get(args.argv._[1])
        console.log(type.info)
      } else {
        console.error(`Type "${typeName}" does not exist`)
        process.exit(1)
      }
    })
    .demandCommand(1, "Please specify a command")
    .strict(true)
    .version(version)
    .help()
    .alias("h", "help")
    .argv
}
run()