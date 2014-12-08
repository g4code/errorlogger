
var fs       = require('fs'),
    path     = require('path'),
    _        = require('underscore'),
    evento   = require("evento"),
    informer = require("informer"),
    File     = require('./errorlogger/file');

function ErrorLogger(configPath) {

    informer.title("errorlogger")
            .titleColor("cyan");

    evento.on("error",   _.bind(informer.error,   informer));
    evento.on("success", _.bind(informer.success, informer));
    evento.on("info",    _.bind(informer.info,    informer));
    evento.on("warning", _.bind(informer.warning, informer));
    evento.on("loading", _.bind(informer.loading, informer));

    this.configPath = configPath;
    this.config     = null;

    this.loadConfig();
    this.readFiles();
}

ErrorLogger.prototype = {

    loadConfig: function()
    {
        _.isUndefined(this.configPath)
            ? evento.trigger("error", "Config is required! -c [config path]")
            : this.config = require(this.configPath);
    },

    onFile: function(filename)
    {
        new File(filename, this.config);
    },

    onReaddir: function(err, files)
    {
        if (err) {
            evento.trigger("error", ["fs.readdir", err].join(" | "));
        } else if (files.length < 0) {
            evento.trigger("info", "No files in " + path.resolve(this.config.directory));
        } else {
            evento.trigger("info", "Number of files: " + files.length);
            _.each(files, _.bind(this.onFile, this));
        }
    },

    readFiles: function()
    {
        if (this.config !== null) {
            evento.trigger("info", "Log dir: " + path.resolve(this.config.directory));
            fs.readdir(path.resolve(this.config.directory), _.bind(this.onReaddir, this));
        }
    }
};

module.exports = ErrorLogger;