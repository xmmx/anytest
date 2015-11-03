goog.provide('anytest.enums');


/**
 * Resize enum.
 * @type {{CHART: string, BOTH: string, STAGE: string, CONTAINER_ONLY: string, CONTAINER_FULL_PERCENT: string}}
 */
anytest.enums.resizeTypes = {
  /** только чарт, без контейнера. */
  CHART: 'Chart',
  /** и контейнер и чарт/stage. */
  BOTH: 'Both',
  /** только stage, без контейнера. */
  STAGE: 'Stage',
  /** только контейнер, без чарта/stage. */
  CONTAINER_ONLY: 'Container',
  /** только контейнер, чарт/stage 100%. */
  CONTAINER_FULL_PERCENT: 'ContainerFullPercent'
};


/**
 * GetMessage Enums
 * @type {{hiddenContainer: string, schemaJSON: string, schemaXML: string, resizeChart: string, resizeBoth: string, resizeStage: string, resizeContainer: string, resizeContainerFP: string}}
 */
anytest.enums.modesGSmsg = {
  hiddenContainer: 'hiddenContainerMode',
  schemaJSON: 'restoreFromJSON',
  schemaXML: 'restoreFromXML',
  resizeChart: 'after' + anytest.enums.resizeTypes.CHART + 'Resize',
  resizeBoth: 'after' + anytest.enums.resizeTypes.BOTH + 'Resize',
  resizeStage: 'after' + anytest.enums.resizeTypes.STAGE + 'Resize',
  resizeContainer: 'after' + anytest.enums.resizeTypes.CONTAINER_ONLY + 'Resize',
  resizeContainerFP: 'after' + anytest.enums.resizeTypes.CONTAINER_FULL_PERCENT + 'Resize'
};


/**
 * HashMap.
 * @type {Array.<Array>}
 * @ignoreDoc
 */
anytest.enums.hashMap = [];


/**
 * Enum to array.
 * @ignoreDoc
 * @param {Object} enumName
 * @return {Array}
 */
anytest.enums2arr = function(enumName) {
  var res = [];
  for (var enm in enumName) {
    res.push(enumName[enm]);
  }
  return res;
};

goog.exportSymbol('anytest.enums.resizeTypes.BOTH', anytest.enums.resizeTypes.BOTH);
goog.exportSymbol('anytest.enums.resizeTypes.CHART', anytest.enums.resizeTypes.CHART);
goog.exportSymbol('anytest.enums.resizeTypes.CONTAINER_ONLY', anytest.enums.resizeTypes.CONTAINER_ONLY);
goog.exportSymbol('anytest.enums.resizeTypes.CONTAINER_FULL_PERCENT', anytest.enums.resizeTypes.CONTAINER_FULL_PERCENT);
goog.exportSymbol('anytest.enums.resizeTypes.STAGE', anytest.enums.resizeTypes.STAGE);
