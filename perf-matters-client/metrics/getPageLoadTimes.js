module.exports = function (rawData) {
    var metrics = {
        columns: [
            {
                type: 'string',
                name: 'Time'
            },
            {
                type: 'number',
                name: 'onContentLoad'
            },
            {
                type: 'number',
                name: 'onLoad'
            }
        ],
        rows: [],
        options: {
            chart: {
                title: 'Page load times',
                subtitle: 'in milliseconds (ms)'
            },
            curveType: 'function',
            backgroundColor: '#0f0f0f',
            titleTextStyle: {
                color: '#ccc'
            },
            legend: {
                textStyle: {
                    color: '#ccc',
                    fontSize: 14
                },
                position: 'top',
                alignment: 'start',
                maxLines: 1
            }
        }
    };

    rawData.map(
        function (dataSet) {
            return metrics.rows.push([new Date(dataSet.HAR.log.pages[0].startedDateTime).toLocaleTimeString()]);
        }
    );

    for (var i = 0; i < metrics.rows.length; i++) {
        metrics.rows[i].push(rawData[i].HAR.log.pages[0].pageTimings.onContentLoad);
        metrics.rows[i].push(rawData[i].HAR.log.pages[0].pageTimings.onLoad);
    }

    return metrics;
};
