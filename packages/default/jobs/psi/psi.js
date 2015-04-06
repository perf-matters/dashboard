/**
 * Job: psi
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
var psi = require('psi');

module.exports = function(config, dependencies, job_callback) {
    psi(config.serviceUrl, {threshold: config.threshold, strategy: config.strategy}, function (err, data) {
        job_callback(err, { results: data, treshold: config.treshold, strategy: config.strategy});
    });
};
