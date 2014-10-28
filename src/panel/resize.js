goog.provide('anytest.panel.resize');
goog.require('anytest.panel');

/**
 @namespace
 @name anytest.panels.resize
 */


/**
 * Ресайзит чарт или контейнер.
 * @param {Object} chartInstance
 * @param {number} sign -1 или 1.
 * @param {string=} opt_resizeTarget Enum: both, chart, container.
 * @param {number=} opt_step Шаг ресайза.
 * @param {boolean=} opt_logOff Отключить сообщения в консоль.
 * @ignore
 */
anytest.panel.resize.resizeTarget = function(chartInstance, sign, opt_resizeTarget, opt_step, opt_logOff) {
  var _width, _height, _step;
  var _resizeTarget = opt_resizeTarget || anytest.utils.getCheckedRadioByName('resizeTarget');
  var _types = anytest.enums.resizeTypes;

  if (anytest.chart && _resizeTarget == _types.CHART) {
    _width = chartInstance['width']() || anytest.settings_.width;
    _height = chartInstance['height']() || anytest.settings_.height;
  } else if (_resizeTarget == _types.STAGE) {
    _width = anytest.stage['width']();
    _height = anytest.stage['height']();
  } else {
    _width = document.getElementById('container').style.width;
    _height = document.getElementById('container').style.height;
  }
  _width = parseInt(_width, 10);
  _height = parseInt(_height, 10);
  _step = opt_step || document.getElementById('resizeStep').value;
  _step = parseInt(_step, 10) * sign;
  _width += _step;
  _height += _step;

  if (!opt_logOff)
    anytest.log('resize ' + _resizeTarget + ' from (', _width - _step, _height - _step, ') to (', _width, _height, ')');

  if (anytest.chart && (_resizeTarget == _types.BOTH || _resizeTarget == _types.CHART)) {
    chartInstance['width'](_width);
    chartInstance['height'](_height);
  }

  if (_resizeTarget == _types.BOTH || _resizeTarget == _types.STAGE) {
    anytest.stage['width'](_width);
    anytest.stage['height'](_height);
  }

  if (_resizeTarget != _types.CHART && _resizeTarget != _types.STAGE) {
    document.getElementById('container').style.width = _width;
    document.getElementById('container').style.height = _height;
    if (_resizeTarget == _types.CONTAINER_FULL_PERCENT) {
      if (anytest.chart) {
        chartInstance['width']('100%');
        chartInstance['height']('100%');
      }
      anytest.stage['width']('100%');
      anytest.stage['height']('100%');
    }
  }
};


/**
 * @return {string}
 * @ignore
 */
anytest.panel.resize.HTMLContent = function() {
  var content;
  var obj_ = arguments[1] || 'chart';
  var types_ = anytest.enums.resizeTypes;
  content = '<b>Resize panel</b><hr/>' +
      '<input type="button" value="Inc(++)" onclick="anytest.sidePanels.resize.resizeTarget(' + obj_ + ', 1)">&nbsp;' +
      '<input type="button" value="Dec(--)" onclick="anytest.sidePanels.resize.resizeTarget(' + obj_ + ', -1)">&nbsp;' +
      '<input type="text" id="resizeStep" value="10" style="width: 50px; text-align: right;">' +
      '<br/><br/><b>Target:</b><br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.BOTH + '" CHECKED>Both<br/>';
  if (anytest.chart)
    content += '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CHART + '">Chart Only<br/>';
  content += '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.STAGE + '">Stage Only<br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CONTAINER_ONLY + '">Container Only<br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CONTAINER_FULL_PERCENT + '">Container (chart 100%)';
  return content;
};
