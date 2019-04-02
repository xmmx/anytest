goog.provide('anytest');
goog.require('anytest.asserts');
goog.require('anytest.styles');
goog.require('anytest.timer');
goog.require('anytest.CAT');
goog.require('anytest.modes');
goog.require('anytest.panel');
goog.require('anytest.settings_');
goog.require('anytest.utils');
goog.require('goog.array');
goog.require('goog.vec.Float64Array');

/**
 * Core space for all anytest components.
 * @namespace
 * @name anytest
 */

if (!!window['Float64Array']) {
  window['Float64Array'] = goog.vec.Float64Array;
  goog.vec.Float64Array.prototype['subarray'] = Array.prototype['slice'];
}


/**
 * Define is the debug mode on.
 * @type {boolean}
 */
anytest.DEBUG_MODE = false;


/**
 * @define {string} Replaced on compile time.
 */
anytest.VERSION = '';

anytest.ACDVF = false;

/**
 * Stage on window.
 * @ignore
 */
anytest.stage = {};


/**
 * Вызывается, если не нужен setUp().
 */
anytest.init = function () {
  anytest.DEBUG_MODE = !!anytest.utils.getParameterByName('debug');

  // создаем текстареа вместо консоли.
  anytest.utils.statusDiv = document.createElement('textarea');
  anytest.utils.statusDiv.id = 'status';
  document.body.appendChild(anytest.utils.statusDiv);

  // anytest.modes.prepare();

  if (window['anychart']['DEVELOP']) anytest.CAT.isDevelop();

  anytest.styles.include(undefined);

  window['anychart']['licenseKey']('anychart-CAT-64a5f14c-5d66a546');

  if (anytest.timer.inited && anytest.autoTimer) {
    anytest.timer.end(anytest.timer.enm.BODY_ON_DOCUMENT_READY); // страница загрузилась
    anytest.timer.set(anytest.timer.enm.TOTAL); // начал работу тест
  }

  if (anytest.modes.hasMode(anytest.modes.Enum.HIDDEN_CONTAINER_1)) document.getElementById('container').style.display = 'none';
  if (anytest.modes.hasMode(anytest.modes.Enum.HIDDEN_CONTAINER_1) || anytest.modes.hasMode(anytest.modes.Enum.HIDDEN_CONTAINER_2)) {
    anytest.step(function(){
      document.getElementById('container').style.display = 'block';
    },true,200);
    anytest.step(function(){
      // wait for fucking
    },true,200);
  }
  anytest.timer.set(anytest.timer.enm.TOTAL);
};


/**
 * Выполняет подготовительные работы. Создает stage и замораживает его.
 * @param {number|string=} opt_width
 * @param {number|string=} opt_height
 * @param {string=} opt_sizeTarget Enum: both, container, stage.
 * @return {*}
 */
anytest.setUp = function (opt_width, opt_height, opt_sizeTarget) {
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

  anytest.createStage();
  window['stage'] = anytest.stage;

  return window['anytest'];
};

/**
 * Create and return stage (for compiler)
 */
anytest.createStage = function () {
  var _types = anytest.resizeTypes;
  if (anytest.settings_.sizeTarget == _types.BOTH || anytest.settings_.sizeTarget == _types.STAGE)
    anytest.stage = window['acgraph']['create'](null, anytest.settings_.width, anytest.settings_.height);
  else
    anytest.stage = window['acgraph']['create']();
  if (anytest.settings_.sizeTarget != _types.STAGE) {
    document.getElementById('container').style.width = anytest.settings_.width;
    document.getElementById('container').style.height = anytest.settings_.height;
  }
  anytest.stage['suspend']();
  anytest.stage.container('container');
};


/**
 * @type {boolean}
 * @ignore
 */
anytest.exitState = false;


/**
 * Метод завершения теста.
 */
anytest.exit = function () {
  anytest.step(function () {
    anytest.exitState = true;
    anytest.tearDown();
  }, false);
};


/**
 * Создает <div> с сообщением, которое мы ожидаем/неожидаем.
 * @param {string} txt Текст ожидаемого сообщения.
 * @param {boolean=} opt_isIgnored По дефолту не игнорить сообщения.
 */
anytest.setCheckMsg = function (txt, opt_isIgnored) {
    var _div = anytest.utils.createDiv();
    if (opt_isIgnored) _div.className = 'ignoreConsoleMsg';
    else _div.className = 'consoleMsg';
    _div.innerHTML = txt;
    anytest.CAT.needCheckConsoleMsg = true;
};


/**
 * @type {Element|null}
 * @ignore
 */
anytest.utils.descriptionDiv = null;


/**
 * Добавляет описание теста.
 * @param {string} txt
 * @return {*}
 */
anytest.description = function (txt) {
  if (!anytest.utils.descriptionDiv)
    anytest.utils.descriptionDiv = anytest.utils.createDiv('description');
  anytest.utils.descriptionDiv.innerHTML += txt;
  return window['anytest'];
};


/**
 * Процедура очистки и завершения теста.
 * @ignore
 */
anytest.tearDown = function () {
  // если кто-то откладывал конец, то выходим.
  //if (anytest.exitState && anytest.delayTarget_.length == 0) {
  if (anytest.CAT.needCheckConsoleMsg) anytest.CAT.checkMsg();

  if (anytest.timer.inited) {
    anytest.timer.readAll();
  }
  anytest.CAT.exit();
  //}
};


/**
 * Вешает листенер на чарт.
 * @param {Object=} opt_chart chart instance.
 * @param {?Function=} opt_callbackFunction По дефолту - выход из деста.
 * @param {boolean=} opt_isListenOnce
 * @return {*}
 */
anytest.chartListen = function (opt_chart, opt_callbackFunction, opt_isListenOnce) {
  anytest.chart = window['chart'];
  opt_chart = opt_chart || anytest.chart;
  if (!opt_chart || !opt_chart['listen']) return null;
  if (opt_isListenOnce === undefined) opt_isListenOnce = true;
  opt_callbackFunction = opt_callbackFunction || anytest.defaultCallbackFunction;
  var key = opt_chart['listen']('chartdraw', function (e) {
    if (opt_isListenOnce) opt_chart['unlistenByKey'](key);
    anytest.listenerFuncMain_(opt_callbackFunction, e);
  });
};


/**
 * @ignore
 */
anytest.defaultCallbackFunction = function () {
  anytest.step(function () {
    anytest.CAT.getScreen();
  }, true);
  anytest.exit();
};


/**
 * Вешает листенер на весь стейдж.
 * @param {?Function=} opt_callbackFunction По дефолту - выход из деста.
 * @param {boolean=} opt_isListenOnce
 * @return {*}
 */
anytest.stageListen = function (opt_callbackFunction, opt_isListenOnce) {
  opt_callbackFunction = opt_callbackFunction || anytest.defaultCallbackFunction;
  if (opt_isListenOnce === undefined) opt_isListenOnce = true;
  var key = window['acgraph']['events']['listen'](anytest.stage, 'stagerendered', function (e) {
    anytest.timer.end(anytest.timer.enm.TOTAL);
    if (opt_isListenOnce) window['acgraph']['events']['unlistenByKey'](key);
    anytest.listenerFuncMain_(opt_callbackFunction, e);
    for (var i = 0; i < anytest.onStageDrawed_.length; i++)
      delete anytest.utils.loadManager[anytest.utils.getKeyByValue(window, anytest.onStageDrawed_[i])];
  });
  return window['anytest'];
};


/**
 * @param {Function|null|undefined} callbackFunction
 * @param {Event} e
 * @private
 * @ignore
 */
anytest.listenerFuncMain_ = function (callbackFunction, e) {
  // вырубаем кредитс, по нашему ключу.
  if (window['anychart']['licenseKey']() == 'anychart-CAT-64a5f14c-5d66a546')
    anytest.styles.include('.anychart-credits{display:none}');

  callbackFunction.apply(callbackFunction, [e]);
  anytest.modes.checkModes();
  window.setTimeout(function () {
    if (anytest.DEBUG_MODE) anytest.panel.create('debug');
    if (!anytest.DEBUG_MODE && !anytest.utils.getParameterByName('se')) {
      anytest.stepRunner();
    }
  }, 500);
};

anytest.stopRunner = false;
anytest.failStepsCount = 0;
anytest.stepsTimeout = null;
anytest.stepRunner = function () {
  if (anytest.stopRunner) return;
  //console.log(anytest.steps_[anytest.steps_.length-1]);
  if (!anytest.utils.isEmptyObj(anytest.utils.loadManager)) {
    if (!anytest.utils.getParameterByName('se') && !anytest.utils.getParameterByName('ph'))
      log('loadManager', anytest.utils.loadManager, anytest.stepsTimeout);
    anytest.stepsTimeout = window.setInterval(anytest.stepRunner, 1000);
    anytest.failStepsCount++;
    if (anytest.failStepsCount > 10) {
      log('failsteps');
      log('CAT: exit');
      anytest.stopRunner = true;
      window.clearInterval(anytest.stepsTimeout);
    }
    //console.log('setuped', anytest.stepsTimeout);
    return null;
  } else {
    //console.log('cleared',anytest.stepsTimeout)
    window.clearInterval(anytest.stepsTimeout);
    anytest.failStepsCount = 0;
    var res = anytest.stepExec();
    if (!anytest.utils.getParameterByName('se') && !anytest.utils.getParameterByName('ph') && res)
      if (window['console'] && window['console']['log'] && typeof window['console']['log'] != 'object')
        console.log(anytest.currentStep_, res);
    if (res != 'exit') {
      var timout = 0;
      if (anytest.currentStep_ < anytest.steps_.length && anytest.steps_[anytest.currentStep_])
        timout = anytest.steps_[anytest.currentStep_]['timeout'];
      setTimeout(anytest.stepRunner, timout);
    }
    else anytest.stopRunner = true;
  }
};


/**
 * @type {Array}
 * @private
 */
anytest.excludeCreditsForChart_ = ['circular', 'bullet', 'sparkline'];


anytest.onStageDrawed_ = [];

/**
 * Рисует чарт или элемент в слой стейджа.
 * @param {Object=} opt_chart chart or Element.
 * @param {boolean=} opt_isDisposed disposed.
 * @return {*}
 */
anytest.drawInStage = function (opt_chart, opt_isDisposed) {
  opt_chart = opt_chart || anytest.chart;
  if (!opt_chart) return; // проверка на дурака!
  if (!opt_isDisposed) {
    anytest.onStageDrawed_.push(opt_chart);
    anytest.utils.loadManager[anytest.utils.getKeyByValue(window, opt_chart)] = true;
  }

  if (!opt_chart['container']) return null;
  opt_chart['container'](anytest.stage)['draw']();
  // _chart.container(stage.layer()).draw();
  return window['anytest'];
};


/**
 * Накапливает сообщения
 * @type {Array}
 * @private
 */
anytest.log_ = [];


/**
 * Выводит накопленные сообщения одним при выходе
 * @param {...*} var_args
 * return {?Array}
 */
anytest.log = function(var_args){
  if (var_args == undefined) return anytest.log_;
  for (var a = 0; a < arguments.length; a++)
    anytest.log_.push(arguments[a]);
}


/**
 * Внутренняя хня для быстрого дебага.
 * @ignore
 * @type {Function}
 */
var log = anytest.utils.log;
window['log'] = anytest.utils.log;


/**
 * steps
 * @type {Array}
 */
anytest.steps_ = [];


/**
 * cycle steps
 * @type {Array}
 */
anytest.cyclesteps_ = [];


/**
 * @param {Function} stepFunc .
 * @param {boolean=} opt_isCycle .
 * @param {number=} opt_timeOut .
 */
anytest.step = function (stepFunc, opt_isCycle, opt_timeOut) {
  var step  = {
    'func': stepFunc,
    'timeout': opt_timeOut || 0,
    'body': stepFunc.toString()
  };
  anytest.steps_.push(step);

  if (anytest.DEBUG_MODE)
    anytest.panel.debug.logAllSteps.push(anytest.panel.debug.stepToLog(step));

  if (opt_isCycle)
    anytest.cyclesteps_.push(step);
};


/**
 * anytest.step() simplification. Allows to avoid multiple anytest.step() records.
 * NOTE: Doesn't have another anytest.step() parameters like isCycle or opt_timeOut.
 * @param {...Function} var_args - Step functions.
 */
anytest.stepsQueue = function(var_args) {
  for (var i = 0; i < arguments.length; i++) {
    var fn = arguments[i];
    if (fn)
      anytest.step(fn);
  }
};

/**
 *
 */
anytest.stepExec = function () {
  anytest.utils.statusDiv.value = "";
  if (anytest.steps_.length > anytest.currentStep_) {
    if (anytest.steps_[anytest.currentStep_] && anytest.steps_[anytest.currentStep_]['func']) {
      anytest.steps_[anytest.currentStep_]['func']();

      if (anytest.DEBUG_MODE) {
        //console.log(anytest.steps_[anytest.currentStep_]['body'])
        var func = anytest.panel.debug.stepToLog(anytest.steps_[anytest.currentStep_]);

        anytest.panel.debug.logSteps.push(func);
        if (func == anytest.panel.debug.logAllSteps[0]) anytest.panel.debug.logAllSteps.shift();

        document.getElementById('logStepListDebugger').innerHTML = '<pre class="brush: js">' + anytest.panel.debug.logSteps.join(anytest.panel.debug.logListStepSeparator) + '</pre>';
        document.getElementById('logStepListDebugger').scrollTop = document.getElementById('logStepListDebugger').scrollHeight;
        document.getElementById('nextStepListDebugger').innerHTML = '<pre class="brush: js">' + anytest.panel.debug.logAllSteps.join(anytest.panel.debug.logListStepSeparator) + '</pre>';
        window.setTimeout(function () {
          window['SyntaxHighlighter']['highlight']()
          var elem = document.getElementById('logStepListDebugger');
          elem.scrollTop = elem.scrollHeight;
        }, 0);
        document.getElementById('debuggerAllSteps').innerHTML = anytest.panel.debug.logAllSteps.length + anytest.panel.debug.logSteps.length;
      }
    }
    anytest.currentStep_++;
  } else log('exit');
  return anytest.utils.statusDiv.value;
};
/**
 *
 * @type {Array}
 */
anytest.screenPrefix_ = [];
anytest.currentStep_ = 0;

/**
 * @param {string} screenPrefix
 * @param {boolean=} opt_flag
 */
anytest.stepAppendCycle = function (screenPrefix, opt_flag) {

  if (opt_flag){
    // вставляем в очерень в текущую позицию циклы
    Array.prototype.splice.apply(anytest.steps_, [anytest.currentStep_+1, 0].concat(anytest.cyclesteps_));
    for (var i = anytest.currentStep_; i <= (anytest.currentStep_+anytest.cyclesteps_.length); i++)
      anytest.screenPrefix_[i] = screenPrefix
  }else{
    anytest.steps_ = anytest.steps_.concat(anytest.cyclesteps_)
    for (var i = anytest.screenPrefix_.length; i < anytest.steps_.length; i++)
      anytest.screenPrefix_[i] = screenPrefix
  }

  if (anytest.DEBUG_MODE){
    anytest.panel.debug.logSteps.push('//- change prefix: "'+screenPrefix+'"');
    for(var i=anytest.cyclesteps_.length-1;i>=0;i--) {
      anytest.panel.debug.logAllSteps.splice(1,0,anytest.panel.debug.stepToLog(anytest.cyclesteps_[i]));
    }
  }

  //for(f in anytest.steps_)  console.log(anytest.steps_[f])
}


/**
 * Resize enum.
 * @type {{CHART: string, BOTH: string, STAGE: string, CONTAINER_ONLY: string, CONTAINER_FULL_PERCENT: string}}
 */
anytest.resizeTypes = {
  /** только чарт, без контейнера. */
  CHART: 'Chart',
  /** и контейнер и чарт/stage. */
  BOTH: 'Both',
  /** только stage, без контейнера. */
  STAGE: 'Stage',
  /** только контейнер, без чарта/stage. */
  CONTAINER_ONLY: 'Container',
  /** только контейнер, чарт/stage 100%. */
  CONTAINER_FULL_PERCENT: 'ContainerFullPercent'
};

anytest.externalStepsCallee = function(){
  var r="";
  while(r != 'exit'){
    r = anytest.stepExec();
  };
};


/**
 * All charts for modes.
 * @type {Array}
 */
anytest.charts = [];


/**
 * Charts for modes.
 * @param {Array} var_args
 */
anytest.charts4modes = function (var_args) {
  if (arguments.length == 0) anytest.charts.push('chart');
  else
    for (var a = 0; a < arguments.length; a++)
      anytest.charts.push(arguments[a]);
};

goog.exportSymbol('anytest.log', anytest.log);
goog.exportSymbol('anytest.init', anytest.init);
goog.exportSymbol('anytest.setUp', anytest.setUp);
goog.exportSymbol('anytest.drawInStage', anytest.drawInStage);
goog.exportSymbol('anytest.stage', anytest.stage);
goog.exportSymbol('anytest.step', anytest.step);
goog.exportSymbol('anytest.stepsQueue', anytest.stepsQueue);
goog.exportSymbol('anytest.charts4modes', anytest.charts4modes);
goog.exportSymbol('anytest.stepExec', anytest.stepExec);
goog.exportSymbol('anytest.description', anytest.description);
goog.exportSymbol('anytest.setCheckMsg', anytest.setCheckMsg);
goog.exportSymbol('anytest.drawInStage', anytest.drawInStage);
goog.exportSymbol('anytest.stageListen', anytest.stageListen);
goog.exportSymbol('anytest.chartListen', anytest.chartListen);
goog.exportSymbol('anytest.exit', anytest.exit);
goog.exportSymbol('anytest.externalStepsCallee', anytest.externalStepsCallee);
goog.exportSymbol('anytest.loadManager', anytest.utils.loadManager);
goog.exportSymbol('anytest.VERSION', anytest.VERSION);
goog.exportSymbol('anytest.ACDVF', anytest.ACDVF);

