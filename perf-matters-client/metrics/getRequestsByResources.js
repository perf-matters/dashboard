module.exports = function (rawData) {
    var metrics = {
        data: [
            ['Request', 'weight in KB'],
            ['css'],
            ['images'],
            ['documents'],
            ['javascripts']
        ],
        options: {
            pieSliceText: 'value',
            title: 'Number of requests by resources type',
            titleTextStyle: {
                color: '#ccc',
                fontSize: 18
            },
            backgroundColor: '#0f0f0f',
            legend: {
                textStyle: {
                    color: '#ccc'
                }
            }
        }
    };

    metrics.data[1].push(rawData.report.stats.css.r);
    metrics.data[2].push(rawData.report.stats.image.r);
    metrics.data[3].push(rawData.report.stats.doc.r);
    metrics.data[4].push(rawData.report.stats.js.r);

    for (var i = 1; i < metrics.data.length; i++) {
        metrics.data[i][0] += ' (' + metrics.data[i][1] + ')';
    }
    return metrics;
};
