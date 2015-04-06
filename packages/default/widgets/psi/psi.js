widget = {
    //runs when we receive data from the job
    onData: function(el, data) {
        var $base = $(el).find('.psi');
        $(el).find('.strategy').text(data.strategy);
        $base.find('.score.value')
            .text(data.results.score)
            .toggleClass('under-treshold', data.treshold > data.results.score);
        $base.find('.resources.value').text(data.results.pageStats.numberResources);
        $base.find('.hosts.value').text(data.results.pageStats.numberHosts);
    }
};
