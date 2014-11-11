goog.provide('anytest.utils');


/**
 @namespace
 @ignore
 @name anytest.utils
 */


/**
 * Div с информацией для браузеров юез консоли.
 * @type {Element}
 */
anytest.utils.statusDiv = null;


/**
 * @type {Console}
 * @ignore
 */
var console = window['console'];


/**
 * Выводит сообщение в консоль браузера (если она есть, иначе в спе див).
 * @return {*}
 */
anytest.utils.log = function() {
  if (console && console.log && typeof console.log != 'object')
    console.log.apply(console, arguments);
  //  else {
  if (!anytest.utils.statusDiv) {
    // создаем текстареа вместо консоли.
    anytest.utils.statusDiv = document.createElement('textarea');
    anytest.utils.statusDiv.id = 'status';
    document.body.appendChild(anytest.utils.statusDiv);
  }
  var args = [];
  for (var a = 0; a < arguments.length; a++)
    args.push(arguments[a]);

  document.getElementById('status').value = args.join('\n');

  //  }
  return window['anytest'];
};


/**
 * Sleeper.
 * @param {number} milliseconds .
 */
anytest.utils.sleep = function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}


/**
 * Содает див.
 * @param {string=} opt_id Div id.
 * @param {boolean=} opt_isFirstChild Воткнуть ли див в начало body.
 * @return {Element} Созданный див.
 */
anytest.utils.createDiv = function(opt_id, opt_isFirstChild) {
  if (opt_id && document.getElementById(opt_id))
    return document.getElementById(opt_id);
  var _div = document.createElement('div');
  if (opt_id) _div.id = opt_id;
  if (opt_isFirstChild)
    document.body.insertBefore(_div, document.body.firstChild);
  else
    document.body.appendChild(_div);
  return _div;
};


/**
 * Возвращает значение выбранного input:radio.
 * @param {string} name
 * @return {*}
 */
anytest.utils.getCheckedRadioByName = function(name) {
  var elements = document.getElementsByName(name);
  for (var i = 0, len = elements.length; i < len; ++i)
    if (elements[i].checked) return elements[i].value;
};


/**
 * Append css to head.
 * @param {string} css
 */
anytest.utils.appendMyStyles = function(css) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
};
