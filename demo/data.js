var stage, chart0, chart1, chart, chart3, chart4, chart5, chart6, chart;
anytest.ACDVF = true;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function() {
    anytest.setUp();
    chart = anychart.cartesian();
    chart.area([1,3,4,-2,-7]);

    chart['at_exclude_json'] = 'yes;'
    chart['at_exclude_xml'] = 'yes;'

    anytest.stageListen(function () {
        anytest.step(function () {
            anytest.CAT.getScreen();
        });
        anytest.step(function () {
            anytest.CAT.getScreen('1');
        });
        anytest.step(function () {
            anytest.CAT.getScreen('2');
        });

        anytest.exit();
    }).charts4modes();
    anytest.drawInStage(chart);

    stage.resume();
});
