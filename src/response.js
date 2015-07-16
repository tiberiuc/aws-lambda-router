'use strict';

var Response = function () {
    this.data = null;
    this.exitStatus = 404;
    this.error = null;
};

Response.prototype.send = function (data) {
    this.data = data;
};

Response.prototype.status = function (exitStatus) {
    if (exitStatus) {
        this.exitStatus = exitStatus;
    }

    return this.exitStatus;
};


module.exports = function () {
    return new Response();
};
