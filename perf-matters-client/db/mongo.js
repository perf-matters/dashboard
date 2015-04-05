var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dashboard');

var MetricModel = mongoose.model('Metric', {
    request: Object,
    HAR: Object,
    report: Object
});

var currentMetrics = [];

module.exports.getCurrentMetrics = function () {
    return currentMetrics.reverse();
};

module.exports.getCurrentMetric = function () {
    return currentMetrics[0];
};

module.exports.updateMetrics = function () {
    MetricModel
        .find({}, '-_id')
        .sort('-request.timing.performanceMetricsDone')
        .limit(20)
        .exec(function (err, metrics) {
            currentMetrics = metrics;
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
