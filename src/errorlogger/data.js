
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

    isEmpty: function()
    {
        return this.parsed === null || this.parsed == {};
    },

    modify: function()
    {
        this.parsed.id       = this.shasum.update(this.rawData).digest('hex');
        this.parsed.trace    = JSON.stringify(this.parsed.trace);
        this.parsed.context  = JSON.stringify(this.parsed.context);
        this.parsed.hostname = os.hostname();
        this.parsed.created  = moment.utc(moment.tz(this.parsed.datetime, this.parsed.tz)).format('YYYY-MM-DDThh:mm:ss') + "Z";
        this.parsed.saved    = moment.utc().format('YYYY-MM-DDThh:mm:ss') + "Z";
    },

    parse: function()
    {
        try {
            this.parsed = JSON.parse(this.rawData);
            this.modify();
        } catch(err) {
            evento.trigger("warning", [this.filename, this.key, err].join(" | "));
        }
    }
};

module.exports = Data;