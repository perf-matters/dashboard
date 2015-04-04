var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var YSLOW = require('yslow').YSLOW;
var doc = require('jsdom').jsdom();
var metricsRetriever = require('./metrics/index');

var http = require('http');
var hookConfig = require('./config/dashboard_common').config.siteSpeed.hook;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dashboard');

var MetricModel = mongoose.model('Metric', {
    request: Object,
    HAR: Object,
    report: Object
});

function getPathFromConfig () {
    var paramsString = hookConfig.path + '?';
    var params = [];
    for (var param in hookConfig.params) {
        params.push(param + '=' + encodeURIComponent(hookConfig.params[param]));
    }
    return paramsString + params.join('&');
}

var hookPath = getPathFromConfig();

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(compression());

function sendMetricsRequest () {
    var options = {
        hostname: hookConfig.hostname,
        port: hookConfig.port,
        path: hookPath
    };

    http.get(options).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

app.get('/har', function (req, res) {
    MetricModel
        .find({}, '-_id')
        .sort('-request.timing.performanceMetricsDone')
        .limit(20)
        .exec(function (err, metrics) {
            if (err || !metrics.length) {
                sendMetricsRequest();
                res.status(404).send({message: 'No data yet.'});
                return;
            }
            metrics = metrics.reverse();
            sendMetricsRequest();
            res.status(200).send(metricsRetriever(metrics));
        });
});

app.put('/hook', function (req, res) {
    var metric = req.body;
    var importHar = YSLOW.harImporter.run(doc, metric.HAR, 'ydefault');

    if (req.body.request.timing) {
        metric.report = YSLOW.util.getResults(importHar.context, 'all');

        var metricDocument = new MetricModel(metric);
        metricDocument.save(function (err) {
            if (err) {
                console.log(err);
            }
        });

        res.status(201).send();
    } else {
        res.status(400).send();
    }
});

var server = app.listen(9999);
