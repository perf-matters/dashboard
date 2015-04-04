var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var YSLOW = require('yslow').YSLOW;
var doc = require('jsdom').jsdom();
var metrics = require('./metrics/index');
var metricsRetriever = require('./utils/getMetrics');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(compression());

var mongo = require('./utils/mongo');
mongo.setMetricsInterval();

app.get('/getMetrics', function (req, res) {
    metricsRetriever.getMetrics();
    res.status(200).send();
})

app.get('/pageLoadTimes', function (req, res) {
    res.status(200).send(metrics.getPageLoadTimes(mongo.getCurrentMetrics()));
});

app.get('/resourcesBySize', function (req, res) {
    res.status(200).send(metrics.getResourcesBySize(mongo.getCurrentMetrics()));
});

app.put('/hook', function (req, res) {
    var metric = req.body;
    var importHar = YSLOW.harImporter.run(doc, metric.HAR, 'ydefault');

    if (req.body.request.timing) {
        metric.report = YSLOW.util.getResults(importHar.context, 'all');
        mongo.saveMetric(metric);
        res.status(201).send();
    } else {
        res.status(400).send();
    }
});

var server = app.listen(9999);
