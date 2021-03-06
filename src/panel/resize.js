goog.provide('anytest.panel.resize');

/**
 @namespace
 @ignore
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
  var _types = anytest.resizeTypes;

  if (((anytest.chart && anytest.chart['width']) && chartInstance) && _resizeTarget == _types.CHART) {
    _width = chartInstance['width']() || anytest.settings_.width;
    _height = chartInstance['height']() || anytest.settings_.height;
  } else if (_resizeTarget == _types.STAGE) {
    _width = anytest.stage['width']();
    _height = anytest.stage['height']();
  } else {
    _width = document.getElementById('container').style.width;
    _height = document.getElementById('container').style.height;
  }
  var isW_perc = (_width.toString()[_width.length-1] == "%");
  var isH_perc = (_height.toString()[_height.length-1]== "%");
  _width = parseInt(_width, 10);
  _height = parseInt(_height, 10);
  //log(_resizeTarget, 'from ', _width, _height);
  _step = opt_step || document.getElementById('resizeStep').value;
  _step = parseInt(_step, 10) * parseInt(sign,10);
  _width = 0 + _width + _step + (isW_perc ? "%":'px');
  _height = 0 + _height + _step + (isH_perc ? "%":'px');

  //log(_resizeTarget, 'to ', _width, _height);

  if (_resizeTarget != _types.CHART && _resizeTarget != _types.STAGE) {
    if (_resizeTarget == _types.CONTAINER_FULL_PERCENT && anytest.stage) {
      anytest.stage['suspend']();
      anytest.stage['width']('100%');
      anytest.stage['height']('100%');
      if (((anytest.chart && anytest.chart['width']) && chartInstance)) {
        chartInstance['width']('100%');
        chartInstance['height']('100%');
      }
      anytest.stage['resume']();
    }
    document.getElementById('container').style.width = _width;
    document.getElementById('container').style.height = _height;
  }

  if (((anytest.chart && anytest.chart['width']) && chartInstance) && (_resizeTarget == _types.BOTH || _resizeTarget == _types.CHART)) {
    chartInstance['width'](_width);
    chartInstance['height'](_height);
  }

  if (anytest.stage && (_resizeTarget == _types.BOTH || _resizeTarget == _types.STAGE)) {
    anytest.stage['width'](_width);
    anytest.stage['height'](_height);
  }


};


/**
 * @return {string}
 * @ignore
 */
anytest.panel.resize.getHTMLContent = function() {
  var content;
  var obj_ = arguments[1] || 'chart';
  var types_ = anytest.resizeTypes;
  content = '<b>Resize panel</b><hr/>' +
      '<input type="button" value="Inc(++)" onclick="anytest.panel.resize.resizeTarget(window[\'' + obj_ + '\'], 1)">&nbsp;' +
      '<input type="button" value="Dec(--)" onclick="anytest.panel.resize.resizeTarget(window[\'' + obj_ + '\'], -1)">&nbsp;' +
      '<input type="text" id="resizeStep" value="10" style="width: 50px; text-align: right;">' +
      '<br/><br/><b>Target:</b><br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.BOTH + '" CHECKED>Both<br/>';
  if (anytest.chart && anytest.chart['width'])
    content += '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CHART + '">Chart Only<br/>';
  content += '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.STAGE + '">Stage Only<br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CONTAINER_ONLY + '">Container Only<br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CONTAINER_FULL_PERCENT + '">Container (chart 100%)';
  return content;
};


goog.exportSymbol('anytest.panel.resize.resizeTarget', anytest.panel.resize.resizeTarget);
