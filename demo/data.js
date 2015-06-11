var stage, chart;
anychart.onDocumentLoad(function() {
    anytest.setUp();

    chart = anychart.cartesian();
    var firstSeries = chart.rangeSplineArea([[10, 6, 3], [15, 1, 7], [21, 2, 4], [30, 4, 8]]);
    firstSeries.hoverMarkers({fill: '#F44336'});
    firstSeries.tooltip(null);

//        anytest.createPanel('interactive');
    anytest.chartListen(chart, function(){
        anytest.CAT.getScreen();
        firstSeries.hover();
        anytest.CAT.getScreen('hoverAllSeries', -1);
        firstSeries.unhover();
        anytest.CAT.getScreen('unhoverAllSeries', 1);
        firstSeries.hover(3);
        anytest.CAT.getScreen('hover3Point', -1, 'unhoverAllSeries');
        anytest.CAT.action(335, 75);
        anytest.CAT.getScreen('hover3PointMouse', 1, 'hover3Point');
        firstSeries.hover(8);
        anytest.CAT.getScreen('outOfRange', 1, 'hoverAllSeries');
        anytest.exit();
    }).drawInStage(chart);
    stage.resume();
});
