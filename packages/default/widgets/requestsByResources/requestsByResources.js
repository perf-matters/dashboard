widget = {
    //runs when we receive data from the job
    onData: function(el, data) {
        var metrics = JSON.parse(data.metrics);

        if (!metrics) {
            return;
        }

        if (!google.visualization) {
            google.load('visualization', '1.1', {
                packages: ['line', 'corechart'],
                callback: drawChart
            });
        } else {
            drawChart();
        }

        function drawChart() {
            var chartData = new google.visualization.arrayToDataTable(metrics.data);
            var chart = new google.visualization.PieChart(document.getElementById('requestsByResources'));

            chart.draw(chartData, metrics.options);
        }
    }
};
