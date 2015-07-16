'use strict';

var assert = require('assert'),
    Router = require('../src/router');


describe('testing router', function () {
    var app;

    before(function () {
        // create router
        app = new Router();


        // define routes
        app.get('/get', function (req, res) {
            res.send(req.route);
        });
        app.post('/post', function (req, res) {
            res.send(req.route);
        });
        app.put('/put', function (req, res) {
            res.send(req.route);
        });
        app.delete('/delete', function (req, res) {
            res.send(req.route);
        });
        app.all('/all', function (req, res) {
            res.send(req.route);
        });
        app.get('/query', function (req, res) {
            res.send({
                valInt: req.query.valInt,
                valString: req.query.valString
            });
        });
        app.get('/error', function (req, res) {
            res.thisFuncDoesNotExist(req.route);
        });
        app.get('/with/param/:id/all/:param2', function (req, res) {
            res.send({
                id: req.params.id,
                param2: req.params.param2
            });
        });

    });


    describe('basic routing', function () {

        it('should response to get', function () {
            app.setRequest('GET', '/get');
            app.run();
            assert.equal('/get', app.response.data);
        });
        it('should response to post', function () {
            app.setRequest('POST', '/post');
            app.run();
            assert.equal('/post', app.response.data);
            assert.equal(200, app.response.status());
        });
        it('should response to put', function () {
            app.setRequest('PUT', '/put');
            app.run();
            assert.equal('/put', app.response.data);
            assert.equal(200, app.response.status());
        });
        it('should response to delete', function () {
            app.setRequest('DELETE', '/delete');
            app.run();
            assert.equal('/delete', app.response.data);
            assert.equal(200, app.response.status());
        });
        it('should response to all', function () {
            app.setRequest('GET', '/all');
            app.run();
            assert.equal('/all', app.response.data);
            assert.equal(200, app.response.status());

            app.setRequest('POST', '/all');
            app.run();
            assert.equal('/all', app.response.data);
            assert.equal(200, app.response.status());

            app.setRequest('PUT', '/all');
            app.run();
            assert.equal('/all', app.response.data);
            assert.equal(200, app.response.status());

            app.setRequest('DELETE', '/all');
            app.run();
            assert.equal('/all', app.response.data);
            assert.equal(200, app.response.status());
        });
        it('should not exist', function () {
            app.setRequest('GET', '/does-not-exist');
            app.run();
            assert.equal(404, app.response.status());
        });
        it('should work with lowercase method', function () {
            app.setRequest('get', '/get');
            app.run();
            assert.equal(200, app.response.status());
        });
        it('should get 500 error', function () {
            app.setRequest('get', '/error');
            app.run();
            assert.equal(500, app.response.status());
        });

    });

    describe('get query variables', function () {
        it('should get query variables from URL', function () {
            app.setRequest('GET', '/query?valInt=1&valString=test');
            app.run();
            assert.equal(200, app.response.status());
            assert.equal(1, app.response.data.valInt);
            assert.equal('test', app.response.data.valString);
        });
    });

    describe('get route params values', function () {
        it('should get params values from route', function () {
            app.setRequest('GET', '/with/param/1/all/search');
            app.run();
            assert.equal(200, app.response.status());
            assert.equal(1, app.response.data.id);
            assert.equal('search', app.response.data.param2);
        });
    });

});



