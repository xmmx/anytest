var stage, chart;
anychart.onDocumentLoad(function() {
//  anytest.setModes('schemas');
  anytest.setUp();
  chart = anychart.bar([1,2,3]);
  anytest.chartListen();
  anytest.drawInStage();
  stage.resume();
});
