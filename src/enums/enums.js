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


goog.exportSymbol('anytest.enums.resizeTypes.BOTH', anytest.enums.resizeTypes.BOTH);
goog.exportSymbol('anytest.enums.resizeTypes.CHART', anytest.enums.resizeTypes.CHART);
goog.exportSymbol('anytest.enums.resizeTypes.CONTAINER_ONLY', anytest.enums.resizeTypes.CONTAINER_ONLY);
goog.exportSymbol('anytest.enums.resizeTypes.CONTAINER_FULL_PERCENT', anytest.enums.resizeTypes.CONTAINER_FULL_PERCENT);
goog.exportSymbol('anytest.enums.resizeTypes.STAGE', anytest.enums.resizeTypes.STAGE);
