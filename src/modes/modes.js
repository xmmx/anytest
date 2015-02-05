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
  for (var i = 0; i < arguments.length; i++) {
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

anytest.modes.getParameterByName = function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * List of all possible modes.
 * @enum {number}
 */
anytest.modes.Enum = {
  NONE: 0x00000000,
  RESIZE: 0x00000001,
  HIDDEN_CONTAINER: 0x00000002,
  SCHEMAS_JSON: 0x00000004,
  SCHEMAS_XML: 0x00000008,
  ALL: 0x0000000F
};

anytest.modes.hasMode = function(mode) {
  return !!(anytest.modes.getParameterByName('mode') & mode);
};



/**
 * Автоматически запускает режимы тестирования заданные в настройках.
 * @return {null}
 * @ignore
 */
anytest.modes.checkModes = function() {
  if (!anytest.modes.checkFlag_) return null;
  var _modes = anytest.settings_.modes;
  if (anytest.modes.hasMode(anytest.modes.Enum.HIDDEN_CONTAINER)) {
    if (!anytest.chart) {
      alert('Ошибка: Нет инстанса чарта!');
      return null;
    }
    anytest.needDelay('hiddenContainer');
    anytest.modes.hiddenContainer_();
  }
  if (anytest.modes.hasMode(anytest.modes.Enum.RESIZE)) {
    anytest.needDelay('resize');
    anytest.modes.resize();
  }
  // самый "тяжелый" тест в конце.
  // ПОКА ПЕРМАНЕНТНО ОТКЛЮЧЕН!!!!!!!!!!!
  if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_JSON) || 
  	  anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_XML)
  ) {
    window['modes'] = {};

    if (window['chart']) {
      window['modes']['configXML'] = window['chart']['toXml']();
      window['modes']['configJSON'] = window['chart']['toJson']();

      if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_JSON)) {
        anytest.needDelay('JSON schema');
        anytest.modes.exportJSON_();
      }
      else if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_XML)) {
        anytest.needDelay('XML schema');
        anytest.modes.exportXML_();
      }
    }
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
anytest.modes.exportJSON_ = function() {
  if (window['modes']['configJSON']) {
    var emoConfig = JSON.parse(JSON.stringify(window['modes']['configJSON']));
    var diff = anytest.utils.compareObjects(window['modes']['configJSON'], emoConfig);
    if (diff)
      log('Wrong JSON format', diff, window['modes']['configJSON'], emoConfig);
    else {
      var validResp = window['tv4']['validateMultiple'](window['modes']['configJSON'], window['getJSONSchema']());
      if (!validResp || !validResp.valid)
        log('JSON not valid by schema', validResp);
      try {
        window['chart']['dispose']();
        delete window['chart'];
        window['chart'] = window['anychart']['fromJson'](window['modes']['configJSON']);
        window['chart']['listen'](window['anychart']['enums']['EventType']['CHART_DRAW'], function(e) {
          anytest.CAT.getScreen('restoreFromJSON', 1);
          anytest.turnOffDelay('JSON schema');
          if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_XML)) {
            anytest.needDelay('XML schema');
            anytest.modes.exportXML_();
          }
        });
        window['chart']['container'](window['stage'])['draw']();
      } catch (e) {
        log(e.message, e.stack);
      }
    }
  }
};


/**
 * Включает режим тестирования на экспорт.
 * @private
 * @return {null}
 * @ignore
 */
anytest.modes.exportXML_ = function() {
  // для того, чтоб тестировалось последовательно.
  if (window['modes']['configXML']) {
      var Module = {};
      Module['xml'] = window['modes']['configXML'];
      Module['schema'] = window['getXMLSchema']();
      Module['arguments'] = ['--noout', '--schema', 'file.xsd', 'file.xml'];
      var result = window['validateXML'](Module);

      if (result.trim() != 'file.xml validates') log(result);
      try {
        window['chart']['dispose']();
        delete window['chart'];
        window['chart'] = window['anychart']['fromXml'](window['modes']['configXML']);
        window['chart']['listen'](window['anychart']['enums']['EventType']['CHART_DRAW'], function(e) {
            anytest.CAT.getScreen('restoreFromXML', 1);
            anytest.turnOffDelay('XML schema');
        });
        window['chart']['container'](window['stage'])['draw']();
      } catch (e) {
        log(e.message, e.stack);
      }
  }
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
