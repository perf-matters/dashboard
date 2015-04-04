module.exports = function (rawData) {
    var metrics = {
        labels: rawData.map(function (dataSet) {return new Date(dataSet.HAR.log.pages[0].startedDateTime).toLocaleTimeString()}),
        datasets: []
    };
    var datasets = {
        css: {
            label: "css",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)"
        },
        image: {
            label: "images",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)"
        },
        doc: {
            label: "documents",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)"
        },
        js: {
            label: "javascripts",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)"
        }
    };

    for (var label in datasets) {
        datasets[label].data = rawData.map(function (record) {
            return record.report.stats[label].w / 1024;
        });
        metrics.datasets.push(datasets[label]);
    }

    return metrics;
};
