goog.provide('anytest.panel');
goog.require('anytest.panel.resize');

/**
 @namespace
 @name anytest.panels
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
 */
anytest.panel = function(type) {
  var _div = anytest.utils.createDiv('sidePanel', true);
  var content = '';
  switch (type) {
    case 'resize':
      content = anytest.panel.resize.HTMLContent.apply(this, arguments);
      break;
    case 'interactive':
      content = '<b>Interactive Panel</b><hr/>' +
          '<input type="button" value="Reset Layer" onclick="anytest.sidePanels.interactive.reset()"><br/>' +
          '<input type="button" value="Toggle basic layer" onclick="anytest.sidePanels.interactive.toggleBasicLayer()">' +
          '<input type="button" value="Remove last point" onclick="anytest.sidePanels.interactive.removeLastPoint()">' +
          '<br/><br/><b>Coordinates log:</b><br/>' +
          '<textarea id="interactiveCoordinatesLogger" rows="10" style="width: 100%"></textarea>';

      anytest.sidePanels.interactive.basicLayer_ = stage.layer();
      stage.rect(0, 0, stage.width(), stage.height())
          .fill('blue .05')
          .stroke('none')
          .parent(anytest.sidePanels.interactive.basicLayer_);
      anytest.sidePanels.interactive.reset();
      break;
    default:
      content = null;
      break;
  }
  if (content) {
    _div.innerHTML = content;
    _div.style.display = 'block';
  }
};




/**
 * Очищает слой с польовательскими точками.
 */
anytest.sidePanels.interactive.reset = function() {
  if (anytest.sidePanels.interactive.additionalLayer_)
    anytest.sidePanels.interactive.additionalLayer_.dispose();

  anytest.sidePanels.interactive.additionalLayer_ = stage.layer();
  stage.rect(0, 0, stage.width(), stage.height())
      .fill('orange .05')
      .stroke('none')
      .parent(anytest.sidePanels.interactive.additionalLayer_);
  acgraph.events.listen(
      anytest.sidePanels.interactive.additionalLayer_,
      acgraph.events.EventType.CLICK,
      function(e) {
        anytest.sidePanels.interactive.initPoint(e.offsetX, e.offsetY);
      });

  this.newPointCount_ = 0;
  try {
    document.getElementById('interactiveCoordinatesLogger').innerHTML = '';
  } catch (e) {
  }
};


/**
 * Флаг для переключения отображения слоя.
 * @type {boolean}
 * @private
 */
anytest.sidePanels.interactive.toggleBasicLayerFlag_ = true;


/**
 * Перерключает отображение слоя с точками (базовыми).
 */
anytest.sidePanels.interactive.toggleBasicLayer = function() {
  this.toggleBasicLayerFlag_ = !this.toggleBasicLayerFlag_;
  this.basicLayer_.visible(this.toggleBasicLayerFlag_);
};


/**
 * Добавляет запись в 'Coordinate log'.
 * @param x
 * @param y
 */
anytest.sidePanels.interactive.log = function(x, y) {
  var txtArea = document.getElementById('interactiveCoordinatesLogger');
  txtArea.innerHTML = this.newPointCount_ + ') ' + x + ' ' + y + '\n' + txtArea.innerHTML;
};


/**
 * Коллектор с точками. чтобы можно было удалять.
 * @type {Array}
 * @private
 */
anytest.sidePanels.interactive.pointCollector_ = [];


/**
 * Удаляет последнюю точку.
 */
anytest.sidePanels.interactive.removeLastPoint = function() {
  if (this.newPointCount_ > 0) {
    this.pointCollector_[this.newPointCount_].dispose();
    this.newPointCount_--;
    var logger = document.getElementById('interactiveCoordinatesLogger').innerHTML;
    var index = logger.indexOf('\n');
    document.getElementById('interactiveCoordinatesLogger').innerHTML = logger.substr(index + 1, logger.length - index);
  }
};


/**
 * Counter
 * @type {number}
 * @private
 */
anytest.sidePanels.interactive.newPointCount_ = 0;


/**
 * Добавляет точку на слой.
 * @param x {number}
 * @param y {number}
 * @param isBasicLayer {boolean=} По дефолту выключен.
 */
anytest.sidePanels.interactive.initPoint = function(x, y, isBasicLayer) {
  if (isBasicLayer) {
    stage.circle(x, y, 3).fill('grey').parent(this.basicLayer_);
  } else {
    this.newPointCount_++;
    this.pointCollector_[this.newPointCount_] = stage.layer().parent(this.additionalLayer_);
    stage.circle(x, y, 4).fill('blue').parent(this.pointCollector_[this.newPointCount_]);
    stage.circle(x, y, 3).fill('red').parent(this.pointCollector_[this.newPointCount_]);
    stage.text(x, y, '' + this.newPointCount_).color('white').parent(this.pointCollector_[this.newPointCount_]);
    stage.text(x + 1, y + 1, '' + this.newPointCount_).parent(this.pointCollector_[this.newPointCount_]);
    this.log(x, y);
  }
};


/**
 * Слой с точками, которые уже занесени в тест.
 * Инициализируется при включении панели.
 * @type {Object}
 * @private
 */
anytest.sidePanels.interactive.basicLayer_ = null;


/**
 * Слой с точками, которые нанесены "с панели".
 * Инициализируется при включении панели.
 * @type {Object}
 * @private
 */
anytest.sidePanels.interactive.additionalLayer_ = null;

goog.exportSymbol('anytest.panel', anytest.panel);
