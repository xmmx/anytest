var stage, chart;
anychart.onDocumentLoad(function() {

  anytest
      .setUp(400, 125)
      .description('MarkerPalette - line, ellipse, bar, x');
  anytest.setCheckMsg("Info: 2 Description: It is not recommended to use more than 2 markers in Bullet Chart." +
      " Currently there are '4' markers. Expert opinion at http://cdn.anychart.com/warning/2.html");
  chart = anychart.bulletChart();

  chart.data([5,10,11,15]);
  chart.title().text('MarkerPalette');
  chart.range().from(0).to(5);
  chart.range(1).from(5).to(10);
  chart.range(2).from(10).to(15);
  chart.markerPalette(['line', 'ellipse', 'bar', 'x']);
  anytest.drawInStage(chart);
  anytest.stageListen();

  stage.resume();

});
