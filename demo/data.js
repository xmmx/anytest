var stage, chart;
anychart.onDocumentLoad(function() {

  anytest.setUp();
  chart = anychart.lineChart();
  var dataSet = anychart.data.set([
    ['A1' , 1,   5, 2],
    ['A2' , 2,   5,  4],
    ['A3' , 0,   3, 5],
    ['A4' , 1.5, 3, 2],
    ['A5' , 5,  7, 1],
    ['A6' , 4,   6, -5],
    ['A7' , 5,  2, 0.5]
  ]);
  chart.line(dataSet.mapAs({x: [0], value: [1]}));
  chart.spline(dataSet.mapAs({x: [0], value: [2]}));

  anytest.chartListen().drawInStage(chart);
  chart.area(dataSet.mapAs({x: [0], value: [1]}));
  stage.resume();

});
