widget = {
    //runs when we receive data from the job
    onData: function(el, data) {
        var metrics = JSON.parse(data.metrics);

        if (!metrics) {
            return;
        }

        if (!google.charts) {
            google.load('visualization', '1.1', {
                packages: ['line', 'corechart'],
                callback: drawChart
            });
        } else {
            drawChart();
        }

        function drawChart() {
            var chartData = new google.visualization.DataTable();

            for (var i = 0; i < metrics.columns.length; i++) {
                chartData.addColumn(metrics.columns[i].type, metrics.columns[i].name);
            }

            chartData.addRows(metrics.rows);
            var chart = new google.charts.Line(document.getElementById('page_load_times'));

            chart.draw(chartData, google.charts.Line.convertOptions(metrics.options));
        }
    }
};
