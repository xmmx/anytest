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
 * @type {{resize: boolean, XMLschema: boolean, JSONschema: boolean, hiddenContainer: boolean, all: Function}}
 */
anytest.settings_.modes = {
  resize: false, // only SINGLE chart
  XMLschema: true, // only SINGLE chart
  JSONschema: false, // only SINGLE chart
  hiddenContainer: false, // only SINGLE chart
  all: function(flag) {
    anytest.settings_.modes.resize = flag;
    anytest.settings_.modes.XMLschema = flag;
    anytest.settings_.modes.JSONschema = flag;
    anytest.settings_.modes.hiddenContainer = flag;
  }
};
