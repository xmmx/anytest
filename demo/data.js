var chart0, chart1, chart2, chart3, chart4, chart5;
anychart.onDocumentLoad(function() {
    anytest.setUp(900, 400);

    var dataSet = anychart.data.set([
        ['P1', 44, 77, 33, '122.56'],
        ['P2', 55, 88, '22', 187.12],
        ['P3', 66, 99, 11, 54.32]
    ]);
    var seriesData_1 = dataSet.mapAs({x: [0], value: [1]});
    var seriesData_2 = dataSet.mapAs({x: [0], value: [2]});
    var seriesData_3 = dataSet.mapAs({x: [0], value: [3]});
    var seriesData_4 = dataSet.mapAs({x: [0], value: [4]});


    chart0 = anychart.cartesian();
    chart0.bounds(new acgraph.math.Rect(0, 0, 300, 200));
    chart0.title().enabled(true).text('Basic bar chart');
    anytest.drawInStage(chart0);

    series = chart0.bar(seriesData_1);
    series = chart0.bar(seriesData_2);
    series = chart0.bar(seriesData_3);
    series = chart0.bar(seriesData_4);

    chart1 = anychart.cartesian();
    chart1.bounds(new acgraph.math.Rect(300, 0, 300, 200));
    chart1.barGroupsPadding(3);
    chart1.title().enabled(true).text('Bar Chart with barGroupsPadding 3');

    series = chart1.bar(seriesData_1);
    series = chart1.bar(seriesData_2);
    series = chart1.bar(seriesData_3);
    series = chart1.bar(seriesData_4);
    anytest.drawInStage(chart1);

    chart2 = anychart.cartesian();
    chart2.bounds(new acgraph.math.Rect(600, 0, 300, 200));
    chart2.barsPadding(3);
    chart2.title().enabled(true).text('Bar Chart with barsPadding 3');

    series = chart2.bar(seriesData_1);
    series = chart2.bar(seriesData_2);
    series = chart2.bar(seriesData_3);
    series = chart2.bar(seriesData_4);
    anytest.drawInStage(chart2);

    chart3 = anychart.cartesian();
    chart3.bounds(new acgraph.math.Rect(0, 200, 300, 200));
    chart3.title().enabled(true).text('Basic column chart');
    anytest.drawInStage(chart3);

    series = chart3.column(seriesData_1);
    series = chart3.column(seriesData_2);
    series = chart3.column(seriesData_3);
    series = chart3.column(seriesData_4);

    chart4 = anychart.cartesian();
    chart4.bounds(new acgraph.math.Rect(300, 200, 300, 200));
    chart4.barGroupsPadding(3);
    chart4.title().enabled(true).text('Column Chart with barGroupsPadding 3');

    series = chart4.column(seriesData_1);
    series = chart4.column(seriesData_2);
    series = chart4.column(seriesData_3);
    series = chart4.column(seriesData_4);
    anytest.drawInStage(chart4);

    chart5 = anychart.cartesian();
    chart5.bounds(new acgraph.math.Rect(600, 200, 300, 200));
    chart5.barsPadding(3);
    chart5.title().enabled(true).text('Column Chart with barsPadding 3');

    series = chart5.column(seriesData_1);
    series = chart5.column(seriesData_2);
    series = chart5.column(seriesData_3);
    series1 = chart5.column(seriesData_4);

    anytest.drawInStage(chart5);
    anytest.stageListen(function() {
        anytest.step(function() {
            anytest.CAT.getScreen()
        });
        anytest.step(function() {
            chart4.barGroupsPadding(6);
            anytest.CAT.getScreen('afterDrawChangeBarsPadding', -1);
        });
        anytest.step(function(){
            chart4.barGroupsPadding(3);
            anytest.CAT.getScreen('def', 1);
        });
        anytest.exit();
    }).charts4modes("chart0", "chart1", "chart2", "chart3", "chart4", "chart5");
    stage.resume();
    /*<< methods
     anychart.charts.Cartesian.barGroupsPadding
     anychart.charts.Cartesian.barsPadding
     >>*/
});