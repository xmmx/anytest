var stage, chart0, chart1, chart, chart3, chart4, chart5, chart6, chart;
//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart
//anytest.timeEnd('scriptLoad'); // засекаем когда начался грузится скрипт anychart
anychart.onDocumentLoad(function() {
    anytest.setUp(900, 400);
    //anychart.licenseKey('Irina-d43a427a-1985961f');


    var calendar = anychart.scales.calendar();
    calendar.weekendRange([5,6]);

    calendar.availabilities([  // Правило для абсолютно любого дня, каждый год (переопределит weekendRange указанный ранее)
        {each:'day', from: '10:00', to: '18:00'},
        {each:'day', from: '14:00', to: '15:00', isWorking: false}
    ]);
    calendar.availabilities(null);


    var calendar1 = anychart.scales.calendar(calendar);

    calendar1.availabilities([ // Правило что суббота и воскресенье, каждую неделю, не рабочие дни
        {each: 'day'},
        {each:'week', on:6, isWorking: false},
        {each:'week', on:5, isWorking: false},
        {each:'day', from: '14:00', to: '15:00', isWorking: false}
    ]);
    console.log(
            [new Date('2016-01-01').getTime(), new Date(1970,1,1,10,11).getTime()]

    )

    anytest.asserts.deepEqual(calendar1.getWorkingSchedule(new Date('1970-01-01 08:00:00').getTime(), new Date('1970-01-01 08:00:00').getTime()), //Антон С. сказал что это ОК (хотя бы один день всегда есть)
        [
            [
                [new Date('1970-01-01 08:00:00').getTime(), new Date('1970-01-01 22:00:00').getTime()],
                [new Date('1970-01-01 23:00:00').getTime(), new Date('1970-01-02 07:59:00').getTime()]
            ]
        ]
    );
    anytest.asserts.deepEqual(calendar1.getWorkingSchedule(-5, -4), // отрицательный timestamp
        [
            [
                [new Date('1969-12-31 08:00:00').getTime(), new Date('1969-12-31 22:00:00').getTime()],
                [new Date('1969-12-31 23:00:00').getTime(), new Date('1970-01-01 07:59:00').getTime()]
            ]
        ]
    );

    anytest.stageListen();
    stage.resume();
});
