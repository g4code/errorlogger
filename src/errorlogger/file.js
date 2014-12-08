
var fs     = require('fs'),
    path   = require('path'),
    _      = require('underscore'),
    evento = require('evento'),
    Data   = require('./data'),
    Solr   = require('./solr');

function File(filename, config) {

    this.config   = config;
    this.filename = filename;
    this.filePath = path.resolve(this.config.directory + "/" + filename);
    this.data     = [];
    this.entries  = [];
    this.rawData  = '';

    if (this.isFilenameCorrect()) {
        this.read();
        this.parseEntities();
        this.addToSolr();
        this.unlink();
    }
};

File.prototype = {

    addToSolr: function()
    {
        this.data.length > 0 &&
            new Solr(this.data, this.config, this.filename);
    },

    hasParsingErrors: function()
    {
        return (this.entries.length - this.data.length) != 1;
    },

    isFilenameCorrect: function()
    {
        return /____json__.+\.log/.test(this.filename);
    },

    onParseData: function(rawData, key)
    {
        var data = new Data(rawData, key, this.filename);
        if (data.isValid()) {
            this.data.push(data.getParsed());
        }
    },

    onUnlink: function(err)
    {
        err
            ? evento.trigger("error", ["fs.unlink", err].join(" | "))
            : evento.trigger("success", [this.filename, "deleted"].join(" | "));
    },

    parseEntities: function()
    {
        this.entries = this.rawData.split("\n");
        _.each(this.entries, _.bind(this.onParseData, this));
    },

    read: function()
    {
        try {
            this.rawData = fs.readFileSync(this.filePath, 'utf-8');
        } catch(err) {
            evento.trigger("error", ["fs.readFileSync", this.filename, err.message].join(" | "));
            return;
        }
    },

    unlink: function()
    {
        this.hasParsingErrors()
            ? evento.trigger("warning", ["parsing errors", this.filename, this.entries.length, this.data.length].join(" | "))
            : this.config.unlink && fs.unlink(this.filePath, _.bind(this.onUnlink, this));
    }
};

module.exports = File;