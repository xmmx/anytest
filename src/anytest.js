goog.provide('anytest');
goog.require('anytest.CAT');
goog.require('anytest.enums');
goog.require('anytest.modes');
goog.require('anytest.panel.interactive');
goog.require('anytest.panel.resize');
goog.require('anytest.settings_');
goog.require('anytest.styles');
goog.require('anytest.utils');
goog.require('goog.array');

/**
 * Core space for all anytest components.
 * @namespace
 * @name anytest
 */


/**
 * Stage on window.
 * @ignore
 */
anytest.stage = {};


/**
 * Chart instance.
 * @ignore
 */
anytest.chart = {};


/**
 * Выполняет подготовительные работы.
 * @param {number|string=} opt_width
 * @param {number|string=} opt_height
 * @param {string=} opt_sizeTarget Enum: both, container, stage.
 * @return {*}
 */
anytest.setUp = function(opt_width, opt_height, opt_sizeTarget) {
  anytest.utils.appendMyStyles(anytest.styles.rules);

  if (opt_width) anytest.settings_.width = opt_width;
  if (opt_height) anytest.settings_.height = opt_height;
  if (opt_sizeTarget) anytest.settings_.sizeTarget = opt_sizeTarget;
  var _types = anytest.enums.resizeTypes;

  if (anytest.settings_.sizeTarget == _types.BOTH || anytest.settings_.sizeTarget == _types.STAGE)
    anytest.stage = window['acgraph'].create('container', anytest.settings_.width, anytest.settings_.height);
  else
    anytest.stage = window['acgraph'].create('container');
  if (anytest.settings_.sizeTarget != _types.STAGE) {
    document.getElementById('container').style.width = anytest.settings_.width;
    document.getElementById('container').style.height = anytest.settings_.height;
  }
  anytest.stage['suspend']();
  window['stage'] = anytest.stage;
  return anytest;
};


/**
 * @type {boolean}
 * @ignore
 */
anytest.exitState = false;


/**
 * Метод завершения теста.
 */
anytest.exit = function() {
  anytest.exitState = true;
};


/**
 * @type {boolean}
 * @ignore
 */
anytest.CAT.needCheckConsoleMsg = false;


/**
 * Создает <div> с сообщением, которое мы ожидаем/неожидаем.
 * @param {string} txt Текст ожидаемого сообщения.
 * @param {boolean=} opt_isIgnored По дефолту не игнорить сообщения.
 */
anytest.setCheckMsg = function(txt, opt_isIgnored) {
  var _div = anytest.utils.createDiv();
  _div.className = 'consoleMsg';
  if (opt_isIgnored) _div.className = 'ignoreConsoleMsg';
  _div.innerHTML = txt;
  anytest.CAT.needCheckConsoleMsg = true;
};


/**
 * Добавляет описание теста.
 * @param {string} txt
 * @return {*}
 */
anytest.description = function(txt) {
  anytest.utils.createDiv('description').innerHTML = txt;
  return anytest;
};


/**
 * Процедура очистки и завершения теста.
 * @ignore
 */
anytest.tearDown = function() {
  // если кто-то откладывал конец, то выходим.
  if (anytest.exitState && anytest.delayTarget_.length == 0) {
    if (anytest.CAT.needCheckConsoleMsg)
      anytest.CAT.checkMsg();
    anytest.CAT.exit();
  }
};


/**
 * Вешает листенер на чарт.
 * @param {Object} chart chart instance.
 * @param {?Function=} opt_callbackFunction По дефолту - выход из деста.
 * @param {boolean=} opt_isListenOnce
 * @return {*}
 */
anytest.chartListen = function(chart, opt_callbackFunction, opt_isListenOnce) {
  anytest.chart = window['chart'];
  chart = chart || anytest.chart;
  opt_callbackFunction = opt_callbackFunction || anytest.exit;
  var key = chart['listen'](window['anychart']['enums']['EventType']['CHART_DRAW'], function(e) {
    if (opt_isListenOnce) chart['unlistenByKey'](key);
    anytest.listenerFuncMain_(opt_callbackFunction, e);
  });
  return anytest;
};


/**
 * Вешает листенер на весь стейдж.
 * @param {?Function=} opt_callbackFunction По дефолту - выход из деста.
 * @param {boolean=} opt_isListenOnce
 * @return {*}
 */
anytest.stageListen = function(opt_callbackFunction, opt_isListenOnce) {
  opt_callbackFunction = opt_callbackFunction || anytest.exit;
  var key = window['acgraph']['events']['listen'](anytest.stage, window['acgraph']['events']['EventType']['RENDER_FINISH'], function(e) {
    if (opt_isListenOnce) window['acgraph']['events']['unlistenByKey'](key);
    anytest.listenerFuncMain_(opt_callbackFunction, e);
  });
  return anytest;
};


/**
 * @param {Function|null|undefined} callbackFunction
 * @param {Event} e
 * @private
 * @ignore
 */
anytest.listenerFuncMain_ = function(callbackFunction, e) {
  if (window['anychart'].DEVELOP) anytest.CAT.isDevelop();
  callbackFunction.apply(callbackFunction, [e]);
  anytest.modes.checkModes();
  anytest.turnOffDelay('main');
};


/**
 * Рисует чарт или элемент в слой стейджа.
 * @param {Object=} opt_chart chart or Element.
 * @return {*}
 */
anytest.drawInStage = function(opt_chart) {
  opt_chart = opt_chart || anytest.chart;
  opt_chart['container'](anytest.stage)['draw']();
  // _chart.container(stage.layer()).draw();
  return anytest;
};


/**
 * Список тех, кто отложил конец теста.
 * @type {Array}
 * @private
 */
anytest.delayTarget_ = ['main'];


/**
 * Откладывает завершение теста.
 * @param {string} target
 * @ignore
 */
anytest.needDelay = function(target) {
  anytest.delayTarget_.push(target);
};


/**
 * Снимает отложенность завершения теста.
 * @param {string} target
 * @ignore
 */
anytest.turnOffDelay = function(target) {
  var index = goog.array.indexOf(anytest.delayTarget_, target);
  anytest.delayTarget_.splice(index, 1);
  anytest.tearDown();
};


/**
 * alias.
 * @type {Function}
 */
anytest.log = anytest.utils.log;

goog.exportSymbol('anytest.log', anytest.log);
goog.exportSymbol('anytest.setUp', anytest.setUp);
goog.exportSymbol('anytest.stage', anytest.stage);
goog.exportSymbol('anytest.description', anytest.description);
goog.exportSymbol('anytest.setCheckMsg', anytest.setCheckMsg);

goog.exportSymbol('anytest.getScreenShot', anytest.setCheckMsg);
