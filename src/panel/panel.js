goog.provide('anytest.panel');
goog.require('anytest.panel.debug');
goog.require('anytest.panel.interactive');
goog.require('anytest.panel.resize');
/**
 @namespace
 @ignore
 @name anytest.panel
 */


/**
 * Включает панель слева от теста.
 *
 * Использованние:
 *  - ('resize', 'chart')
 *  если нужна ресайз панель, то указываем первым параметром очевидное. в качестве второго параметра принимается
 *  строка(!) переменной объекта ресайза. Эта переменная должна быть глобальной(!) (спросить если не понимаешь).
 *  по дефолту второй параметр 'chart'.
 *
 *  - ('interactive')
 * @param {string} type
 * @return {*}
 */
anytest.panel.create = function(type) {
  var _div = anytest.utils.createDiv('sidePanel');
  var content = '';
  switch (type) {
    case 'resize':
      content = anytest.panel.resize.getHTMLContent.apply(window['anytest'], arguments);
      break;
    case 'interactive':
      content = anytest.panel.interactive.getHTMLContent();
      break;
    case 'debug':
      _div.style.width = document.body.clientWidth - anytest.stage.width()-40+'px';
      _div.style.height = "100%";
      _div.style.position = "absolute";
      _div.style.top = 0;
      _div.style.right = 0;
      _div.style.bottom = 0;
      _div.style['z-index']=10001;
      var resizer = anytest.utils.createDiv('sidePanel-border',1);
      resizer.style.width = _div.style.width;
      resizer.style['z-index']=10000;
      content = anytest.panel.debug.getHTMLContent();
      anytest.panel.resizable();
      break;
    default:
      content = null;
      break;
  }
  if (content) {
    _div.innerHTML = content;
    _div.style.display = 'block';
    //_div.style.display='none';
  }

  return window['anytest'];
};

anytest.panel.resizable = function(){
  var p = document.getElementById('sidePanel-border'); // element to make resizable

  p.addEventListener('mousedown', initDrag, false);

  function initDrag(e) {
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
  }

  function doDrag(e) {
    p.style.width = ( document.body.clientWidth - e.clientX) + 'px';
  }

  function stopDrag(e) {
    document.getElementById('sidePanel').style.width = p.style.width;
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
  }
}

/**
 * Включает панель слева от теста.<br/>
 * Использованние:<br/>
 *  - ('resize', 'chart')<br/>
 *  если нужна ресайз панель, то указываем первым параметром очевидное. в качестве второго параметра принимается
 *  строка(!) переменной объекта ресайза. Эта переменная должна быть глобальной(!) (спросить если не понимаешь).
 *  по дефолту второй параметр 'chart'.<br/>
 * <br/>
 *  - ('interactive')<br/>
 * @type {Function}
 */
anytest.createPanel = anytest.panel.create;


/**
 * Sugar for panel.
 */
anytest.resizePanel = function() {
  anytest.createPanel('resize');
};


/**
 * Sugar for panel.
 */
anytest.interactivePanel = function() {
  anytest.createPanel('interactive');
};

goog.exportSymbol('anytest.createPanel', anytest.panel.create);
goog.exportSymbol('anytest.resizePanel', anytest.resizePanel);
goog.exportSymbol('anytest.interactivePanel', anytest.interactivePanel);
