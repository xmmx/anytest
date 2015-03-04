var chart, stage, width = 400, height = 300;
anychart.onDocumentLoad(function() {
    anytest.init();
    chart = anychart.lineChart([1, 3, 4]);
    anytest.chartListen(chart, function() {
        resize(+2);
        anytest.CAT.getScreen();

        anytest.CAT.action(233, 111);
        anytest.CAT.getScreen('hoverMarker', -1);
        anytest.CAT.action(1,1);
        resize(-2);

        //убираем контейнер и все падает
        removeContainer();

        resize(+2);
        anytest.CAT.getScreen('afterRemoveContainer', 1);

        anytest.CAT.action(233, 111);
        anytest.CAT.getScreen('hoverMarker2', 2, 'hoverMarker');
        anytest.exit();
    });
    chart.container('container').draw();
//        anytest.createPanel('interactive');
});

function removeContainer(){
    var container = document.getElementById('container');
    document.getElementById('wrapper').removeChild(container);
    document.getElementById('otherWrapper').appendChild(container);
}

function resize(val){
    width += val*20;
    height += val*20;
    document.getElementById('container').style.width = width;
    document.getElementById('container').style.height = height;
}