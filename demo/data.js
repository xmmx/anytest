var stage, chart;
anychart.onDocumentLoad(function() {
    anytest.setUp().description('Добавляем серии в cartesian после того как график нарисовался');

    chart = anychart.circularGauge([1,2]);

    chart.axis().scale()
        .minimum(0)
        .maximum(36)
        .ticks({interval: 4});


    anytest.chartListen(chart, function() {
        anytest.CAT.getScreen();
        anytest.exit();
    }).drawInStage(chart);
    stage.resume();
});
