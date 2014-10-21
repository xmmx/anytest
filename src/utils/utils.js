goog.provide('anytest.utils');
/**
 @namespace
 @name anytest.utils
 */

/**
 * Div с информацией для браузеров юез консоли.
 * @type {HTMLElement}
 */
anytest.utils.statusDiv = null;

/**
 * Выводит сообщение в консоль браузера (если она есть, иначе в спе див).
 */
anytest.utils.log = function () {
  if (console && console.log && typeof console.log != "object")
    console.log.apply(console, arguments);
  else {
    if (!anytest.utils.statusDiv)
      anytest.utils.statusDiv = anytest.utils.createDiv('status');
    var args = [];
    for (var a in arguments)
      args.push(arguments[a]);
    anytest.utils.statusDiv.innerHTML += args.join('\n') + '\n';
  }
};


/**
 * Содает див.
 * @param id {string=} Div id.
 * @param isFirstChild {boolean=} Воткнуть ли див в начало body.
 * @returns {HTMLElement} Созданный див.
 */
anytest.utils.createDiv = function (id, isFirstChild) {
  var _div = document.createElement('div');
  if (id) _div.id = id;
  if (isFirstChild)
    document.body.insertBefore(_div, document.body.firstChild);
  else
    document.body.appendChild(_div);
  return _div;
};

// IE < 8 fix
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (what, i) {
    i = i || 0;
    var L = this.length;
    while (i < L) {
      if (this[i] === what) return i;
      ++i;
    }
    return -1;
  };
}

/**
 * Возвращает значение выбранного input:radio.
 * @param name {string}
 * @returns {*}
 */
anytest.utils.getCheckedRadioByName = function (name) {
  var elements = document.getElementsByName(name);
  for (var i = 0, len = elements.length; i < len; ++i)
    if (elements[i].checked) return elements[i].value;
};

/**
 * Append css to head.
 * @param css {string}
 */
anytest.utils.appendMyStyles = function (css) {
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