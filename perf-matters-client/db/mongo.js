var mongoose = require('mongoose');
var url = require('url');
var crypto = require('crypto');
var schema = mongoose.Schema({
    request: Object,
    HAR: Object,
    report: Object,
    HARerrors: Object
}, {
    capped: {
        max: 120,
        size: 524288000
    }
});

function MongoInterface () {
    this.dbs = [];
}

MongoInterface.prototype = {
    getDBnameFromServiceUrl: function (serviceUrl) {
        var parsedUrl = url.parse(serviceUrl);
        var dbName = parsedUrl.hostname.replace(/\./g, '_');
        if (parsedUrl.path !== '/') {
            dbName += crypto.createHash('md5').update(parsedUrl.path).digest('hex').substring(0, 8);
        }
        return dbName;
    },
    getDBbyName: function (dbName) {
        var index = this.dbs.map(function (db) {return db.name}).indexOf(dbName);
        if (index !== -1) {
            return this.dbs[index];
        }

        var db = this.dbs[this.createDBinstance(dbName)];
        return db;
    },
    getDBFromServiceUrl: function (serviceUrl) {
        return this.getDBbyName(this.getDBnameFromServiceUrl(serviceUrl));
    },
    createDBinstance: function (dbName) {
        var db = {
            name: dbName,
            connection: mongoose.createConnection('mongodb://localhost:27017/' + dbName)
        };
        db.MetricModel = db.connection.model('Metric', schema);
        return this.dbs.push(db) - 1;
    },
    getCurrentMetricsPromise: function (db) {
        return db.MetricModel
            .find({}, '-_id')
            .sort('-request.timing.performanceMetricsDone')
            .limit(20)
            .exec(function (err, metrics) {
               return metrics.reverse();
            });
    },
    getCurrentMetricPromise: function (db) {
        return db.MetricModel
            .find({}, '-_id')
            .sort('-request.timing.performanceMetricsDone')
            .limit(1)
            .exec(function (err, metrics) {
                return metrics;
            });
    },
    saveMetric: function (db, metric) {
        var metricDocument = new db.MetricModel(metric);
        metricDocument.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
};

module.exports = MongoInterface;
