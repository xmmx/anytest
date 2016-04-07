var stage, chart0, chart1, chart, chart3, chart4, chart5, chart6, chart;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function () {
    anytest.setUp(600, 400);

    var scale2 = anychart.scales.dateTime();
    scale2.softMinimum(Date.UTC(1998, 9, 6));
    scale2.softMaximum(1160092800000);
    scale2.ticks().interval(1, 0, 0);
    chart = anychart.financial();
    chart.title().text('softMinimum(Date.UTC(1998, 9, 6))\nsoftMaximum(1160092800000)');
    chart.ohlc([
        [Date.UTC(2000, 9, 6), 2, 5, 1, 3],
        [Date.UTC(2004, 9, 6), 4, 6, 3, 3]
    ]);
    chart.xScale(scale2);
    chart.bounds(0, '50%', '50%', '50%');

    anytest.drawInStage(chart);
    anytest.stageListen(function() {
        anytest.step(function() {
            anytest.CAT.getScreen();
        });
        anytest.exit();
    }).charts4modes();
    //anytest.interactivePanel();
    stage.resume();

});
