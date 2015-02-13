var stage, chart;
anychart.onDocumentLoad(function() {

  anytest.init();
  chart = anychart.columnChart();
  var flag = true;
  anytest.chartListen(chart, function() {
    flag = !flag;
    if (flag) {
      anytest.CAT.getScreen();
      anytest.exit();
    }
  }, false);
  chart.column([1,2,3,4]);
  chart.title().text('Changing container');
  chart.container('container');
  chart.draw();
  // переопределяем контейнер
  chart.container('container');
  chart.draw();

});
