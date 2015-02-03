var stage, chart;
anychart.onDocumentLoad(function() {

  anytest.setUp();

  chart = anychart.cartesian();
  var lineSeries = chart.line([
    [15, 17, 14, 16],
    [4, 9, 2, 3],
    [20, 30, 15, 10],
    [10, 15, 9, 20]
  ]);
  lineSeries.markers().enabled(true);
  lineSeries.labels().enabled(true).position('righttop');
  lineSeries.fill('green')
      .stroke('5 yellow');
  anytest.chartListen().drawInStage(chart);


  stage.resume();



});
