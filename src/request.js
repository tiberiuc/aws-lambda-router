'use strict';

var parse = require('url').parse;

var Request = function () {
    this.method = null;
    this.url    = null;
    this.params = [];
};

Request.prototype.parseURL = function () {
    var url = parse(this.url, true);
    this.route = url.pathname;
    this.query = url.query;

};

Request.prototype.getParams = function (route) {
    var regexp = route.regexp,
        match = this.route.match(new RegExp(regexp.regexp)),
        i;

    this.params = [];
    if (regexp.paramNames) {
        for (i = 0; i < regexp.paramNames.length; i += 1) {
            this.params[regexp.paramNames[i]] = match[i + 1];
        }
    }
};

module.exports = function () {
    return new Request();
};
