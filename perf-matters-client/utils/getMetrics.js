var http = require('http');
var hookConfig = require('../../config/dashboard_common').config.getMetrics.hook;

function getPathFromConfig () {
    var paramsString = hookConfig.path + '?';
    var params = [];
    for (var param in hookConfig.params) {
        params.push(param + '=' + encodeURIComponent(hookConfig.params[param]));
    }
    return paramsString + params.join('&');
}

var hookPath = getPathFromConfig();

module.exports.getMetrics = function () {
    var options = {
        hostname: hookConfig.hostname,
        port: hookConfig.port,
        path: hookPath
    };

    http.get(options).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};
