
var request = require('request'),
    _       = require('underscore'),
    evento  = require('evento');


function Solr(data, config, filename) {

    this.data     = data;
    this.config   = config;
    this.filename = filename;

    request.post(this.getUrl(), {json: this.data}, _.bind(this.onResponse, this));
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
            evento.trigger("error", ["http", err].join(" | "));
        } else if (body.responseHeader.status > 0) {
            evento.trigger("error", ["solr", this.filename, body.error.msg].join(" | "));
        } else {
            evento.trigger("success", [this.filename, "saved to solr", this.data.length].join(" | "));
        }
    }
};

module.exports = Solr;