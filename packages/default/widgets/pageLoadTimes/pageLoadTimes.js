widget = {
    //runs when we receive data from the job
    onData: function(el, data) {
        var metrics = JSON.parse(data.metrics);

        if (!metrics) {
            return;
        }

        var ctx = document.getElementById("pageLoadTimes").getContext("2d");
        var myNewChart = new Chart(ctx).Line(metrics);
    }
};
