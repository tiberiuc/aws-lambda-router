'use strict';

var assert = require('assert'),
    lambda = require('../src/lambda');

describe('test aws handler', function () {
    var app,
        context;

    before(function () {
        app = lambda();
        context = {};

        app.get('/get', function (req, res) {
            res.send(req.data);
        });

        app.get('/error', function (req, res) {
            res.thisFunctionDontExist(req.data);
        });
    });

    it('should invoke simple function', function () {
        var event = {
            type: 'ROUTER',
            method: 'GET',
            url: '/get',
            payload: 'test data'
        };
        context = {};

        app.handler(event, context);
        assert.equal('test data', context.succeed.data);
        assert.equal(200, context.succeed.exitStatus);

    });

    it('should error non existant route', function () {
        var event = {
            type: 'ROUTER',
            method: 'GET',
            url: '/non-existant',
            payload: 'test data'
        };
        context = {};

        app.handler(event, context);
        assert.equal(404, context.fail.exitStatus);
        assert.equal(undefined, context.succeed);
    });

    it('should fail internal error route', function () {
        var event = {
            type: 'ROUTER',
            method: 'GET',
            url: '/error',
            payload: 'test data'
        };
        context = {};

        app.handler(event, context);
        assert.equal(500, context.fail.exitStatus);
        assert.equal(undefined, context.succeed);
    });

});
