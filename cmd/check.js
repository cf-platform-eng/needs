const colors = require("colors/safe")

const INDENT_LEVEL = 2
const INDENT = " ".repeat(INDENT_LEVEL)

function colorize(need) {
  let stringified = JSON.stringify(need, null, INDENT_LEVEL)
  if (need.satisfied === false && need.optional === true) {
    return colors.yellow(stringified)
  }
  if (need.satisfied === false) {
    return colors.red(stringified)
  }
  return stringified
}

function formatNeeds(needs, colorized) {
  if (colorized) {
    let stringified = needs.map(colorize)
    let joined = stringified.join(",\n")
    joined = joined.replace(/\n/g, "\n" + INDENT)
    return "[\n" + INDENT + joined + "\n]"
  }
  return JSON.stringify(needs, null, INDENT_LEVEL)
}

async function check(needs, options) {
  let result = await needs.check(options.identify)
  if (!result.satisfied) {
    console.error("Some needs were unsatisfied:")
  }

  let unsatisfied = result.getUnsatisfiedNeeds()
  if (options.satisfied) {
    console.log(formatNeeds(result.getSatisfiedNeeds(), options.colorize))
  } else if (options.unsatisfied) {
    console.log(formatNeeds(unsatisfied, options.colorize))
  } else {
    console.log(formatNeeds(needs.needs, options.colorize))
  }

  return needs.satisfied
}

module.exports = { check, colorize, formatNeeds }