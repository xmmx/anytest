goog.provide('anytest.CAT');


/**
 @namespace
 @name anytest.CAT
 */
anytest.CAT = {};

/**
 * Завершающая команда для САТ.
 * @ignore
 */
anytest.CAT.exit = function () {
  anytest.step(function () {
    log('CAT: exit');
  }, false);
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
anytest.CAT.getScreen = function (opt_imgName, opt_factor, opt_compareImgName) {
  opt_imgName = opt_imgName || anytest.CAT.defaultScreenshotName_;
  var pref = (anytest.screenPrefix_[anytest.currentStep_] || "");
  if (goog.array.indexOf(anytest.CAT.namesStack_, pref+opt_imgName) > -1){
      //alert('getScreen пытается перезаписать файл '+ opt_imgName+'!');
      return null;
  }
  anytest.CAT.namesStack_.push(pref+opt_imgName);
  var _cmd = 'CAT: get_screenshot ' + pref+opt_imgName;
  if (opt_factor && !pref) {
    opt_compareImgName = opt_compareImgName || anytest.CAT.defaultScreenshotName_;
    if (+opt_factor) {
      if (opt_factor > 0)
        _cmd += ' equal';
      else {
        _cmd += ' different';
      }
      _cmd += '_' + opt_compareImgName;
    }
  }
  if (pref){
    _cmd += ' equal_'+opt_imgName;
  }

  log(_cmd);
  return opt_imgName;
};


/**
 * Проверка, что девелоп персия js.
 * @ignore
 */
anytest.CAT.isDevelop = function () {
  log('CAT: develop_edition');
};


/**
 * Посылает команду сравнить сообщения из консоли.
 * @ignore
 */
anytest.CAT.checkMsg = function () {
  anytest.step(function () {
    log('CAT: check_messages');
  }, false);
};


/**
 * Послать событие клавиатуры
 * @param {string} type Enum: keypress|keyup|keydown.
 * @param {string} key_name Escape|Backspace|A|B....
 */
anytest.CAT.actionKeyBoard = function (type, key_name) {
    log('CAT: action: ' + type + ' ' + key_name);
};


/**
 * Перемещает курсор в указанные координаты.
 * @param {number} x
 * @param {number} y
 * @param {string=} opt_type Enum: click|mousemove|mouseup|mousedown.
 * @param {string=} opt_theme all|v6|defaultTheme.
 * @param {string=} opt_button left|right|middle.
 * @param {string=} opt_keys any combination of 'alt','ctrl','shift'. for ex 'altshift','ctrlalt'.
 */
anytest.CAT.action = function (x, y, opt_type, opt_theme, opt_button, opt_keys) {
  opt_type = opt_type || 'click';
  opt_theme = opt_theme || 'all';
  opt_button = opt_button || 'left';
  opt_keys = opt_keys || '';
  // log only in theme
  if (opt_theme == 'all' || window['anychart']['themes'][opt_theme])
    log(['CAT: action:', opt_type, x, y, opt_button, opt_keys].join(' '));
  // add point to base layer;
  anytest.panel.interactive.initPoint(x, y, true);
};

anytest.CAT.timer = function (name, value) {
  log('CAT: timer: ' + name + ' ' + value + '');
};

//goog.exportSymbol('anytest.CAT', anytest.CAT);
goog.exportSymbol('anytest.CAT.getScreen', anytest.CAT.getScreen);
goog.exportSymbol('anytest.CAT.action', anytest.CAT.action);
goog.exportSymbol('anytest.CAT.actionKeyBoard', anytest.CAT.actionKeyBoard);
