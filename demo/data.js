anychart.onDocumentLoad(function() {
    anytest.setUp();

    var chart0 = anychart.area3d();
    chart0.area([10, 4, 6, 3]);
    chart0.area([4, 6, -2, 3]);
    chart0.area([3, 2, 3, 2]);
    chart0.animation({enabled: true, duration: '2000'});

    chart0.listen('animationstart', function() {
        // log(anytest.loadManager)
        anytest.loadManager['animation']=true;
        anytest.CAT.getScreen('animationstart');
        window.setTimeout(function(){
            anytest.CAT.getScreen('halfAnimation', -1,'animationstart');
        }, chart0.animation().duration()/2);
    });
    chart0.listen('animationend', function() {
        anytest.CAT.getScreen('animationEnd',-1,'animationstart');
        // log(anytest.loadManager)
        delete anytest.loadManager['animation'];
        // log(anytest.loadManager)
    });

    anytest.stageListen().drawInStage(chart0);
    stage.resume();
});