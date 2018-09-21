goog.provide('anytest.panel.debug');

/**
 @namespace
 @ignore
 @name anytest.panel.debug
 */

if (anytest.modes.currentMode_ == "" && anytest.utils.getParameterByName('debug')) window.location.href = window.location.href+'&mode=0'

anytest.panel.debug.execStep = function () {
  anytest.panel.debug.curentStep++;
  document.getElementById('debuggerCurrentStep').innerHTML = anytest.panel.debug.curentStep;
  anytest.stepExec();
};

anytest.panel.debug.curentStep = 0;
anytest.panel.debug.logSteps = [];
anytest.panel.debug.logAllSteps = [];

anytest.panel.debug.logListStepSeparator = "\n" + "//---- step -----" + "\n";

anytest.panel.debug.stepToLog = function (step) {
  var func = step.func.toString().trim();
  func = func.substring(14, func.length - 4);
  if (step.timeout)
    func = "// delay=" + step.timeout + "\n" + func;
  return func;
};

var calcAdress = function () {

};

/**
 * generate panel
 * @ignore
 * @return {string}
 */
anytest.panel.debug.getHTMLContent = function () {
  document.body.style.height="100%";
  document.body.parentNode.style.height="100%";

  var head = document.head || document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://static.anychart.com/utility/shigh/styles/shCore.css";
  head.appendChild(link);
  link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://static.anychart.com/utility/shigh/styles/shThemeDefault.css";
  head.appendChild(link);
  var script = document.createElement('script');
  head.appendChild(script);
  script.type = "text/javascript";
  script.onload = function () {
    var script1 = document.createElement('script');
    head.appendChild(script1);
    script1.type = "text/javascript";
    script1.onload = function () {
      window.setTimeout(function(){window['SyntaxHighlighter']['highlight']();},1000);
    };
    script1.src = "https://static.anychart.com/utility/shigh/scripts/shBrushJScript.js";
  };
  script.src = "https://static.anychart.com/utility/shigh/scripts/shCore.js";
  //anytest.panel.debug.logAllSteps.push('exit');
  var content =
      '<b>Debug Panel</b>' +
      '<input type="button" style="margin-left: 30px" value="toggle interactive" onclick="anytest.panel.debug.toggleInteractiveLayer()">' +
      '<select id="selectMode" style="margin-left: 30px" onchange="' +
            'window.location.href = window.location.href.replace(\'&mode=\'+anytest.modes.currentMode_, \'&mode=\'+this.value)">' +
        '<option></option>' +
        '<option value="0">Simple</option>' +
        '<option value="1">Resize</option>' +
        '<option value="4">Json</option>' +
        '<option value="8">XML</option>' +
        '<option value="16">HC1</option>' +
        '<option value="32">HC2</option>' +
      '</select>'+
      '<span style="float: right">' +
      '<input type="button" id="debuggerBtn" value="Next Step >" onclick="anytest.panel.debug.execStep()" style="margin-right: 20px; ">' +
      '<span id="debuggerCurrentStep">' + anytest.panel.debug.curentStep + '</span>/' +
      '<span id="debuggerAllSteps">' + anytest.steps_.length + '</span>' +
      '</span>' +
      '<hr><b>Log Steps</b><br/>' +
      '<pre class="brush: js" id="logStepListDebugger">&nbsp;</pre><br/>' +
      '<b style="float: right">Full steps list&nbsp;&nbsp;</b><br/>'+
      '<pre class="brush: js" id="nextStepListDebugger">' + anytest.panel.debug.logAllSteps.join(anytest.panel.debug.logListStepSeparator) + '</pre>';
  return content;
};

anytest.panel.debug.toggleInteractiveLayer_ = false;
anytest.panel.debug.toggleInteractiveLayer = function(){
  anytest.panel.debug.toggleInteractiveLayer_ = !anytest.panel.debug.toggleInteractiveLayer_;
  if (anytest.panel.debug.toggleInteractiveLayer_){
    anytest.panel.interactive.createBasicLayer(true);
  }else{
    anytest.panel.interactive.removeBasicLayer();
    if (anytest.panel.interactive.additionalLayer)
      anytest.panel.interactive.additionalLayer['dispose']();
    if (anytest.panel.interactive.crosshairLayer)
      anytest.panel.interactive.crosshairLayer['dispose']();
  }
}

goog.exportSymbol('anytest.panel.debug.execStep', anytest.panel.debug.execStep);
goog.exportSymbol('anytest.panel.debug.toggleInteractiveLayer', anytest.panel.debug.toggleInteractiveLayer);
