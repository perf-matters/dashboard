module.exports = function (promise) {
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

    return promise.then(function (rawData) {
        if (!rawData.length) {
            return null;
        }
        rawData = rawData[0];

        metrics.data[1].push(rawData.report.stats.css.w / 1024);
        metrics.data[2].push(rawData.report.stats.image.w / 1024);
        metrics.data[3].push(rawData.report.stats.doc.w / 1024);
        metrics.data[4].push(rawData.report.stats.js.w / 1024);

        for (var i = 1; i < metrics.data.length; i++) {
            metrics.data[i][0] += ' (' + metrics.data[i][1].toFixed(2) + 'KB)';
        }

        return metrics;
    });
};
