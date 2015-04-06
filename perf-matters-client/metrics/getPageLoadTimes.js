module.exports = function (promise) {
    var metrics = {
        columns: [
            {
                type: 'string',
                name: 'Time'
            },
            {
                type: 'number',
                name: 'Response time'
            },
            {
                type: 'number',
                name: 'DOM content loaded'
            },
            {
                type: 'number',
                name: 'Page loaded'
            }
        ],
        rows: [],
        options: {
            chart: {
                title: 'Page load times',
                subtitle: 'in seconds'
            },
            curveType: 'function',
            backgroundColor: '#0f0f0f',
            titleTextStyle: {
                color: '#ccc',
                fontSize: 18
            },
            legend: {
                textStyle: {
                    color: '#ccc',
                    fontSize: 14
                },
                position: 'in',
                alignment: 'start',
                maxLines: 1
            },
            vAxis: {
                viewWindow: {
                    min: 0
                }
            }
        }
    };

    return promise.then(function (rawData) {
        rawData.map(
            function (dataSet) {
                return metrics.rows.push([new Date(dataSet.HAR.log.pages[0].startedDateTime).toLocaleTimeString()]);
            }
        );

        for (var i = 0; i < metrics.rows.length; i++) {
            metrics.rows[i].push(rawData[i].HAR.log.entries[0].time / 1000);
            metrics.rows[i].push(rawData[i].HAR.log.pages[0].pageTimings.onContentLoad / 1000);
            metrics.rows[i].push(rawData[i].HAR.log.pages[0].pageTimings.onLoad / 1000);
        }

        return metrics;
    });
};
