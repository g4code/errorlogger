#!/usr/bin/env node

var Errorlogger = require("./src/errorlogger"),
    commander   = require("commander"),
    packageData = require(__dirname + "/package.json");

commander.version(packageData.version)
    .usage("[options]")
    .option('-c, --config <n>', 'config directory path')
    .parse(process.argv);

new Errorlogger(__dirname+"/"+commander.config);