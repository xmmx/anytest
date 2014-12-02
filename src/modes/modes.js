goog.provide('anytest.modes');
goog.require('goog.dom');


/**
 @namespace
 @ignore
 @name anytest.modes
 */


/**
 * Включает/выключает режимы тестирования.<br/>
 * anytest.modes('!all') - выключает все.<br/>
 * anytest.modes('schemas') - включает экспорт.<br/>
 * anytest.modes('all', '!resize') - включает все режимы, кроме ресайза.<br/>
 * и тд<br/>
 * <b>!!! Использовать до setUp() !!!</b>
 * @param {...string} var_args Аргументов может быть много.
 * @return {*}
 */
anytest.modes.set = function(var_args) {
  for (var i=0; i<arguments.length; i++) {
    var mod = arguments[i];
    var flag = true;
    if ('!' == mod.substr(0, 1)) {
      flag = false;
      mod = mod.substr(1);
    }
    if (mod == 'all') {
      anytest.settings_.modes.all(flag);
    } else {
      anytest.settings_.modes[mod] = flag;
    }
  }

  return window['anytest'];
};


/**
 * @type {boolean}
 * @private
 * @ignore
 */
anytest.modes.checkFlag_ = true;


/**
 * Автоматически запускает режимы тестирования заданные в настройках.
 * @return {null}
 * @ignore
 */
anytest.modes.checkModes = function() {
  if (!anytest.modes.checkFlag_) return null;
  var _modes = anytest.settings_.modes;
  if (_modes.hiddenContainer) {
    if (!anytest.chart) {
      alert('Ошибка: Нет инстанса чарта!');
      return null;
    }
    anytest.needDelay('hiddenContainer');
    anytest.modes.hiddenContainer_();
  }
  if (_modes.resize) {
    anytest.needDelay('resize');
    anytest.modes.resize();
  }
  // самый "тяжелый" тест в конце.
  // ПОКА ПЕРМАНЕНТНО ОТКЛЮЧЕН!!!!!!!!!!!
  if (_modes.schemas && false) {
    if (!anytest.chart) {
      alert('Ошибка: Нет инстанса чарта!');
      return null;
    }
    anytest.needDelay('exportXML');
    anytest.needDelay('exportJSON');
    anytest.modes.exportXMLJSON_();
  }
  anytest.modes.checkFlag_ = false;
  return null;
};


/**
 * Включает режим тестирования на Ресайз
 * @ignore
 */
anytest.modes.resize = function() {
  var _type = anytest.enums.resizeTypes;

  anytest.panel.resize.resizeTarget(anytest.chart, 1, _type.BOTH, 50, true);
  anytest.panel.resize.resizeTarget(anytest.chart, -1, _type.BOTH, 50, true);
  anytest.CAT.getScreen('after' + _type.BOTH + 'Resize', 1);

  if (anytest.chart) {
    anytest.panel.resize.resizeTarget(anytest.chart, 1, _type.CHART, 50, true);
    anytest.panel.resize.resizeTarget(anytest.chart, -1, _type.CHART, 50, true);
    anytest.CAT.getScreen('after' + _type.CHART + 'Resize', 1);
  }
//debugger;
  anytest.panel.resize.resizeTarget(anytest.chart, 1, _type.CONTAINER_FULL_PERCENT, 50, true);
  anytest.panel.resize.resizeTarget(anytest.chart, -1, _type.CONTAINER_FULL_PERCENT, 50, true);
  anytest.CAT.getScreen('after' + _type.CONTAINER_FULL_PERCENT + 'Resize', 1);

  anytest.panel.resize.resizeTarget(anytest.chart, 1, _type.CONTAINER_ONLY, 50, true);
  anytest.panel.resize.resizeTarget(anytest.chart, -1, _type.CONTAINER_ONLY, 50, true);
  anytest.CAT.getScreen('after' + _type.CONTAINER_ONLY + 'Resize', 1);

  anytest.turnOffDelay('resize');
};


/**
 * Включает режим тестирования на экспорт.
 * @private
 * @return {null}
 * @ignore
 */
anytest.modes.exportXMLJSON_ = function() {
  if (window['anychart'].DEVELOP) {
    // alert('На DEVELOP версии проверять жопа!');
    return null;
  }

  var _messageXML = 'XML schema is valid';
  var _messageJSON = 'JSON schema is valid';
  anytest.setCheckMsg(_messageXML);
  anytest.setCheckMsg(_messageJSON);

  var configXML = anytest.chart['toXml']();
  var configJSON = anytest.chart['toJson']();

  if (configJSON) {
    window['acgraph']['validate'](configJSON, function(data) {
      if (data == 'success') {
        anytest.log(_messageJSON);
      }
      var _saveChart = anytest.chart;
      try {
        anytest.chart['container']()['parent'](null);
        anytest.chart = null;
        anytest.chart = window['anychart']['fromJson'](configJSON);
        anytest.chart['container'](window['stage'])['draw']();
        anytest.chartListen(anytest.chart, function(e) {
          anytest.CAT.getScreen('restoreFromXML', 1);
          anytest.turnOffDelay('exportJSON');
          _step2();
        });
      } catch (e) {
        anytest.chart = _saveChart;
        anytest.chart['draw']();
        //log(e.message, e.stack);
        anytest.turnOffDelay('exportJSON');
        _step2();
      }
    });
  }
  // для того, чтоб тестировалось последовательно.
  var _step2 = function() {
    if (configXML) {
      var _saveChart = anytest.chart;
      try {
        anytest.chart['container']()['parent'](null);
        anytest.chart = null;
        anytest.chart = window['anychart']['fromXml'](configXML);
        anytest.chart['container'](window['stage'])['draw']();
        anytest.chartListen(anytest.chart, function(e) {
          anytest.CAT.getScreen('restoreFromXML', 1);
          anytest.turnOffDelay('exportXML');
        });
      } catch (e) {
        anytest.chart = _saveChart;
        anytest.chart['draw']();
        // log(e.message, e.stack);
        anytest.turnOffDelay('exportXML');
      }
    }
  };
  return null;
};


/**
 * Включает режим тестирования на скрытый контейнер.
 * @private
 * @ignore
 */
anytest.modes.hiddenContainer_ = function() {
  document.getElementById('container').style.display = 'none';
  document.getElementById('container').style.display = 'block';
  anytest.CAT.getScreen('hiddenContainer', 1);

  anytest.turnOffDelay('hiddenContainer');
};

/**
 * Включает/выключает режимы тестирования.<br/>
 * anytest.modes('!all') - выключает все.<br/>
 * anytest.modes('schemas') - включает экспорт.<br/>
 * anytest.modes('all', '!resize') - включает все режимы, кроме ресайза.<br/>
 * и тд<br/>
 * <b>!!! Использовать до setUp() !!!</b>
 * @type {Function}
 */
anytest.setModes = anytest.modes.set;

goog.exportSymbol('anytest.setModes', anytest.modes.set);
