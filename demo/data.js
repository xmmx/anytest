var stage, chart0, chart1, chart, chart3, chart4, chart5, chart6, chart;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function() {
    anytest.setUp(900, 400);
    //anychart.licenseKey('Irina-d43a427a-1985961f');


    chart = anychart.bullet();
    chart.data([11, 13]);
    chart.title('Bullet\r\nAxis');
    chart.range().from(0).to(5);
    chart.range(1).from(5).to(10);
    chart.range(2).from(10).to(15);

    chart.axis({
        stroke: '2 green',
        orientation: 'bottom',
        minorLabels: {enabled: true},
        minorTicks: {length: 5, position: 'inside', stroke: '2 red'},
        title: 'Settings for axis - stroke, minorTicks,\r\norientation, minorLabels'
    });
    anytest.stageListen(function() {
        anytest.step(function() {
            anytest.CAT.getScreen();
            anytest.CAT.action(100,100)
        });
        anytest.step(function() {
            chart.axis({orientation: 'top'});
            anytest.CAT.getScreen('afterDrawChangeOfOrientationAtTheTop', -1);
            chart.axis({orientation: 'bottom'});
        });
        anytest.exit();
    }).drawInStage(chart);
    anytest.interactivePanel();
    anytest.charts4modes("chart");
    stage.resume();
});
