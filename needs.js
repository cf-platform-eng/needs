#!/usr/bin/env node

const fs = require("fs")
const { promisify } = require("util")
const readFile = promisify(fs.readFile)
// Note, you can *not* use require("fs").promises, because that messes
// with the pkg's local /snapshot file system.

const path = require("path")

const Types = require("./lib/types.js")
const types = new Types()
const And = types.get("and")
const { check } = require("./cmd/check.js")

async function loadNeedsFromFile(file) {
  try {
    let raw = await readFile(file)
    return new And({
      type: "and",
      needs: JSON.parse(raw.toString())
    }, types)
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Needs file not found. Please try again with the \"--file\" option.")
    } else if (err.name === "SyntaxError") {
      console.error("Needs file was invalid: Invalid JSON")
    } else if (err.name === "ValidationError") {
      console.error(`Needs file was invalid: ${err.message}`)
      console.error("  Details:", err.details)
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

async function loadVersion() {
  try {
    let rawVersion = await readFile(path.join(__dirname, "version"))
    return rawVersion.toString()
  } catch (err) {
    console.error("Failed to load version: ", err)
    process.exit(1)
  }
}

async function listCommand(args) {
  let needs = await loadNeedsFromFile(args.argv.file)
  console.log(JSON.stringify(needs.needs, null, 2))
}

async function checkCommandBuilder(yargs) {
  return yargs
    .option("identify", {
      type: "boolean",
      default: true,
      describe: "Identify the satisfied needs with \"identify\" fields. Disable with --no-identify."
    })
    .option("colorize", {
      type: "boolean",
      default: true,
      describe: "Use terminal colors",
    })
    // If stdout is *not* a TTY (e.g. being piped to some other command), disable colors
    .coerce("colorize", colorize => colorize && Boolean(process.stdout.isTTY))
    .option("satisfied", {
      type: "boolean",
      describe: "Only list satisfied needs"
    })
    .option("unsatisfied", {
      type: "boolean",
      describe: "Only list unsatisfied needs"
    })
}

async function checkCommand(args) {
  let needs = await loadNeedsFromFile(args.file)

  try {
    process.exit(await check(needs, args) ? 0 : 1)
  } catch (err) {
    console.error("Failed to check needs: ", err)
    process.exit(1)
  }
}

function typesCommand() {
  console.log("Supported types:")
  types.all().sort().forEach((type) => {
    console.log(`  ${type}`)
  })
}

function typeCommand(args) {
  if (types.has(args.typeName)) {
    let type = types.get(args.typeName)
    console.log(type.info)
  } else {
    console.error(`Type "${args.typeName}" does not exist`)
    console.error(`Use "${args.$0} types" to get the list of installed types`)
    process.exit(1)
  }
}

function typeCommandBuilder(yargs) {
  return yargs.positional("typeName", {
    describe: "The name of the type",
    type: "string"
  })
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
    .command("list", "List and validate needs in the needs file", listCommand)
    .command("check", "Check if the needs are satisfied", checkCommandBuilder, checkCommand)
    .command("types", "List available need types", typesCommand)
    .command("type <typeName>", "Describe a given type", typeCommandBuilder, typeCommand)
    .demandCommand(1, "Please specify a command")
    .strict(true)
    .version(version)
    .help()
    .alias("h", "help")
    .argv
}

run()
