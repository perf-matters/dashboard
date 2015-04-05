module.exports = function (rawData) {
    var metrics = {
        data: [
            ['Resources', 'weight in KB'],
            ['css'],
            ['images'],
            ['documents'],
            ['javascripts']
        ],
        options: {
            pieSliceText: 'label',
            title: 'Resources by size (KB)',
            titleTextStyle: {
                color: '#ccc'
            },
            backgroundColor: '#0f0f0f',
            legend: {
                textStyle: {
                    color: '#ccc'
                }
            }
        }
    };

    rawData = rawData.reverse()[0];
    metrics.data[1].push(rawData.report.stats.css.w / 1024);
    metrics.data[2].push(rawData.report.stats.image.w / 1024);
    metrics.data[3].push(rawData.report.stats.doc.w / 1024);
    metrics.data[4].push(rawData.report.stats.js.w / 1024);

    return metrics;
};
