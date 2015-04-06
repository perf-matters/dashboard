var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var YSLOW = require('yslow').YSLOW;
var doc = require('jsdom').jsdom();
var metrics = require('./metrics/index');
var url = require('url');
var MongoInterface = require('./db/mongo');
var mongoInterface = new MongoInterface();

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(compression());

app.use(function (req, res, next) {
    res.promise = function(promise) {
        promise.then(function(result) {
            res.status(200).send(result);
        }, function(err) {
            if (err.statusCode) {
                res.status(err.statusCode).send({ error: err.message });
            } else {
                res.status(500).send({ error: 'Unexpected error' });
            }
        });
    };
    next();
});

app.get('/pageLoadTimes', function (req, res) {
    var db = mongoInterface.getDBFromServiceUrl(req.query.serviceUrl);
    res.promise(metrics.getPageLoadTimes(mongoInterface.getCurrentMetricsPromise(db)));
});

app.get('/resourcesBySize', function (req, res) {
    var db = mongoInterface.getDBFromServiceUrl(req.query.serviceUrl);
    res.promise(metrics.getResourcesBySize(mongoInterface.getCurrentMetricPromise(db)));
});

app.get('/requestsByResources', function (req, res) {
    var db = mongoInterface.getDBFromServiceUrl(req.query.serviceUrl);
    res.promise(metrics.getRequestsByResources(mongoInterface.getCurrentMetricPromise(db)));
});

app.put('/hook', function (req, res) {
    var metric = req.body;
    var db = mongoInterface.getDBFromServiceUrl(req.body.request.serviceUrl);

    var importHar = YSLOW.harImporter.run(doc, metric.HAR, 'ydefault');

    if (req.body.request.timing) {
        metric.report = YSLOW.util.getResults(importHar.context, 'all');
        mongoInterface.saveMetric(db, metric);
        res.status(201).send();
    } else {
        res.status(400).send();
    }
});

var server = app.listen(9999);
