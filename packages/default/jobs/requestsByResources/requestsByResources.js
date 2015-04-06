/**
 * Job: requestsByResources
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

module.exports = function(config, dependencies, job_callback) {
    dependencies.request(
        'http://localhost:9999/requestsByResources?serviceUrl=' + encodeURIComponent(config.serviceUrl),
        function(err, resp) {
            job_callback(err, {metrics: resp.body});
        });
};
