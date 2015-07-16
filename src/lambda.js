'use strict';

var Router = require('./router');



Router.prototype.handler = function (event, context) {

    if (event.type === 'ROUTER') {

        // shoudl verify if method is valid

        // should verify if url is valid ( or maybe in setRequest )

        // should send better message for 404 ( Cannot (GET|POST|PUT..) URL

        this.setRequest(event.method, event.url, event.payload);
        this.run();
        if (this.response.status() !== 200) {
            if (context && context.done) {
                context.done(this.response.error);
            } else {
                context.fail = this.response.error;

            }
            return;
        }

        var response = {
            exitStatus : this.response.status(),
            data       : this.response.data
        };

        if (context && context.succeed) {
            context.succeed(response);
        } else {
            context.succeed = response;
        }
    }
};


module.exports = function () {
    return new Router();
};
