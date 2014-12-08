
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

    if (this.isFilenameCorrect()) {
        this.read();
        this.addToSolr();
        this.remove();
    }
};

File.prototype = {

    addToSolr: function()
    {
        new Solr(this.data, this.config, this.filename);
    },

    remove: function()
    {

    },

    isFilenameCorrect: function()
    {
        return /____json__.+\.log/.test(this.filename);
    },

    onParseData: function(rawData, key)
    {
        var data = new Data(rawData, key, this.filename);
        if (!data.isEmpty()) {
            this.data.push(data.getParsed());
        }
    },

    onReadFile: function (err, data)
    {
        if (err) {
            evento.trigger("error", [this.filename, err].join(" | "));
        } else {
            this.entries = data.split("\n");
            this.parseEntities();
        }
    },

    parseEntities: function()
    {
        evento.trigger("info", [this.filename, this.entries.length].join(" | "));
        _.each(this.entries, _.bind(this.onParseData, this));
    },

    read: function()
    {
        fs.readFile(this.filePath, 'utf-8', _.bind(this.onReadFile, this));
    }
};

module.exports = File;