module.exports = function (rawData) {
    return {
        labels: rawData.map(function (dataSet) {return new Date(dataSet.HAR.log.pages[0].startedDateTime).toLocaleTimeString()}),
        datasets: [
            {
                label: "DOM content loaded",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: rawData.map(function (dataSet) {return dataSet.HAR.log.pages[0].pageTimings.onContentLoad})
            },
            {
                label: "Page loaded",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: rawData.map(function (dataSet) {return dataSet.HAR.log.pages[0].pageTimings.onLoad})
            }
        ]
    }
};
