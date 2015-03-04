var stage, chart;
anychart.onDocumentLoad(function() {
    anytest.setUp().description('Добавляем серии в cartesian после того как график нарисовался');

    chart = anychart.cartesian();
    chart.area([4, 4, 9, 7]);
    chart.legend(true);
    anytest.chartListen(chart, function() {
        anytest.CAT.getScreen();
        chart.bubble([[1, 7, 20], [0, 6, 15]]);
        chart.marker([5, 10, 16, 7]);
        chart.line([6,13, 14, 4]);
        chart.bar([6, 3.5]);
        chart.spline([1, 4.5, 2, 3.5]);
        chart.stepLine([9, 4.2, 8.5, 5]);
        chart.column([3, 3.75]);
        chart.candlestick([[2, 5, 4, 6, 2]]);
        chart.ohlc([[2, 7, 11, 8, 10.5]]);
        chart.rangeArea([
            [2, 10, 6, 3],
            [3, 15, 1, 7]
        ]);
        chart.rangeBar([
            [3, 10, 6, 3],
            [2, 15, 7, 1]]);
        chart.rangeColumn([
            [0, 10, 6, 3],
            [1, 15, 7, 1]
        ]);
        chart.rangeSplineArea([
            [2, 15, 8, 6],
            [3, 10, 4, 2]
        ]);
        chart.rangeStepArea([
            [2, 2, 4, 2.9],
            [3, 1, 1, 2]
        ]);
        chart.splineArea([1, 2, 3, 3]);
        chart.stepArea([2.5, 1, 4, 1.5]);
        anytest.CAT.getScreen('addSeries',  -1);
        anytest.exit();
    }).drawInStage(chart);
    stage.resume();
});
