goog.provide('anytest.timer');


/**
 @namespace
 @ignore
 @name anytest.timer
 */


anytest.autoTimer = true;
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
anytest.timer.allDeltas = {'_JSstartedFrom': 0};


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
anytest.timer.set = function (name, opt_endLastTimer) {
  anytest.timer.inited = true;
  if (!anytest.timer.allDeltas['_JSstartedFrom']) {
    var t = anytest.timer.now();
    if (t.toFixed(0).toString().length > 5) t = 1;
    anytest.timer.allDeltas['_JSstartedFrom'] = t;
  }
  if (opt_endLastTimer) {
    anytest.timer.end(anytest.timer.lastT);
  }
  if (!name) {
    name = anytest.timer.names.length;
    //log(arguments.callee.caller.toString(),arguments.callee.caller);
  }
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
    delete anytest.timer.names[index];
    //anytest.timer.names.splice(index, 1);
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
  for (var i=0; i<=anytest.timer.names.length;i++) {
    anytest.timer.end(anytest.timer.names[i]);
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


anytest.timer.readCounter = 1;
anytest.timer.keys = [];
anytest.timer.read = function () {
  if (anytest.timer.keys.length < anytest.timer.readCounter){
    log(anytest.timer.readCounter + ' out of ' + anytest.timer.keys.length);
    return;
  }
  var propertyName = anytest.timer.keys[anytest.timer.readCounter - 1];
  anytest.CAT.timer(propertyName, anytest.timer.allDeltas[propertyName]);
  anytest.timer.readCounter++;

};



anytest.timer.readAll = function(){
  anytest.timer.endAll();
  anytest.timer.keys = Object.keys(anytest.timer.allDeltas || {});
  for (var p in anytest.timer.allDeltas) {
    if (anytest.timer.allDeltas.hasOwnProperty(p))
      anytest.step(function(){ anytest.timer.read();}, false);
  }
};


//anytest.time('onDocumentReady'); // засекаем когда началась грузится страница (без учета загрузки anytest
//anytest.time('scriptLoad'); // засекаем когда начался грузится скрипт anychart

anytest.timerEnum = {};

anytest.timer.enm = {
  BODY_ON_DOCUMENT_READY: '_documentReady',
  BODY_AC_SCRIPT_LOAD: '_loadMainBinary',
  BODY_EXTERNAL_SCRIPT_LOAD: '_loadScript',

  DATA_CREATE: 'data_create',
  DATA_MODIFY: 'data_modify',
  DATA_CRUD_CREATE: 'data_CRUD_add',
  DATA_CRUD_READ: 'data_CRUD_get',
  DATA_CRUD_UPDATE: 'data_CRUD_set',
  DATA_CRUD_DELETE: 'data_CRUD_remove',
  DATA_REPLACE: 'data_create',

  CHART_CREATE: 'chart_create',
  CHART_SET_DATA: 'chart_set_data',
  CHART_CONTAINER: 'chart_setContainer',
  CHART_DRAW: 'chart_draw',
  CHART_CHANGE_PROP: 'chart_change_prop',
  CHART_DISPOSE: 'chart_dispose',

  STANDALONE_CREATE: 'standalone_create',
  STANDALONE_SET_DATA: 'standalone_set_data',
  STANDALONE_CONTAINER: 'standalone_setContainer',
  STANDALONE_DRAW: 'standalone_draw',
  STANDALONE_CHANGE_PROP: 'standalone_change_prop',
  STANDALONE_DISPOSE: 'standalone_dispose',

  SERIES_CREATE: 'series_create',
  SERIES_CHANGE_PROP: 'series_change_prop',
  SERIES_DISPOSE: 'series_dispose',

  REQ_RENDER: 'render',
  REQ_RESIZE_PLUS: 'resize_plus',
  REQ_RESIZE_MINUS: 'resize_minus',
  REQ_INTERACTIVITY_HOVER: 'interactivity_hover',
  REQ_INTERACTIVITY_UNHOVER: 'interactivity_unhover',
  REQ_INTERACTIVITY_SELECT: 'interactivity_select',
  REQ_INTERACTIVITY_UNSELECT: 'interactivity_unselect',

  STAGE_RESUMED: 'stage_resume_oprations',

  TOTAL: 'test_total_time'
};


goog.exportSymbol('anytest.time', anytest.timer.set);
goog.exportSymbol('anytest.autoTimer', anytest.autoTimer);
goog.exportSymbol('anytest.timeEnd', anytest.timer.end);
goog.exportSymbol('anytest.now', anytest.timer.now);
goog.exportSymbol('anytest.readAll', anytest.timer.readAll);

goog.exportSymbol('anytest.endAll', anytest.timer.endAll);
goog.exportSymbol('anytest.deltas', anytest.timer.allDeltas);

goog.exportSymbol('anytest.timerEnum',anytest.timerEnum);
goog.exportSymbol('anytest.timerEnum.BODY_ON_DOCUMENT_READY', anytest.timer.enm.BODY_ON_DOCUMENT_READY);
goog.exportSymbol('anytest.timerEnum.BODY_AC_SCRIPT_LOAD', anytest.timer.enm.BODY_AC_SCRIPT_LOAD);
goog.exportSymbol('anytest.timerEnum.BODY_EXTERNAL_SCRIPT_LOAD', anytest.timer.enm.BODY_EXTERNAL_SCRIPT_LOAD);

goog.exportSymbol('anytest.timerEnum.DATA_CREATE', anytest.timer.enm.DATA_CREATE);
goog.exportSymbol('anytest.timerEnum.DATA_MODIFY', anytest.timer.enm.DATA_MODIFY);
goog.exportSymbol('anytest.timerEnum.DATA_CRUD_CREATE', anytest.timer.enm.DATA_CRUD_CREATE);
goog.exportSymbol('anytest.timerEnum.DATA_CRUD_READ', anytest.timer.enm.DATA_CRUD_READ);
goog.exportSymbol('anytest.timerEnum.DATA_CRUD_UPDATE', anytest.timer.enm.DATA_CRUD_UPDATE);
goog.exportSymbol('anytest.timerEnum.DATA_CRUD_DELETE', anytest.timer.enm.DATA_CRUD_DELETE);
goog.exportSymbol('anytest.timerEnum.DATA_REPLACE', anytest.timer.enm.DATA_REPLACE);

goog.exportSymbol('anytest.timerEnum.CHART_CREATE', anytest.timer.enm.CHART_CREATE);
goog.exportSymbol('anytest.timerEnum.CHART_SET_DATA', anytest.timer.enm.CHART_SET_DATA);
goog.exportSymbol('anytest.timerEnum.CHART_CONTAINER', anytest.timer.enm.CHART_CONTAINER);
goog.exportSymbol('anytest.timerEnum.CHART_DRAW', anytest.timer.enm.CHART_DRAW);
goog.exportSymbol('anytest.timerEnum.CHART_CHANGE_PROP', anytest.timer.enm.CHART_CHANGE_PROP);
goog.exportSymbol('anytest.timerEnum.CHART_DISPOSE', anytest.timer.enm.CHART_DISPOSE);

goog.exportSymbol('anytest.timerEnum.SERIES_CREATE', anytest.timer.enm.SERIES_CREATE);
goog.exportSymbol('anytest.timerEnum.SERIES_CHANGE_PROP', anytest.timer.enm.SERIES_CHANGE_PROP);
goog.exportSymbol('anytest.timerEnum.SERIES_DISPOSE', anytest.timer.enm.SERIES_DISPOSE);


goog.exportSymbol('anytest.timerEnum.STANDALONE_CREATE', anytest.timer.enm.STANDALONE_CREATE);
goog.exportSymbol('anytest.timerEnum.STANDALONE_SET_DATA', anytest.timer.enm.STANDALONE_SET_DATA);
goog.exportSymbol('anytest.timerEnum.STANDALONE_CONTAINER', anytest.timer.enm.STANDALONE_CONTAINER);
goog.exportSymbol('anytest.timerEnum.STANDALONE_DRAW', anytest.timer.enm.STANDALONE_DRAW);
goog.exportSymbol('anytest.timerEnum.STANDALONE_CHANGE_PROP', anytest.timer.enm.STANDALONE_CHANGE_PROP);
goog.exportSymbol('anytest.timerEnum.STANDALONE_DISPOSE', anytest.timer.enm.STANDALONE_DISPOSE);


goog.exportSymbol('anytest.timerEnum.REQ_RENDER', anytest.timer.enm.REQ_RENDER);
goog.exportSymbol('anytest.timerEnum.REQ_RESIZE_PLUS', anytest.timer.enm.REQ_RESIZE_PLUS);
goog.exportSymbol('anytest.timerEnum.REQ_RESIZE_MINUS', anytest.timer.enm.REQ_RESIZE_MINUS);
goog.exportSymbol('anytest.timerEnum.REQ_INTERACTIVITY_HOVER', anytest.timer.enm.REQ_INTERACTIVITY_HOVER);
goog.exportSymbol('anytest.timerEnum.REQ_INTERACTIVITY_UNHOVER', anytest.timer.enm.REQ_INTERACTIVITY_UNHOVER);
goog.exportSymbol('anytest.timerEnum.REQ_INTERACTIVITY_SELECT', anytest.timer.enm.REQ_INTERACTIVITY_SELECT);
goog.exportSymbol('anytest.timerEnum.REQ_INTERACTIVITY_UNSELECT', anytest.timer.enm.REQ_INTERACTIVITY_UNSELECT);

goog.exportSymbol('anytest.timerEnum.STAGE_RESUMED', anytest.timer.enm.STAGE_RESUMED);

goog.exportSymbol('anytest.timerEnum.TOTAL', anytest.timer.enm.TOTAL);

