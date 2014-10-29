goog.provide('anytest.panel.interactive');

/**
 @namespace
 @ignore
 @name anytest.panels.interactive
 */


/**
 * Очищает слой с польовательскими точками.
 * @ignore
 */
anytest.panel.interactive.reset = function() {
  if (anytest.panel.interactive.additionalLayer)
    anytest.panel.interactive.additionalLayer['dispose']();

  anytest.panel.interactive.additionalLayer = anytest.stage['layer']();
  anytest.stage['rect'](0, 0, anytest.stage['width'](), anytest.stage['height']())
      .fill('orange .05')
      .stroke('none')
      .parent(anytest.panel.interactive.additionalLayer);
  window['acgraph']['events']['listen'](
      anytest.panel.interactive.additionalLayer,
      window['acgraph']['events']['EventType']['CLICK'],
      function(e) {
        anytest.panel.interactive.initPoint(e.offsetX, e.offsetY);
      });

  anytest.panel.interactive.newPointCount_ = 0;
  try {
    document.getElementById('interactiveCoordinatesLogger').innerHTML = '';
  } catch (e) {
  }
};


/**
 * Флаг для переключения отображения слоя.
 * @type {boolean}
 * @private
 * @ignore
 */
anytest.panel.interactive.toggleBasicLayerFlag_ = true;


/**
 * Перерключает отображение слоя с точками (базовыми).
 * @ignore
 */
anytest.panel.interactive.toggleBasicLayer = function() {
  anytest.panel.interactive.toggleBasicLayerFlag_ = !anytest.panel.interactive.toggleBasicLayerFlag_;
  anytest.panel.interactive.basicLayer.visible(anytest.panel.interactive.toggleBasicLayerFlag_);
};


/**
 * Добавляет запись в 'Coordinate log'.
 * @param {number} x
 * @param {number} y
 * @ignore
 */
anytest.panel.interactive.log = function(x, y) {
  var txtArea = document.getElementById('interactiveCoordinatesLogger');
  txtArea.innerHTML = anytest.panel.interactive.newPointCount_ + ') ' + x + ' ' + y + '\n' + txtArea.innerHTML;
};


/**
 * Коллектор с точками. чтобы можно было удалять.
 * @type {Array}
 * @private
 * @ignore
 */
anytest.panel.interactive.pointCollector_ = [];


/**
 * Удаляет последнюю точку.
 * @ignore
 */
anytest.panel.interactive.removeLastPoint = function() {
  if (anytest.panel.interactive.newPointCount_ > 0) {
    anytest.panel.interactive.pointCollector_[anytest.panel.interactive.newPointCount_]['dispose']();
    anytest.panel.interactive.newPointCount_--;
    var logger = document.getElementById('interactiveCoordinatesLogger').innerHTML;
    var index = logger.indexOf('\n');
    document.getElementById('interactiveCoordinatesLogger').innerHTML = logger.substr(index + 1, logger.length - index);
  }
};


/**
 * Counter
 * @type {number}
 * @private
 * @ignore
 */
anytest.panel.interactive.newPointCount_ = 0;


/**
 * Добавляет точку на слой.
 * @param {number} x
 * @param {number} y
 * @param {boolean=} opt_isBasicLayer По дефолту выключен.
 * @ignore
 */
anytest.panel.interactive.initPoint = function(x, y, opt_isBasicLayer) {
  if (opt_isBasicLayer) {
    anytest.stage['circle'](x, y, 3).fill('grey').parent(anytest.panel.interactive.basicLayer);
  } else {
    anytest.panel.interactive.newPointCount_++;
    anytest.panel.interactive.pointCollector_[anytest.panel.interactive.newPointCount_] = anytest.stage['layer']()['parent'](anytest.panel.interactive.additionalLayer);
    anytest.stage['circle'](x, y, 4)['fill']('blue')['parent'](anytest.panel.interactive.pointCollector_[anytest.panel.interactive.newPointCount_]);
    anytest.stage['circle'](x, y, 3)['fill']('red')['parent'](anytest.panel.interactive.pointCollector_[anytest.panel.interactive.newPointCount_]);
    anytest.stage['text'](x, y, '' + anytest.panel.interactive.newPointCount_)['color']('white')['parent'](anytest.panel.interactive.pointCollector_[anytest.panel.interactive.newPointCount_]);
    anytest.stage['text'](x + 1, y + 1, '' + anytest.panel.interactive.newPointCount_)['parent'](anytest.panel.interactive.pointCollector_[anytest.panel.interactive.newPointCount_]);
    anytest.panel.interactive.log(x, y);
  }
};


/**
 * Слой с точками, которые уже занесени в тест.
 * Инициализируется при включении панели.
 * @type {Object}
 * @ignore
 */
anytest.panel.interactive.basicLayer = null;


/**
 * Слой с точками, которые нанесены "с панели".
 * Инициализируется при включении панели.
 * @type {Object}
 * @ignore
 */
anytest.panel.interactive.additionalLayer = null;


/**
 * @ignore
 * @return {string}
 */
anytest.panel.interactive.getHTMLContent = function() {
  var content = '<b>Interactive Panel</b><hr/>' +
      '<input type="button" value="Reset Layer" onclick="anytest.panel.interactive.reset()"><br/>' +
      '<input type="button" value="Toggle basic layer" onclick="anytest.panel.interactive.toggleBasicLayer()">' +
      '<input type="button" value="Remove last point" onclick="anytest.panel.interactive.removeLastPoint()">' +
      '<br/><br/><b>Coordinates log:</b><br/>' +
      '<textarea id="interactiveCoordinatesLogger" rows="10" style="width: 100%"></textarea>';

  anytest.panel.interactive.basicLayer = anytest.stage['layer']();
  anytest.stage['rect'](0, 0, anytest.stage['width'](), anytest.stage['height']())
      .fill('blue .05')
      .stroke('none')
      .parent(anytest.panel.interactive.basicLayer);
  anytest.panel.interactive.reset();

  return content;
};


goog.exportSymbol('anytest.panel.interactive.reset', anytest.panel.interactive.reset);
goog.exportSymbol('anytest.panel.interactive.toggleBasicLayer', anytest.panel.interactive.toggleBasicLayer);
goog.exportSymbol('anytest.panel.interactive.removeLastPoint', anytest.panel.interactive.removeLastPoint);
