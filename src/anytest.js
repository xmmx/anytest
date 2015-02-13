goog.provide('anytest');
goog.require('anytest.CAT');
goog.require('anytest.enums');
goog.require('anytest.modes');
goog.require('anytest.panel');
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
anytest.chart = [];


/**
 * Вызывается, если не нужен setUp().
 */
anytest.init = function() {
  if (window['anychart']['DEVELOP'])
    anytest.CAT.isDevelop();

  anytest.utils.appendMyStyles(anytest.styles.rules);

  window['anychart']['licenseKey']('anychart-CAT-64a5f14c-5d66a546');
};


/**
 * Выполняет подготовительные работы. Создает stage и замораживает его.
 * @param {number|string=} opt_width
 * @param {number|string=} opt_height
 * @param {string=} opt_sizeTarget Enum: both, container, stage.
 * @return {*}
 */
anytest.setUp = function(opt_width, opt_height, opt_sizeTarget) {
  anytest.init();

  if (opt_width) {
    anytest.settings_.width = opt_width.toString();
    if (anytest.settings_.width.indexOf('%') == -1)
      anytest.settings_.width += 'px';
  }
  if (opt_height) {
    anytest.settings_.height = opt_height.toString();
    if (anytest.settings_.height.indexOf('%') == -1)
      anytest.settings_.height += 'px';
  }
  if (opt_sizeTarget) anytest.settings_.sizeTarget = opt_sizeTarget;
  var _types = anytest.enums.resizeTypes;

  if (anytest.settings_.sizeTarget == _types.BOTH || anytest.settings_.sizeTarget == _types.STAGE)
    anytest.stage = window['acgraph']['create']('container', anytest.settings_.width, anytest.settings_.height);
  else
    anytest.stage = window['acgraph']['create']('container');
  if (anytest.settings_.sizeTarget != _types.STAGE) {
    document.getElementById('container').style.width = anytest.settings_.width;
    document.getElementById('container').style.height = anytest.settings_.height;
  }
  anytest.stage['suspend']();
  window['stage'] = anytest.stage;

  if (anytest.settings_.modes.XMLschema || anytest.settings_.modes.JSONschema)
    anytest.setCheckMsg('Warning: 8 Description:', 1, true);

  return window['anytest'];
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
  anytest.tearDown();
};


/**
 * @type {boolean}
 * @ignore
 */
anytest.CAT.needCheckConsoleMsg = false;


/**
 * Создает <div> с сообщением, которое мы ожидаем/неожидаем.
 * @param {string} txt Текст ожидаемого сообщения.
 * @param {number=} opt_count Количество сообщений. По умолчанию 1.
 * @param {boolean=} opt_isIgnored По дефолту не игнорить сообщения.
 */
anytest.setCheckMsg = function(txt, opt_count, opt_isIgnored) {
  opt_count = opt_count || 1;
  var count = opt_count;
  if (window['chart'] && anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_JSON)) count += opt_count;
  if (window['chart'] && anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_XML)) count += opt_count;
  while (count) {
    var _div = anytest.utils.createDiv();
    if (opt_isIgnored) _div.className = 'ignoreConsoleMsg';
    else _div.className = 'consoleMsg';
    _div.innerHTML = txt;
    anytest.CAT.needCheckConsoleMsg = true;
    count--;
  }
};


/**
 * @type {null}
 * @ignore
 */
anytest.utils.descriptionDiv = null;


/**
 * Добавляет описание теста.
 * @param {string} txt
 * @return {*}
 */
anytest.description = function(txt) {
  if (!anytest.utils.descriptionDiv)
    anytest.utils.descriptionDiv = anytest.utils.createDiv('description');
  anytest.utils.descriptionDiv.innerHTML += txt;
  return window['anytest'];
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
 * @param {Object=} opt_chart chart instance.
 * @param {?Function=} opt_callbackFunction По дефолту - выход из деста.
 * @param {boolean=} opt_isListenOnce
 * @return {*}
 */
anytest.chartListen = function(opt_chart, opt_callbackFunction, opt_isListenOnce) {
  anytest.chart = window['chart'];
  opt_chart = opt_chart || anytest.chart;
  if (!opt_chart || !opt_chart['listen']) return null;
  if (opt_isListenOnce === undefined) opt_isListenOnce = true;
  opt_callbackFunction = opt_callbackFunction || anytest.defaultCallbackFunction;
  var key = opt_chart['listen'](window['anychart']['enums']['EventType']['CHART_DRAW'], function(e) {
    if (opt_isListenOnce) opt_chart['unlistenByKey'](key);
    anytest.listenerFuncMain_(opt_callbackFunction, e);
  });
  return window['anytest'];
};


/**
 * @ignore
 */
anytest.defaultCallbackFunction = function() {
  anytest.CAT.getScreen();
  anytest.exit();
};


/**
 * Вешает листенер на весь стейдж.
 * @param {?Function=} opt_callbackFunction По дефолту - выход из деста.
 * @param {boolean=} opt_isListenOnce
 * @return {*}
 */
anytest.stageListen = function(opt_callbackFunction, opt_isListenOnce) {
  opt_callbackFunction = opt_callbackFunction || anytest.defaultCallbackFunction;
  if (opt_isListenOnce === undefined) opt_isListenOnce = true;
  var key = window['acgraph']['events']['listen'](window['stage'], 'stagerendered', function(e) {
    if (opt_isListenOnce) window['acgraph']['events']['unlistenByKey'](key);
    anytest.listenerFuncMain_(opt_callbackFunction, e);
  });
  return window['anytest'];
};


/**
 * @param {Function|null|undefined} callbackFunction
 * @param {Event} e
 * @private
 * @ignore
 */
anytest.listenerFuncMain_ = function(callbackFunction, e) {
  anytest.needDelay('main');
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

  // вырубаем кредитс, по нашему ключу.
  if (opt_chart['credits'] && window['anychart']['licenseKey']() == 'anychart-CAT-64a5f14c-5d66a546')
    opt_chart['credits'](null);

  if (!opt_chart['container']) return null;
  opt_chart['container'](window['stage'])['draw']();
  // _chart.container(stage.layer()).draw();
  return window['anytest'];
};


/**
 * Список тех, кто отложил конец теста.
 * @type {Array}
 * @private
 */
anytest.delayTarget_ = [];


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
 * Внутренняя хня для быстрого дебага.
 * @ignore
 * @type {Function}
 */
var log = anytest.utils.log;
window['log'] = anytest.utils.log;

goog.exportSymbol('anytest.init', anytest.init);
goog.exportSymbol('anytest.setUp', anytest.setUp);
goog.exportSymbol('anytest.stage', anytest.stage);
goog.exportSymbol('anytest.description', anytest.description);
goog.exportSymbol('anytest.setCheckMsg', anytest.setCheckMsg);
goog.exportSymbol('anytest.drawInStage', anytest.drawInStage);
goog.exportSymbol('anytest.stageListen', anytest.stageListen);
goog.exportSymbol('anytest.chartListen', anytest.chartListen);
goog.exportSymbol('anytest.exit', anytest.exit);
