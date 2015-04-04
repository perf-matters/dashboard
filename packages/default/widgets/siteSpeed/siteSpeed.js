widget = {
    //runs when we receive data from the job
    onData: function(el, data) {
        var metrics = JSON.parse(data.json);

        if (!metrics.HAR) {
            return;
        }

        var loadingTime = (metrics.report.lt / 1000).toFixed(3).replace('.', ',');

        //The parameters our job passed through are in the data object
        //el is our widget element, so our actions should all be relative to that
        if (data.title) {
            $('h2', el).text(data.title);
        }

        console.log(metrics);
        $('.content h3 .value', el).html(loadingTime);
    }
};
