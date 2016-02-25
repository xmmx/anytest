var stage, chart0, chart1, chart2, chart3, chart4, chart5, chart6, chart;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function () {
    anytest.setUp(600, 400);

    chart = anychart.cartesian3d();
    var series = chart.column([
        10452.7402,
        10411.8496,
        10543.8496,
        10535.46
    ]);

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
