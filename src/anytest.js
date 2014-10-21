goog.provide('anytest');
goog.require('anytest.utils');
goog.require('anytest.styles');
goog.require('anytest.CAT');
goog.require('anytest.modes');
goog.require('anytest.panels');


/**
 * Core space for all anytest components.
 * @namespace
 * @name anytest
 */


anytest.create = function(opt_width, opt_height, opt_sizeTarget){
  this.utils.appendMyStyles(this.styles.rules);

  return this;
};

anytest.exit = function(){

};

test.utils.CAT.needCheckConsoleMsg_ = false;
/**
 * Создает <div> с сообщением, которое мы ожидаем/неожидаем.
 * @param txt {string} Текст ожидаемого сообщения.
 * @param isIgnored {boolean=} По дефолту не игнорить сообщения.
 */
test.utils.setCheckMsg = function (txt, isIgnored) {
  var _div = createDiv();
  _div.className = 'consoleMsg';
  if (isIgnored) _div.className = 'ignoreConsoleMsg';
  _div.innerHTML = txt;
  this.CAT.needCheckConsoleMsg_ = true;
};

/**
 * Добавляет описание теста.
 * @param txt
 */
anytest.description = function (txt) {
  this.utils.createDiv('description').innerHTML = txt;
  return this;
};


/**
 * @inherited
 */
anytest.log = anytest.utils.log;

goog.exportSymbol('anychart.log', anychart.log);