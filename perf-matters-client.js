var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var YSLOW = require('yslow').YSLOW;
var doc = require('jsdom').jsdom();

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
    MetricModel.find({}, '-_id').sort('request.timing.performanceMetricsDone').limit(10).exec(function (err, metrics) {
        if (err) {
            sendMetricsRequest();
            res.status(404).send({message: 'Request queued.'});
            return;
        }

        sendMetricsRequest();
        res.status(200).send(metrics);
    });
});

app.put('/hook', function (req, res) {
    var metric = req.body;
    var importHar = YSLOW.harImporter.run(doc, metric.HAR, 'ydefault');

    if (req.body.request.timing) {
        metric.report = YSLOW.util.getResults(importHar.context, 'all');

        var metricDocument = new MetricModel(metric);
        metricDocument.save();
        res.status(201).send();
    } else {
        res.status(400).send();
    }
});

var server = app.listen(9999);
