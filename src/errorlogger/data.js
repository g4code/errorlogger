
var evento = require('evento'),
    crypto = require('crypto'),
    os     = require('os'),
    moment = require('moment-timezone');

function Data(rawData, key, filename) {

    this.rawData  = rawData;
    this.key      = key;
    this.filename = filename;
    this.parsed   = null;
    this.shasum   = crypto.createHash('md5');

    if (this.rawData.length > 0) {
        this.parse();
    }
};

Data.prototype = {

    getParsed: function()
    {
        return this.parsed;
    },

    hasParsedData: function()
    {
        return this.parsed          !== null
            && this.parsed.type     !== undefined
            && this.parsed.message  !== undefined
            && this.parsed.code     !== undefined
            && this.parsed.line     !== undefined
            && this.parsed.file     !== undefined
            && this.parsed.datetime !== undefined;
    },

    isValid: function()
    {
        return !(this.parsed === null || this.parsed == {})
            && this.parsed.id !== undefined;
    },

    modify: function()
    {
        if (this.hasParsedData()) {
            this.parsed.id       = this.shasum.update(this.rawData).digest('hex');
            this.parsed.trace    = this.parsed.trace === undefined ? '' : JSON.stringify(this.parsed.trace);
            this.parsed.context  = this.parsed.context === undefined ? '' : JSON.stringify(this.parsed.context);
            this.parsed.hostname = os.hostname();
            this.parsed.created  = moment.utc(moment.tz(this.parsed.datetime, this.parsed.tz)).format('YYYY-MM-DDTHH:mm:ss') + "Z";
            this.parsed.saved    = moment.utc().format('YYYY-MM-DDTHH:mm:ss') + "Z";
        }
    },

    parse: function()
    {
        try {
            this.parsed = JSON.parse(this.rawData);
        } catch(err) {
            this.parsed = null;
        }
        this.modify();
    }
};

module.exports = Data;
