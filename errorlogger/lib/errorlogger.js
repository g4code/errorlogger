
var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore'),
    File = require('./file');

function ErrorLogger(configPath) {

    this.config     = require(configPath);
    this.readFiles();
}

ErrorLogger.prototype = {

    onFile: function(filename)
    {
        new File(filename, this.config.logDir);
    },

    readFiles: function()
    {
        this.files = fs.readdirSync(path.resolve(this.config.logDir));
        _.each(this.files, _.bind(this.onFile, this));
    }
};

module.exports = ErrorLogger;