var mongoose = require('mongoose');
var url = require('url');
var dbName = url.parse(
    require('../../config/dashboard_common').config.getMetrics.hook.params.serviceUrl
).hostname.replace(/\./g, '_');

mongoose.connect('mongodb://localhost:27017/' + dbName);
var Schema = mongoose.Schema;

var schema = new Schema({
    request: Object,
    HAR: Object,
    report: Object
}, {
    capped: {
        max: 21,
        size: 5242880
    }
});

var MetricModel = mongoose.model('Metric', schema);

var currentMetrics = [];

module.exports.getCurrentMetrics = function () {
    return currentMetrics;
};

module.exports.getCurrentMetric = function () {
    return currentMetrics[currentMetrics.length - 1];
};

module.exports.updateMetrics = function () {
    MetricModel
        .find({}, '-_id')
        .sort('-request.timing.performanceMetricsDone')
        .limit(20)
        .exec(function (err, metrics) {
            currentMetrics = metrics.reverse();
        });
};

module.exports.setMetricsInterval = function () {
    this.updateMetrics();
    setInterval(this.updateMetrics, 10000);
};

module.exports.saveMetric = function (metric) {
    var metricDocument = new MetricModel(metric);
    metricDocument.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
};
