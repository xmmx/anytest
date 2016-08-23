var stage, chart0, chart1, chart, chart3, chart4, chart5, chart6, chart;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function() {
    anytest.setUp(900, 400);
    //anychart.licenseKey('Irina-d43a427a-1985961f');

    chart1 = anychart.line();
    chart1.line([
        ['A1' , 3],
        ['A2' , 5],
        ['A3' , 0],
        ['A4' , 4.1],
        ['A5' , 9.5]
    ]);
    chart1.bounds(new acgraph.math.Rect(0, 0, 300, 400));
    anytest.drawInStage(chart1);
    chart1.credits(true);
    chart1.credits()
        .text('Credits')
        .url('http://playground.anychart.com/')
        .alt('WaterMarkCredits')
        .logoSrc('http://static.anychart.com/kitty.png');

    chart2 = anychart.line();
    chart2.line([
        ['A1' , 3],
        ['A2' , 5],
        ['A3' , 0],
        ['A4' , 4.1],
        ['A5' , 9.5]
    ]);

    chart2.bounds(new acgraph.math.Rect(300, 0, 300, 400));
    anytest.drawInStage(chart2);
    chart2.credits(false);

    chart3 = anychart.line();
    chart3.line([
        ['A1' , 3],
        ['A2' , 5],
        ['A3' , 0],
        ['A4' , 4.1],
        ['A5' , 9.5]
    ]);

    chart3.bounds(new acgraph.math.Rect(600, 0, 300, 400));
    anytest.drawInStage(chart3);

    anytest.stageListen(function(){
        anytest.step(function(){
            chart3.credits(true);
        }, true, 200);
        anytest.step(function(){
            anytest.CAT.getScreen();
        });
        anytest.step(function(){
            chart2.credits(false);
            anytest.CAT.getScreen('CreditsFalse', -1);
        });
        anytest.step(function(){
            chart3.credits(true);
            chart2.credits()
                .text('CreditsNew')
                .url('https://anychart.atlassian.net/browse/DVF-2261')
                .alt('DVF-2261')
                .logoSrc('http://static.anychart.com/images/github.png');
            anytest.CAT.getScreen('ChangeCredits', -1, 'CreditsFalse');
            chart1.credits()
                .text('Credits')
                .url('http://playground.anychart.com/')
                .alt('WaterMarkCredits')
                .logoSrc('http://static.anychart.com/kitty.png');
        });
        anytest.step(function(){
            anytest.CAT.getScreen('BackToInitialState', 1);
        });
        anytest.exit();
    }).charts4modes('chart1','chart2','chart3');
    stage.resume();
});
