#!/usr/bin/env node

let command = process.argv[2]
let check = require("./lib/check.js")
let Needs = require("./lib/needs.js")
let needs = new Needs(() => {
  if (command == "list") {
    needs.load((err, myneeds) => {
      if (err) {
        console.error("Failed to read needs file", err)
        process.exit(1)
      }

      let output = myneeds.map(myneed => myneed.data)
      console.log(JSON.stringify(output))
      process.exit(0)
    })
  }

  else if (command == "check") {
    needs.load((err, myneeds) => {
      if (err) {
        console.error("Failed to read needs file", err)
        process.exit(1)
      }

      check(myneeds, (err, remaining) => {
        if (err) {
          console.log("Failed to check needs", err)
          process.exit(1)
        }
        
        if (remaining.length > 0) {
          console.error("There are still unsatisfied needs:")
          let output = remaining.map(myneed => myneed.data)
          console.log(JSON.stringify(output))  
          process.exit(1)
        }
        process.exit(0)
      })
    })
  }

  else if (command == "unsatisfied") {
    needs.load((err, myneeds) => {
      if (err) {
        console.error("Failed to read needs file", err)
        process.exit(1)
      }

      check(myneeds, (err, remaining) => {
        if (err) {
          console.log("Failed to check needs", err)
          process.exit(1)
        }

        let output = remaining.map(myneed => myneed.data)
        console.log(JSON.stringify(output))
        process.exit(0)
      })
    })
  }

  else if (command == "types") {
    let types = needs.needTypes()
    types.forEach((type) => {
      console.log(type)
    })
    process.exit(0)
  }

  else if (command == "info") {
    let type = process.argv[3]
    let need = needs.needsClass(type)
    if (!need) {
      console.error("No need with type " + type + " exists")
      process.exit(1)
    }
  
    console.log(need.info)
    process.exit(0)
  }

  else {
    console.error("invalid command")
    process.exit(1)
  }
})

