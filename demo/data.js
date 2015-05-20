var stage, chart, series, data1, data2;
anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function () {
    anytest.timeEnd('onDocumentReady'); // страница загрузилась
    anytest.time('test_job'); // начал работу тест

    //////////// тело теста ////////////
    anytest.setUp();

    data1 = anychart.data.set([[1, 3, 2],[2, 30, 20],[3, 3, 2]]);
    data2 = anychart.data.set([
        {x: "A1", value: 101},
        {x: "A2", value: 77},
        {x: "A3", value: 11},
    ]);

    anytest.time('create_chart');  // засекаем время создания чарта
    chart = anychart.line();

    anytest.time('create_series1',1); // засекаем время созания первой серии
    series = chart.spline(data1.mapAs({x: [0], value: [1]}));
    anytest.time('create_series2',1); // засекаем время созания дополнительной серии
    chart.spline(data1.mapAs({x: [0], value: [2]}));

    anytest.time('chart_setContainer',1); // засекаем время присвоения контейнера
    chart.container(stage);

    anytest.time('chart_draw',1); // засекаем время калькуляции DOM модели
    chart.draw();
    // в случае рисования в стейдж - это таймер на работу только с DOM !!!
    anytest.time('render', 1);

    // afterDraw
    anytest.chartListen(chart, listenerHandler, false);

    stage.resume();
});

var drawCounter = -1;
function listenerHandler() {
    drawCounter++;
    afterDrawCalls[drawCounter]();
}

var afterDrawCalls = [];
/////////////// change popr
afterDrawCalls.push(function(){
    anytest.time('changeProp',1);
    chart.title().fontColor('red');
});

/////////////// resize
afterDrawCalls.push(function(){
    // resize to big
    anytest.time('resizeToBig',1);
    chart.width(1000);
});
afterDrawCalls.push(function(){
    // resize back
    anytest.time('resizeBack',1);
    chart.width(stage.width());
});

//////////////// data operations
afterDrawCalls.push(function(){
    //fully replace data
    anytest.time('replaceData',1);
    series.data(data2);
});
afterDrawCalls.push(function(){
    anytest.time('CRUD_add',1);
    //CRUD
    var view = data2.mapAs();
    view.set(2, 'x', 'B3');
});
afterDrawCalls.push(function(){
    anytest.time('CRUD_get',1);
    //CRUD
    var view = data2.mapAs();
    view.get(2, 'x');
    listenerHandler();
});
afterDrawCalls.push(function(){
    anytest.time('CRUD_set',1);
    //CRUD
    var view = data2.mapAs();
    view.set(2, 'x', 'B3');
});
afterDrawCalls.push(function(){
    anytest.time('CRUD_remove',1);
    //CRUD
    data2.remove(2);
});

//////////////// interactive
afterDrawCalls.push(function(){
    anytest.time('interactivity_hover', 1);
    anytest.CAT.action('200', '200', 'mouseover', true);
    listenerHandler();
});
afterDrawCalls.push(function(){
    anytest.time('interactivity_unhover',1);
    anytest.CAT.action('0', '0', 'mouseover', true);
    listenerHandler();
});

//// Dispose
afterDrawCalls.push(function(){
    anytest.time('dispose',1);
    chart.dispose();
    listenerHandler();
});

//// exit
afterDrawCalls.push(function(){
    anytest.exit();
});
