
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
        new File(filename, this.config.logDir);
    },

    readFiles: function()
    {
        if (this.config !== null) {
            evento.trigger("info", "Log dir: " + path.resolve(this.config.logDir));
            this.files = fs.readdirSync(path.resolve(this.config.logDir));
            _.each(this.files, _.bind(this.onFile, this));
        }
    }
};

module.exports = ErrorLogger;