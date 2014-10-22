goog.provide('anytest.settings_');


/**
 * @type {string|number}
 */
anytest.settings_.width = '400px';


/**
 * @type {string|number}
 */
anytest.settings_.height = '300px';


/**
 * @type {string}
 */
anytest.settings_.sizeTarget = anytest.enums.resizeTypes.BOTH;


/**
 * @type {{resize: boolean, schemas: boolean, hiddenContainer: boolean, all: Function}}
 */
anytest.settings_.modes = {
  resize: false, // only SINGLE chart
  schemas: false, // only SINGLE chart
  hiddenContainer: false, // only SINGLE chart
  all: function(flag) {
    anytest.settings_.modes.resize = flag;
    anytest.settings_.modes.schemas = flag;
    anytest.settings_.modes.hiddenContainer = flag;
  }
};
