'use strict';


var routes = {},
    routeRequest = require('./request'),
    routeResponse = require('./response');

var Router = function () {
    this.request = routeRequest();
    this.response = routeResponse();
};

function createRouteRegexp(path) {
    var reg = new RegExp(':[^\/]+', 'g'),
        paramNames,
        params = path.match(reg);

    path = '^' + path.replace(/(\/)+/g, "\\/");
    if (params) {
        path = path.replace(new RegExp('(:[^\\\\]+)', 'g'), '([^\\/]+)');
    } else {
        params = [];
    }

    paramNames = params.map(function (param) {
        return param.replace(/^:/, '');
    });

    return {
        regexp: path,
        paramNames: paramNames
    };
}

function addRoute(method, path, fn) {
    routes[path]         = {};
    routes[path].regexp  = createRouteRegexp(path);
    routes[path][method] = fn;
}

["GET", "POST", "PUT", "DELETE", "ALL"].map(function (method) {
    Router.prototype[method.toLowerCase()] = function (path, callback) {
        addRoute(method, path, callback);
    };
});

function findRoute(route, method) {
    var path,
        match;

    for (path in routes) {
        if (routes.hasOwnProperty(path)) {
            match = route.match(new RegExp(routes[path].regexp.regexp));
            if (match) {
                if (routes[path][method] || routes[path].ALL) {
                    return routes[path];
                }
            }
        }
    }

    return null;
}


function doRoute(request, response) {
    request.parseURL();
    var route = findRoute(request.route, request.method),
        handle;
    if (route) {
        response.status(200);
        handle = route[request.method] || route.ALL;
        request.getParams(route);
        try {
            handle.apply(this, arguments);
        } catch (err) {
            response.status(500);
            response.error = err;
            response.error.exitStatus = 500;
            //console.log(err.stack);
        }

    } else {
        response.status(404);
        response.error = new Error();
        response.error.exitStatus = 404;
    }
}

Router.prototype.setRequest = function (method, url, data) {
    this.request.method = method.toUpperCase();
    this.request.url    = url;
    this.request.data   = data;
};

Router.prototype.run = function () {
    this.response.send(null);
    this.response.status(404);
    doRoute(this.request, this.response);
};

module.exports = Router;
