goog.provide('anytest.timer');


/**
 @namespace
 @ignore
 @name anytest.timer
 */


/**
 * All started timers.
 * @type {Object}
 * @ignore
 */
anytest.timer.startTime = {};


/**
 * All timers delta.
 * @type {Object}
 * @ignore
 */
anytest.timer.allDeltas = {'JSstartedFrom': 0};


/**
 * All names for counters.
 * @type {Array}
 * @ignore
 */
anytest.timer.names = [];


/**
 * Is timer used.
 * @type {boolean}
 */
anytest.timer.inited = false;


/**
 * lat timer name.
 * @type {string|number}
 */
anytest.timer.lastT = '';


/**
 * Starts new timer.
 * @param {string|number} name
 * @param {boolean=} opt_endLastTimer [false] name.
 * @ignore
 */
anytest.timer.set = function(name, opt_endLastTimer) {
    anytest.timer.inited = true;
    if (!anytest.timer.allDeltas['JSstartedFrom']) {
        var t = anytest.timer.now();
        if (t.toFixed(0).toString().length > 5) t = 1;
        anytest.timer.allDeltas['JSstartedFrom'] = t;
    }
    if (opt_endLastTimer) anytest.timer.end(anytest.timer.lastT);
    if (!name) name = anytest.timer.names.length;
    anytest.timer.names.push(name);
    anytest.timer.startTime[name] = anytest.timer.now();
    anytest.timer.lastT = name;
};


/**
 * Ends timer by name
 * @param {string|number} name
 * @param {boolean=} opt_isReturn
 * @return {?number}
 */
anytest.timer.end = function (name, opt_isReturn) {
    if (name && anytest.timer.startTime[name]) {
        anytest.timer.allDeltas[name] = (anytest.timer.now() - anytest.timer.startTime[name]).toFixed(2);
        var index = goog.array.indexOf(anytest.timer.names, name);
        anytest.timer.names.splice(index, 1);
        delete anytest.timer.startTime[name];
        if (opt_isReturn) {
            var vf = anytest.timer.allDeltas[name];
            delete anytest.timer.allDeltas[name];
            return vf;
        }
    }
    return null;
};


/**
 * Ends all timers.
 */
anytest.timer.endAll = function () {
    anytest.timer.names = anytest.timer.names.sort();
    while (anytest.timer.names.length) {
        anytest.timer.end(anytest.timer.names[0]);
    }
};


/**
 * Returns current time
 * @return {number}
 */
anytest.timer.now = function () {
    if (window['performance'] && window['performance']['now'])
        return window['performance']['now']();
    else return Date.now();
};

goog.exportSymbol('anytest.time', anytest.timer.set);
goog.exportSymbol('anytest.timeEnd', anytest.timer.end);
goog.exportSymbol('anytest.now', anytest.timer.now);
