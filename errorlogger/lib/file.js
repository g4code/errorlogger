
var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

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

    onParseData: function(data, key)
    {
        if (data.length > 0) {
            try {
                var parsedData = JSON.parse(data);
                parsedData.trace   = JSON.stringify(parsedData.trace);
                parsedData.context = JSON.stringify(parsedData.context);
                this.data.push(parsedData);
            } catch(err) {
                console.log("filename: " + this.filename);
                console.log("line: " + key)
                console.log(err);
            }
        }
    },

    read: function()
    {
        var raw = fs.readFileSync(this.filePath, 'utf-8');
        _.each(raw.split("\n"), _.bind(this.onParseData, this));
    }
};

module.exports = File;