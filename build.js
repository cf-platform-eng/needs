#!/usr/bin/env node

const { exec } = require("pkg")
exec([".", "--targets", "latest-linux-x64,latest-macos-x64,latest-alpine-x64", "--out-path", "./build"])
