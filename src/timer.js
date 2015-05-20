goog.provide('anytest.timer');


/**
 @namespace
 @ignore
 @name anytest.timer
 */


/**
 * All started timers.
 * @type {Object}
 * @private
 */
anytest.timer.startTime_ = {};


/**
 * All timers delta.
 * @type {Object}
 * @ignore
 */
anytest.timer.allDeltas = {'startedFrom': 0};


/**
 * All names for counters.
 * @type {Array}
 * @ignore
 */
anytest.timer.names = [];


/**
 * lat timer name.
 * @type {string}
 */
anytest.timer.lastT = '';


/**
 * Starts new timer.
 * @param {string|number} name
 * @param {boolean=} opt_endLastTimer [false] name.
 * @return {string|number=} opt_endLastTimer
 * @ignore
 */
anytest.timer.set = function(name, opt_endLastTimer) {
    if (!anytest.timer.allDeltas['JSstartedFrom']) {
        var t = anytest.timer.now();
        if (t.toFixed(0).toString().length > 5) t = 1;
        anytest.timer.allDeltas['JSstartedFrom'] = t;
    }
    if (opt_endLastTimer) anytest.timer.end(anytest.timer.lastT);
    if (!name) name = anytest.timer.names.length;
    anytest.timer.names.push(name);
    anytest.timer.startTime_[name] = anytest.timer.now();
    anytest.timer.lastT = name;
};


/**
 * Ends timer by name
 * @param {string|number} name
 * @param {boolean=} opt_isReturn
 */
anytest.timer.end = function (name, opt_isReturn) {
    if (name && anytest.timer.startTime_[name]) {
        anytest.timer.allDeltas[name] = anytest.timer.now() - anytest.timer.startTime_[name];
        var index = goog.array.indexOf(anytest.timer.names, name);
        anytest.timer.names.splice(index, 1);
        delete anytest.timer.startTime_[name];
        if (opt_isReturn) {
            var vf = anytest.timer.allDeltas[name];
            delete anytest.timer.allDeltas[name];
            return vf;
        }
    }
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
