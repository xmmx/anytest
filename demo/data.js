var stage, chart;
anychart.onDocumentLoad(function() {
  anytest.setUp(500,500);

  var dataSet = anychart.data.set([
    {x: 'A1', y: 'B1', value: 23},
    {x: 'A2', y: 'B3', value: 30},
    {x: 'A3', y: 'B2', value: 21}
  ]);

  chart = anychart.heatMap();
  chart.data(dataSet);
  chart.tooltip(null);
  anytest.drawInStage(chart);

//        anytest.createPanel('interactive');
  anytest.chartListen(chart, function () {
    anytest.CAT.getScreen();
    chart.hover();
    anytest.CAT.getScreen('hoverAllSeries', -1);
    chart.unhover();
    anytest.CAT.getScreen('unhoverAllSeries', 1);
    chart.hover(0);
    anytest.CAT.getScreen('hover1Point', -1, 'unhoverAllSeries');
    anytest.CAT.action(114, 403, 'mousemove', 'defaultTheme');
    anytest.CAT.getScreen('hover1PointMouse', 1, 'hover1Point');
    chart.hover(8);
    anytest.CAT.getScreen('outOfRange', 1);
    chart.hover([1,2]);
    anytest.CAT.getScreen('hover12Points', -1);
    anytest.exit();
  });
  stage.resume();
});
