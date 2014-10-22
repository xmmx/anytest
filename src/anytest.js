goog.provide('anytest');
goog.require('anytest.CAT');
goog.require('anytest.enums');
goog.require('anytest.modes');
goog.require('anytest.panel');
goog.require('anytest.settings_');
goog.require('anytest.styles');
goog.require('anytest.utils');


/**
 * Stage.
 * @type {Object}
 * @private
 */
anytest.stage_ = null;


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
    anytest.stage_ = window['acgraph'].create('container', anytest.settings_.width, anytest.settings_.height);
  else
    anytest.stage_ = window['acgraph'].create('container');
  if (anytest.settings_.sizeTarget != _types.STAGE) {
    document.getElementById('container').style.width = anytest.settings_.width;
    document.getElementById('container').style.height = anytest.settings_.height;
  }
  anytest.stage_.suspend();
  window['stage'] = anytest.stage_;
  return anytest;
};


/**
 * @type {boolean}
 * @private
 */
anytest.exit_ = false;


/**
 * Core space for all anytest components.
 * @namespace
 * @name anytest
 */
anytest.exit = function() {
  anytest.exit_ = true;
};


/**
 * @type {boolean}
 * @private
 */
anytest.CAT.needCheckConsoleMsg_ = false;


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
  anytest.CAT.needCheckConsoleMsg_ = true;
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
 * @private
 */
test.utils.tearDown_ = function () {
  // если кто-то откладывал конец, то выходим.
  if (test.exit_ && test.utils.delayTarget_.length == 0) {
    if (this.CAT.needCheckConsoleMsg_)
      this.CAT.checkMsg_();
    this.CAT.exit_();
  }
};

/**
 * Вешает листенер на чарт.
 * @param _chart {object} chart instance.
 * @param callbackFunction {function=} По дефолту - выход из деста.
 * @param isListenOnce {boolean=}
 * @returns {test.utils}
 */
test.utils.chartListen = function (_chart, callbackFunction, isListenOnce) {
  _chart = _chart || chart;
  callbackFunction = callbackFunction || test.exit;
  var key = _chart.listen(anychart.enums.EventType.CHART_DRAW, function (e) {
    if (isListenOnce) _chart.unlistenByKey(key);
    test.utils.listenerFuncMain_(callbackFunction, e);
  });
  return this;
};

/**
 * Вешает листенер на весь стейдж.
 * @param callbackFunction {function=} По дефолту - выход из деста.
 * @param isListenOnce {boolean=}
 * @returns {test.utils}
 */
test.utils.stageListen = function (callbackFunction, isListenOnce) {
  callbackFunction = callbackFunction || test.exit;
  var key = acgraph.events.listen(stage, acgraph.events.EventType.RENDER_FINISH, function (e) {
    if (isListenOnce) acgraph.events.unlistenByKey(key);
    test.utils.listenerFuncMain_(callbackFunction, e);
  });
  return this;
};

test.utils.listenerFuncMain_ = function (callbackFunction, e) {
  if (anychart.DEVELOP) test.utils.CAT.isDevelop_();
  callbackFunction.apply(this, [e]);
  test.utils.modes.checkModes_();
  test.utils.turnOffDelay_('main');
};

/**
 * Рисует чарт в слой стейджа.
 * @param _chart {Object=} chart or Element.
 * @returns {test.utils}
 */
test.utils.drawInStage = function (_chart) {
  _chart = _chart || chart;
  _chart.container(stage).draw();
//  _chart.container(stage.layer()).draw();
  return this;
};

/**
 * Список тех, кто отложил конец теста.
 * @type {Array}
 * @private
 */
test.utils.delayTarget_ = ['main'];
/**
 * Откладывает завершение теста.
 * @param target {string}
 * @private
 */
test.utils.needDelay_ = function (target) {
  this.delayTarget_.push(target);
};
/**
 * Снимает отложенность завершения теста.
 * @param target {string}
 * @private
 */
test.utils.turnOffDelay_ = function (target) {
  this.delayTarget_.splice(this.delayTarget_.indexOf(target), 1);
  this.tearDown_();
};


/**
 * alias.
 * @type {Function}
 */
anytest.log = anytest.utils.log;

goog.exportSymbol('anytest.log', anytest.log);
goog.exportSymbol('anytest.setUp', anytest.setUp);
goog.exportSymbol('anytest.description', anytest.description);
goog.exportSymbol('anytest.setCheckMsg', anytest.setCheckMsg);
