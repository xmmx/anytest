goog.provide('anytest.styles');
/**
 @namespace
 @ignore
 @name anytest.styles
 */


/**
 * include css
 */
anytest.styles.include = function (cssString) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = cssString || anytest.styles.rules_;
  } else {
    style.appendChild(document.createTextNode(cssString ||anytest.styles.rules_));
  }
  head.appendChild(style);
};

anytest.styles.rules_ =
    '#container, #container1 {' +
    '  box-sizing: border-box;' +
    '  -moz-box-sizing: border-box;' +
    '  -webkit-box-sizing: border-box;' +
    '  border: 1px solid #000000;' +
    '  float: left;' +
    '  width: 400px;' +
    '  height: 300px;' +
    '}' +

    '#status{' +
    '  display: none;' +
    '}' +

    'body {' +
    '  margin: 0;' +
    '}' +

    '#sidePanel {' +
    '  float: right;' +
    '  width: 180px;' +
    '  background: #dcdcdc;' +
    '  border: 1px solid #5e5e5e;' +
    '  padding: 10px;' +
    '  display: none;' +
    '}' +

    '#description {' +
      //'  float: right;' +
    '  padding: 10px;' +
    '  margin: 0 10px;' +
    '  max-width: 400px;' +
    '  display: none;' +
    '  background: rgba(217, 148, 13, 0.06);' +
    '}' +

    '#logStepListDebugger{'+
    'width:98%;background: #fff;overflow: scroll;border:1px solid #000;'+
    'height:48%;'+
    '}'+

    '#nextStepListDebugger{'+
    'width:98%;background: #fff;overflow: scroll;border:1px solid #000;'+
    'height:48%;'+
    '}'+

    '.ignoreConsoleMsg, .consoleMsg { display: none;}';
