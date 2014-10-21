goog.provide('anytest.CAT');
/**
 @namespace
 @name anytest.CAT
 */

/**
 * Завершающая команда для САТ.
 * @private
 */
anytest.CAT.exit_ = function () {
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
 * Команда о снятии скриншота.
 * @param imgName {string=} Имя текущей картинки (без расширения). Латиница, без пробелов и подтирок.
 * @param factor {number=} По умолчания выключен. То есть ни с кем не сравнивается. Может принимать значения 1 или -1.
 * Если factor > 0, то сравнение с указанной картинкой будет на совпадение, если factor < 0, то на различие.
 *  getScreen('afterResize', 1) значит, что текущая картинка должна совпадать с базовой.
 *  getScreen('afterHidden',-1, 'afterResize') значит, что текущая картинка должна отличаться от 'afterResize'.
 * @param compareImgName {string=} Имя картинки для сравнения (без расширения). Латиница, без пробелов и подтирок.
 *  По дефолту базовая.
 * @returns {*} Имя текущей картинки или null.
 */
anytest.CAT.getScreen = function (imgName, factor, compareImgName) {
  if (!imgName) {
    if (!this.duplicateBasic_) {
      imgName = this.defaultScreenshotName_;
      this.duplicateBasic_ = true;
    } else {
      alert('getScreen пытается перезаписать основной файл!');
      return;
    }
  }
  var _cmd = 'CAT: get_screenshot ' + imgName;
  if (factor) {
    compareImgName = compareImgName || this.defaultScreenshotName_;
    if (+factor) {
      if (factor > 0)
        _cmd += ' equal';
      else {
        _cmd += ' different';
      }
      _cmd += '_' + compareImgName;
    }
  }
  log(_cmd);
  return imgName;
};

/**
 * Проверка, что девелоп персия js.
 * @private
 */
anytest.CAT.isDevelop_ = function () {
  log('CAT: develop_edition');
};

/**
 * Посылает команду сравнить сообщения из консоли.
 * @private
 */
anytest.CAT.checkMsg_ = function () {
  log('CAT: check_messages');
};


/**
 * Перемещает курсор в указанные координаты.
 * @param x {number}
 * @param y {number}
 * @param type {string=} Enum: click|mousemove|mouseup|mousedown.
 */
anytest.CAT.action = function (x, y, type) {
  type = type || 'click';
  log('CAT: action: ' + type + ' ' + x + ' ' + y);
  // add point to base layer;
  anytest.panels.interactive.initPoint(x, y, true);
};