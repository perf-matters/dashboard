/**
 * Job: siteSpeed
 *
 * Expected configuration:
 *
 * ## PLEASE ADD AN EXAMPLE CONFIGURATION FOR YOUR JOB HERE
 * {
 *   myconfigKey : [
 *     { serverUrl : 'localhost' }
 *   ]
 * }
 */
var http = require('http');

function getPathFromConfig (config) {
    var paramsString = config.hook.path + '?';
    var params = [];
    for (var param in config.hook.params) {
        var value = config.hook.params[param];
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        params.push(param + '=' + encodeURIComponent(value));
    }
    return paramsString + params.join('&');
}

module.exports = function(config, dependencies, job_callback) {
    config.hook.params.serviceUrl = config.serviceUrl;
    config.hook.params.connection = config.connection;

    var options = {
        hostname: config.hook.hostname,
        port: config.hook.port,
        path: getPathFromConfig(config)
    };

    http.get(options, function (res) {
        job_callback(null, {});
    }).on('error', function (err) {
        job_callback(err, {});
    });
};
