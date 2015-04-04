module.exports = function (rawData) {
    var formattedMetrics = {
        report: rawData.report
    };

    formattedMetrics.pageLoadTimes = require('./getPageLoadTimes')(rawData);

    return formattedMetrics;
};
