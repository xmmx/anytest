var stage, chart;
anychart.onDocumentLoad(function() {
  anytest.setUp();

  var sparkLine = anychart.sparkline();
  sparkLine.title('Default').bounds(0, 0, 400, 300);
  var s = sparkLine.type('line').data([1, 5, -5, 6, 8, 12]);
  anytest.chartListen(sparkLine, function() {
    anytest.CAT.getScreen();
    anytest.CAT.getScreen('changedSeries',  -1);
    anytest.exit();
  }, false).drawInStage(sparkLine);

  stage.resume();

});
