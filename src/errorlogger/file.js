
var fs     = require('fs'),
    path   = require('path'),
    _      = require('underscore'),
    Data   = require('./data');

function File(filename, dir) {

    this.filename = filename;
    this.filePath = path.resolve(dir + "/" + filename);
    this.data     = [];

    if (this.isFilenameCorrect()) {
        this.read();
        this.addToSolr();
        this.remove();
    }
};

File.prototype = {

    addToSolr: function()
    {

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

    read: function()
    {
        var raw = fs.readFileSync(this.filePath, 'utf-8');
        _.each(raw.split("\n"), _.bind(this.onParseData, this));
    }
};

module.exports = File;