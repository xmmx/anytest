goog.provide('anytest.modes');



/**
 @namespace
 @name anytest.modes
 */


/**
 * Включает/выключает режимы тестирования.
 * test.utils.modes('!all') - выключает все.
 * test.utils.modes('schemas') - включает экспорт.
 * test.utils.modes('all', '!resize') - включает все режимы, кроме ресайза.
 * и тд
 *  !!! Использовать до setUp() !!!
 * @param var_args {...} Аргументов может быть много.
 * @returns {test.utils}
 */
test.utils.modes = function (var_args) {
  for (var i in arguments) {
    var mod = arguments[i];
    var flag = true;
    if ('!' == mod.substr(0, 1)) {
      flag = false;
      mod = mod.substr(1);
    }
    if (mod == 'all') {
      this.settings_.modes.all(flag);
    } else {
      this.settings_.modes[mod] = flag;
    }
  }
  return this;
};

test.utils.modes.checkFlag_ = true;
/**
 * Автоматически запускает режимы тестирования заданные в настройках.
 * @returns {null}
 * @private
 */
test.utils.modes.checkModes_ = function () {
  if (!this.checkFlag_) return null;
  var _modes = test.utils.settings_.modes;
  if (_modes.hiddenContainer) {
    if (!chart) {
      alert('Ошибка: Нет инстанса чарта!');
      return null;
    }
    test.utils.needDelay_('hiddenContainer');
    this.hiddenContainer_();
  }
  if (_modes.resize) {
    test.utils.needDelay_('resize');
    this.resize_();
  }
  // самый "тяжелый" тест в конце.
  // ПОКА ПЕРМАНЕНТНО ОТКЛЮЧЕН!!!!!!!!!!!
  if (_modes.schemas && false) {
    if (!chart) {
      alert('Ошибка: Нет инстанса чарта!');
      return null;
    }
    test.utils.needDelay_('exportXML');
    test.utils.needDelay_('exportJSON');
    this.exportXMLJSON_();
  }
  this.checkFlag_ = false;
};

/**
 * Включает режим тестирования на Ресайз
 * @private
 */
test.utils.modes.resize_ = function () {
  var _type = test.enums.resizeTypes;

  test.utils.sidePanels.resize.resizeTarget(chart, 1, _type.BOTH, 50, true);
  test.utils.sidePanels.resize.resizeTarget(chart, -1, _type.BOTH, 50, true);
  test.utils.CAT.getScreen('after' + _type.BOTH + 'Resize', 1);


  if (chart) {
    test.utils.sidePanels.resize.resizeTarget(chart, 1, _type.CHART, 50, true);
    test.utils.sidePanels.resize.resizeTarget(chart, -1, _type.CHART, 50, true);
    test.utils.CAT.getScreen('after' + _type.CHART + 'Resize', 1);
  }

  test.utils.sidePanels.resize.resizeTarget(chart, 1, _type.CONTAINER_FULL_PERCENT, 50, true);
  test.utils.sidePanels.resize.resizeTarget(chart, -1, _type.CONTAINER_FULL_PERCENT, 50, true);
  test.utils.CAT.getScreen('after' + _type.CONTAINER_FULL_PERCENT + 'Resize', 1);

  test.utils.sidePanels.resize.resizeTarget(chart, 1, _type.CONTAINER_ONLY, 50, true);
  test.utils.sidePanels.resize.resizeTarget(chart, -1, _type.CONTAINER_ONLY, 50, true);
  test.utils.CAT.getScreen('after' + _type.CONTAINER_ONLY + 'Resize', 1);

  test.utils.turnOffDelay_('resize');
};

/**
 * Включает режим тестирования на экспорт.
 * @private
 */
test.utils.modes.exportXMLJSON_ = function () {
  if (anychart.DEVELOP) {
//    alert('На DEVELOP версии проверять жопа!');
    return null;
  }

  var _messageXML = 'XML schema is valid';
  var _messageJSON = 'JSON schema is valid';
  test.utils.setCheckMsg(_messageXML);
  test.utils.setCheckMsg(_messageJSON);

  var configXML = chart.toXml();
  var configJSON = chart.toJson();

  if (configJSON) {
    acgraph.validate(configJSON, function (data) {
      if (data == 'success') {
        log(_messageJSON);
      }
      var _saveChart = chart;
      try {
        chart.container().parent(null);
        chart = null;
        chart = anychart.fromJson(configJSON);
        chart.container(stage).draw();
        test.utils.chartListen(chart, function (e) {
          test.utils.CAT.getScreen('restoreFromXML', 1);
          test.utils.turnOffDelay_('exportJSON');
          _step2();
        });
      } catch (e) {
        chart = _saveChart;
        chart.draw();
        log(e.message, e.stack);
        test.utils.turnOffDelay_('exportJSON');
        _step2();
      }
    });
  }
  // для того, чтоб тестировалось последовательно.
  var _step2 = function () {
    if (configXML) {
      var _saveChart = chart;
      try {
        chart.container().parent(null);
        chart = null;
        chart = anychart.fromXml(configXML);
        chart.container(stage).draw();
        test.utils.chartListen(chart, function (e) {
          test.utils.CAT.getScreen('restoreFromXML', 1);
          test.utils.turnOffDelay_('exportXML');
        });
      } catch (e) {
        chart = _saveChart;
        chart.draw();
        log(e.message, e.stack);
        test.utils.turnOffDelay_('exportXML');
      }
    }
  }
};

/**
 * Включает режим тестирования на скрытый контейнер.
 * @private
 */
test.utils.modes.hiddenContainer_ = function () {
  document.getElementById('container').style.display = 'none';
  document.getElementById('container').style.display = 'block';
  test.utils.CAT.getScreen('hiddenContainer', 1);

  test.utils.turnOffDelay_('hiddenContainer');
};
