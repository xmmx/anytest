var stage, chart0, chart1, chart, chart3, chart4, chart5, chart6, chart;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function() {
    anytest.setUp(260, 190);

    chart1 = anychart.pie([11, 13, 14]).title({enabled: false});
    chart1.legend().enabled(false);

    chart1.minHeight(200);
    chart1.minWidth(300);

    chart1.height('100px');
    chart1.width('100px');
    chart1['at_exclude_R-CHART']=true;
    anytest.stageListen(function() {
        anytest.step(function() {
            log(chart1.width())
            anytest.CAT.getScreen();
        });
        anytest.step(function() {
            chart1.minHeight('170');
            chart1.minWidth('170');
            anytest.CAT.getScreen('afterDrawChangeMaxHeightWidthHowString', -1);
        });
        anytest.step(function() {
            chart1.minHeight('30%');
            chart1.minWidth('30%');
            log(chart1.width())
            anytest.CAT.getScreen('afterDrawChangeMinHeightWidthHowString', -1, 'afterDrawChangeMinHeightWidthHowPercent');
            chart1.minHeight(200);
            chart1.minWidth(300);
        });
        anytest.exit();
    }).drawInStage(chart1);
    anytest.charts4modes("chart1");
    stage.resume();
});
