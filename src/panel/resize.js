goog.provide('anytest.panel.resize');


/**
 * Ресайзит чарт или контейнер.
 * @param chartInstance {{}}
 * @param sign {number} -1 или 1
 * @param resizeTarget {string=} Enum: both, chart, container
 * @param step {number=} Шаг ресайза.
 * @param logOff {boolean=} Отключить сообщения в консоль.
 */
anytest.panels.resize.resizeTarget = function(chartInstance, sign, resizeTarget, step, logOff) {
  var _width, _height, _step;
  var _resizeTarget = resizeTarget || getCheckedRadioId('resizeTarget');
  var _types = test.enums.resizeTypes;

  if (chart && _resizeTarget == _types.CHART) {
    _width = chartInstance.width() || anytest.settings_.width;
    _height = chartInstance.height() || anytest.settings_.height;
  } else if (_resizeTarget == _types.STAGE) {
    _width = stage.width();
    _height = stage.height();
  } else {
    _width = document.getElementById('container').style.width;
    _height = document.getElementById('container').style.height;
  }
  _width = parseInt(_width);
  _height = parseInt(_height);
  _step = step || document.getElementById('resizeStep').value;
  _step = parseInt(_step) * sign;
  _width += _step;
  _height += _step;

  if (!logOff)
    log('resize ' + _resizeTarget + ' from (', _width - _step, _height - _step, ') to (', _width, _height, ')');

  if (chart && (_resizeTarget == _types.BOTH || _resizeTarget == _types.CHART)) {
    chartInstance.width(_width);
    chartInstance.height(_height);
  }

  if (_resizeTarget == _types.BOTH || _resizeTarget == _types.STAGE) {
    stage.width(_width);
    stage.height(_height);
  }

  if (_resizeTarget != _types.CHART && _resizeTarget != _types.STAGE) {
    document.getElementById('container').style.width = _width;
    document.getElementById('container').style.height = _height;
    if (_resizeTarget == _types.CONTAINER_FULL_PERCENT) {
      if (chart) {
        chartInstance.width('100%');
        chartInstance.height('100%');
      }
      stage.width('100%');
      stage.height('100%');
    }
  }
};


/**
 * @return {string}
 */
anytest.panels.resize.HTMLContent = function() {
  var content;
  var obj_ = arguments[1] || 'chart';
  var types_ = anytest.enums.resizeTypes;
  content = '<b>Resize panel</b><hr/>' +
      '<input type="button" value="Inc(++)" onclick="anytest.sidePanels.resize.resizeTarget(' + obj_ + ', 1)">&nbsp;' +
      '<input type="button" value="Dec(--)" onclick="anytest.sidePanels.resize.resizeTarget(' + obj_ + ', -1)">&nbsp;' +
      '<input type="text" id="resizeStep" value="10" style="width: 50px; text-align: right;">' +
      '<br/><br/><b>Target:</b><br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.BOTH + '" CHECKED>Both<br/>';
  if (window['chart'])
    content += '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CHART + '">Chart Only<br/>';
  content += '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.STAGE + '">Stage Only<br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CONTAINER_ONLY + '">Container Only<br/>' +
      '&nbsp;&nbsp;<input type="radio" name="resizeTarget" value="' + types_.CONTAINER_FULL_PERCENT + '">Container (chart 100%)';
  return content;
};
