#!/usr/bin/env node

var Errorlogger = require(__dirname + "/../src/errorlogger"),
    commander   = require("commander"),
    packageData = require(__dirname + "/../package.json");

commander.version(packageData.version)
    .usage("[options]")
    .option('-c, --config <n>', 'config file path')
    .parse(process.argv);

new Errorlogger(commander.config);