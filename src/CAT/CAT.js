goog.provide('anytest.CAT');


/**
 @namespace
 @name anytest.CAT
 */


/**
 * Завершающая команда для САТ.
 * @ignore
 */
anytest.CAT.exit = function() {
  log('CAT: exit');
};


/**
 * Флаг для проверки повторой записи в основной скрин.
 * @type {boolean}
 * @private
 */
anytest.CAT.duplicateBasic_ = false;


/**
 * Default screenname;
 * @type {string}
 * @private
 */
anytest.CAT.defaultScreenshotName_ = 'basic';


/**
 * Screenname stack;
 * @type {Array}
 * @private
 */
anytest.CAT.namesStack_ = [];


/**
 * Команда о снятии скриншота.
 * @param {string=} opt_imgName Имя текущей картинки (без расширения). Латиница, без пробелов и подтирок.
 * @param {number=} opt_factor По умолчания выключен. То есть ни с кем не сравнивается. Может принимать значения 1 или -1.
 * Если factor > 0, то сравнение с указанной картинкой будет на совпадение, если factor < 0, то на различие.
 *  getScreen('afterResize', 1) значит, что текущая картинка должна совпадать с базовой.
 *  getScreen('afterHidden',-1, 'afterResize') значит, что текущая картинка должна отличаться от 'afterResize'.
 * @param {string=} opt_compareImgName Имя картинки для сравнения (без расширения). Латиница, без пробелов и подтирок.
 *  По дефолту базовая.
 * @return {?string} Имя текущей картинки или null.
 */
anytest.CAT.getScreen = function(opt_imgName, opt_factor, opt_compareImgName) {
  if (!opt_imgName) {
    if (!anytest.CAT.duplicateBasic_) {
      opt_imgName = anytest.CAT.defaultScreenshotName_;
      anytest.CAT.duplicateBasic_ = true;
    } else {
      alert('getScreen пытается перезаписать основной файл!');
      return null;
    }
  }
  anytest.CAT.namesStack_.push(opt_imgName);
  var _cmd = 'CAT: get_screenshot ' + opt_imgName;
  if (opt_factor) {
    opt_compareImgName = opt_compareImgName || anytest.CAT.defaultScreenshotName_;
    if (anytest.enums2arr(anytest.enums.modesGSmsg).indexOf(opt_imgName) > -1){
      opt_compareImgName = anytest.CAT.namesStack_[anytest.CAT.namesStack_.length-2];
    }
    if (+opt_factor) {
      if (opt_factor > 0)
        _cmd += ' equal';
      else {
        _cmd += ' different';
      }
      _cmd += '_' + opt_compareImgName;
    }
  }
  log(_cmd);
  return opt_imgName;
};


/**
 * Проверка, что девелоп персия js.
 * @ignore
 */
anytest.CAT.isDevelop = function() {
  log('CAT: develop_edition');
};


/**
 * Посылает команду сравнить сообщения из консоли.
 * @ignore
 */
anytest.CAT.checkMsg = function() {
  log('CAT: check_messages');
};


/**
 * Перемещает курсор в указанные координаты.
 * @param {number} x
 * @param {number} y
 * @param {string=} opt_type Enum: click|mousemove|mouseup|mousedown.
 * @param {string=} opt_theme v6|defaultTheme.
 */
anytest.CAT.action = function(x, y, opt_type, opt_theme) {
  opt_type = opt_type || 'click';
  opt_theme = opt_theme || 'defaultTheme';
  // log only in theme
  if (window['anychart']['themes'][opt_theme])
    log('CAT: action: ' + opt_type + ' ' + x + ' ' + y);
  // add point to base layer;
  anytest.panel.interactive.initPoint(x, y, true);
};

goog.exportSymbol('anytest.CAT', anytest.CAT);
goog.exportSymbol('anytest.CAT.getScreen', anytest.CAT.getScreen);
goog.exportSymbol('anytest.CAT.action', anytest.CAT.action);
