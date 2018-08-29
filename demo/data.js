anychart.onDocumentLoad(function() {
    anytest.setUp(400,400);


    var dataTable = anychart.data.table();
    dataTable.addData(get_orcl_daily_short_data());

    var dataTable1 = anychart.data.table();
    dataTable1.addData(get_msft_daily_short_data());

    var mapping1 = dataTable.mapAs();
    mapping1.addField('high', 2);
    mapping1.addField('low', 1);

    var mapping2 = dataTable1.mapAs();
    mapping2.addField('value', 3);
    mapping2.addField('high', 2);
    mapping2.addField('low', 1);

    var mapping = dataTable.mapAs();
    mapping.addField('open', 1, 'open');
    mapping.addField('high', 2, 'high');
    mapping.addField('low', 3, 'low');
    mapping.addField('close', 4, 'close');
    mapping.addField('value', 4, 'close');
    mapping.addField('volume', 5, 'average');

    chart = anychart.stock();

    var Plot1 = chart.plot();
    Plot1.jumpLine().data(mapping2);
    eventMarkers1 = Plot1.eventMarkers()
        .group([
            '2006-06-10',
            Date.UTC(2006, 5, 8),
            '2006-06-13'])
        .fill({
            src: "http://static.anychart.com/images/underwater.jpg",
            mode: 'stretch'
        });

    // stage.listen('stagerendered', function(){
    //     console.log('stagerender')
    //     // anytest.stepExec()
    // });

    anytest.drawInStage(chart);

    anytest.stageListen(function () {
        // anytest.step(function(){
        //      anytest.stepExec()
        // });

        anytest.step(function() {
            Plot2 = chart.plot(1);
            eventMarkers2 = Plot2.eventMarkers().group(0);
            eventMarkers2.format(function () {
                return this.title;
            });
            anytest.CAT.getScreen();
        });
        anytest.exit();
    });
//        anytest.createPanel('interactive');
    stage.resume();
});