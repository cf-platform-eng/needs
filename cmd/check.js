module.exports = async function (needs, options) {
  let result = await needs.check(options.identify)
  if (!result.satisfied) {
    console.error("Some needs were unsatisfied:")
  }

  let unsatisfied = result.getUnsatisfiedNeeds()
  if (options.satisfied) {
    console.log(JSON.stringify(result.getSatisfiedNeeds(), null, 2))
  } else if (options.unsatisfied) {
    console.log(JSON.stringify(unsatisfied, null, 2))
  } else {
    console.log(JSON.stringify(needs.needs, null, 2))
  }

  return needs.satisfied ? 0 : 1
}