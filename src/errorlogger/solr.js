
var request = require('request'),
    _       = require('underscore'),
    evento  = require('evento');


function Solr(data, config, filename) {

    this.data     = data;
    this.config   = config;
    this.filename = filename;

    request.post(this.getUrl(), {json: data}, _.bind(this.onResponse, this));
};

Solr.prototype = {

    getUrl: function()
    {
        return [
            "http://",
            this.config.solr.host,
            ":",
            this.config.solr.port,
            "/solr/",
            this.config.solr.collection,
            "/update"
        ].join("");
    },

    onResponse: function(err, httpResponse, body)
    {
        if (err != null) {
            evento.trigger("error", err);
        } else if (body.responseHeader.status > 0) {
            evento.trigger("error", [this.filename, body.error.msg].join(" | "));
        }
    }
};

module.exports = Solr;