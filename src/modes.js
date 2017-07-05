goog.provide('anytest.modes');
goog.require('anytest.utils');


anytest.modes = {
  schemaJSON_: {},
  schemaXML_: '',
  currentMode_: anytest.utils.getParameterByName('mode')
};

anytest.modes.prepare = function () {
  if (anytest.modes.currentMode_ == -1) anytest.modes.currentMode_ = 0;

  var pathToEngine, pathToSchemas;
  if (anytest.VERSION) {
    //pathToEngine = "https://raw.github.com/geraintluff/tv4/master/";
    //pathToSchemas = anytest.utils.getPathToSchema()+"../../";
    if (window['anychart'] && window['anychart']['VERSION']){
      pathToEngine = anytest.utils.getPathToSchema() + "../local-cdn/";
      pathToSchemas = anytest.utils.getPathToSchema();
    }else{
      pathToEngine = "./utils/";
      pathToSchemas = "../../dist/";
    }
  } else {
    pathToEngine = "../external/";
    pathToSchemas = "../out/";
  }


  if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_JSON)) {
    anytest.utils.loadScript(pathToEngine + 'tv4.min.js');
    anytest.modes.schemaJSON_ = goog.global.JSON.parse(''+anytest.utils.loadFile(pathToSchemas + 'json-schema.json'));
  }

  if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_XML)) {
    anytest.utils.loadScript(pathToEngine + 'xmllint.js');
    anytest.modes.schemaXML_ = anytest.utils.loadFile(pathToSchemas + 'xml-schema.xsd');
  }
};


/**
 * List of all possible modes.
 * @enum {number}
 */
anytest.modes.Enum = {
  NONE: 0x00000000,
  RESIZE: 0x00000001,
  SCHEMAS_JSON: 0x00000004,
  SCHEMAS_XML: 0x00000008,
  HIDDEN_CONTAINER_1: 0x00000010,
  HIDDEN_CONTAINER_2: 0x00000020,
  ALL: 0x0000002F
};


/**
 * If mode is enabled.
 * @param {anytest.modes.Enum} mode .
 * @return {boolean} .
 */
anytest.modes.hasMode = function (mode) {
  return !!(anytest.modes.currentMode_ & mode);
};

anytest.modes.JSON_small_ = [];
//anytest.modes.JSON_large_ = [];
anytest.modes.XML_small_ = [];
//anytest.modes.XML_large_ = [];

anytest.modes.elemExec=0;
anytest.modes.checkModes = function () {
  if (!anytest.charts.length) return;
  var consoleMsgMultiplier = 0;

  ///////////////    JSON mode
  if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_JSON)) {
    // get all charts JSON
    for (var i = 0; i < anytest.charts.length; i++) {
      if (window[anytest.charts[i]]['toJson']) {
        anytest.modes.JSON_small_[i]=window[anytest.charts[i]]['toJson'](false, false);
        //anytest.modes.JSON_large_[i]=window[anytest.charts[i]]['toJson'](false, true);
      }
    }

    consoleMsgMultiplier++;
    anytest.step(function () {
      anytest.modes.elemExec=0;
      for (var jsonSmI = 0; jsonSmI < anytest.charts.length; jsonSmI++) {
        if (!window[anytest.charts[jsonSmI]]['toJson'] || window[anytest.charts[jsonSmI]]['at_exclude_json']) continue;
        anytest.modes.elemExec++;
        //if (!anytest.utils.compareObjects(anytest.modes.JSON_small_[jsonSmI], anytest.modes.JSON_large_[jsonSmI]))
        //  log(anytest.charts[jsonSmI], 'JSON small & large are equal.');

        var chartContainer = anytest.utils.isEmptyObj(anytest.stage)?'container':anytest.stage;
        var restoreConfig = JSON.parse(JSON.stringify(anytest.modes.JSON_small_[jsonSmI]));
        var diff = anytest.utils.compareObjects(anytest.modes.JSON_small_[jsonSmI], restoreConfig);
        if (diff)
          log(anytest.charts[jsonSmI], 'Wrong JSON_small format (diff, toJson, stringify/parse)', diff, anytest.modes.JSON_small_[jsonSmI], restoreConfig);
        else {
          var validResp = window['tv4']['validateMultiple'](anytest.modes.JSON_small_[jsonSmI], anytest.modes.schemaJSON_);
          if (!validResp || !validResp.valid)
            log(anytest.charts[jsonSmI], 'JSON_small not valid by schema', validResp);
          try {
            window[anytest.charts[jsonSmI]]['dispose']();
            delete window[anytest.charts[jsonSmI]];
            window[anytest.charts[jsonSmI]] = window['anychart']['fromJson'](anytest.modes.JSON_small_[jsonSmI]);
            anytest.utils.loadManager['fromJSON_SM_' + anytest.charts[jsonSmI]] = true;
            window[anytest.charts[jsonSmI]]['listen']('chartdraw', function (e) {
              delete anytest.utils.loadManager['fromJSON_SM_' + anytest.utils.getKeyByValue(window, this)];
            });
            window[anytest.charts[jsonSmI]]['container'](chartContainer)['draw']();
          } catch (e) {
            if (window['console'] && window['console']['log'] && typeof window['console']['log'] != 'object')
              console.log('error', e.message, e.stack);
          }
        }
      }
      if (anytest.modes.elemExec > 0) anytest.stepAppendCycle('JSON-sm-',true);
    },false);



    //consoleMsgMultiplier++;
    //anytest.step(function () {
    //  anytest.modes.elemExec=0;
    //  for (var jsonLgI = 0; jsonLgI < anytest.charts.length; jsonLgI++) {
    //    if (!window[anytest.charts[jsonLgI]]['toJson'] || window[anytest.charts[jsonLgI]]['at_exclude_json']) continue;
    //    anytest.modes.elemExec++;
    //    var chartContainer = anytest.utils.isEmptyObj(anytest.stage)?'container':anytest.stage
    //    var restoreConfig = JSON.parse(JSON.stringify(anytest.modes.JSON_large_[jsonLgI]));
    //    var diff = anytest.utils.compareObjects(anytest.modes.JSON_large_[jsonLgI], restoreConfig);
    //    if (diff)
    //      log(anytest.charts[jsonLgI], 'Wrong JSON_lagre format (diff, toJson, stringify/parse)', diff, anytest.modes.JSON_large_[jsonLgI], restoreConfig);
    //    else {
    //      var validResp = window['tv4']['validateMultiple'](anytest.modes.JSON_large_[jsonLgI], anytest.modes.schemaJSON_);
    //      if (!validResp || !validResp.valid)
    //        log(anytest.charts[jsonLgI], 'JSON_large not valid by schema', validResp);
    //      try {
    //        window[anytest.charts[jsonLgI]]['dispose']();
    //        delete window[anytest.charts[jsonLgI]];
    //        window[anytest.charts[jsonLgI]] = window['anychart']['fromJson'](anytest.modes.JSON_large_[jsonLgI]);
    //        anytest.utils.loadManager['fromJSON_LG_' + anytest.charts[jsonLgI]] = true;
    //        window[anytest.charts[jsonLgI]]['listen'](window['anychart']['enums']['EventType']['CHART_DRAW'], function (e) {
    //          delete anytest.utils.loadManager['fromJSON_LG_' + anytest.utils.getKeyByValue(window, this)];
    //        });
    //        window[anytest.charts[jsonLgI]]['container'](chartContainer)['draw']();
    //      } catch (e) {
    //        if (window['console'] && window['console']['log'] && typeof window['console']['log'] != 'object')
    //          console.log('error', e.message, e.stack);
    //      }
    //    }
    //  }
    //  if (anytest.modes.elemExec > 0) anytest.stepAppendCycle('JSON-lg-',true);
    //},false);

    // secondary export
    // ПОКА БЛЯДСКИЙ МАППИНГ СУЕТ СВОЕ ШТОПОПАЛО, то конфиги собвпадать не будут!!!
    //anytest.step(function () {
    //  for (var jsonI = 0; jsonI < anytest.charts.length; jsonI++) {
    //    if (!window[anytest.charts[jsonI]]['toJson'] || window[anytest.charts[jsonI]]['at_exclude_json']) continue;
    //    var secondJson = window[anytest.charts[jsonI]]['toJson'](false, true);
    //    var secondJsonStr = window[anytest.charts[jsonI]]['toJson'](true, true);
    //    var diff = anytest.utils.compareObjects(anytest.modes.JSON_large_[jsonI], secondJson);
    //    if (diff)
    //      log(anytest.charts[jsonI], 'toJson after restore doesn\'t match as object (diff, first, second)', diff, anytest.modes.JSON_large_[jsonI], secondJson);
    //    else if (JSON.stringify(anytest.modes.JSON_large_[jsonI]) != secondJsonStr)
    //      log(anytest.charts[jsonI], 'toJson after restore doesn\'t match as string (first, second)', JSON.stringify(anytest.modes.JSON_large_[jsonI]), secondJsonStr);
    //  }
    //},false);
  }
  ///////////////    XML mode
  if (anytest.modes.hasMode(anytest.modes.Enum.SCHEMAS_XML)) {
    // get all charts JSON
    for (var ii = 0; ii < anytest.charts.length; ii++) {
      if (!window[anytest.charts[ii]]['toXml']) continue;
      anytest.modes.XML_small_.push(window[anytest.charts[ii]]['toXml'](false, false));
      //anytest.modes.XML_large_.push(window[anytest.charts[ii]]['toXml'](false, true));
    }

    consoleMsgMultiplier++;
    anytest.step(function () {
      anytest.modes.elemExec=0;
      for (var xmlSmI = 0; xmlSmI < anytest.charts.length; xmlSmI++) {
        if (!window[anytest.charts[xmlSmI]]['toXml'] || window[anytest.charts[xmlSmI]]['at_exclude_xml']) continue;
        anytest.modes.elemExec++;
        //if (anytest.modes.XML_small_[xmlSmI]==anytest.modes.XML_large_[xmlSmI])
        //  log(anytest.charts[xmlSmI], 'XML small & large are equal.');

        var chartContainer = anytest.utils.isEmptyObj(anytest.stage)?'container':anytest.stage
        var Module = {};
        Module['xml'] = anytest.modes.XML_small_[xmlSmI];
        Module['schema'] = anytest.modes.schemaXML_;
        Module['arguments'] = ['--noout', '--schema', 'file.xsd', 'file.xml'];
        var result = window['validateXML'](Module);
        if (result.trim() != 'file.xml validates') log(anytest.charts[xmlSmI],'XML small',result);
        try {
          window[anytest.charts[xmlSmI]]['dispose']();
          delete window[anytest.charts[xmlSmI]];
          window[anytest.charts[xmlSmI]] = window['anychart']['fromXml'](anytest.modes.XML_small_[xmlSmI]);
          anytest.utils.loadManager['fromXML_SM_' + anytest.charts[xmlSmI]] = true;
          window[anytest.charts[xmlSmI]]['listen']('chartdraw', function (e) {
            delete anytest.utils.loadManager['fromXML_SM_' + anytest.utils.getKeyByValue(window, this)];
          });
          window[anytest.charts[xmlSmI]]['container'](chartContainer)['draw']();
        } catch (e) {
          if (window['console'] && window['console']['log'] && typeof window['console']['log'] != 'object')
            console.log('error', e.message, e.stack);
        }
      }
      if (anytest.modes.elemExec > 0) anytest.stepAppendCycle('XML-SM-',true);
    },false);


    //consoleMsgMultiplier++;
    //anytest.step(function () {
    //  anytest.modes.elemExec=0;
    //  for (var xmlLgI = 0; xmlLgI < anytest.charts.length; xmlLgI++) {
    //    if (!window[anytest.charts[xmlLgI]]['toXml'] || window[anytest.charts[xmlLgI]]['at_exclude_xml']) continue;
    //    anytest.modes.elemExec++;
    //    var chartContainer = anytest.utils.isEmptyObj(anytest.stage)?'container':anytest.stage;
    //    var Module = {};
    //    Module['xml'] = anytest.modes.XML_large_[xmlLgI];
    //    Module['schema'] = anytest.modes.schemaXML_;
    //    Module['arguments'] = ['--noout', '--schema', 'file.xsd', 'file.xml'];
    //    var result = window['validateXML'](Module);
    //    if (result.trim() != 'file.xml validates') log(anytest.charts[xmlLgI],'XML large',result);
    //    try {
    //      window[anytest.charts[xmlLgI]]['dispose']();
    //      delete window[anytest.charts[xmlLgI]];
    //      window[anytest.charts[xmlLgI]] = window['anychart']['fromXml'](anytest.modes.XML_large_[xmlLgI]);
    //      anytest.utils.loadManager['fromXML_SM_' + anytest.charts[xmlLgI]] = true;
    //      window[anytest.charts[xmlLgI]]['listen'](window['anychart']['enums']['EventType']['CHART_DRAW'], function (e) {
    //        delete anytest.utils.loadManager['fromXML_SM_' + anytest.utils.getKeyByValue(window, this)];
    //      });
    //      window[anytest.charts[xmlLgI]]['container'](chartContainer)['draw']();
    //    } catch (e) {
    //      if (window['console'] && window['console']['log'] && typeof window['console']['log'] != 'object')
    //        console.log('error', e.message, e.stack);
    //    }
    //  }
    //  if (anytest.modes.elemExec > 0) anytest.stepAppendCycle('XML-LG-',true);
    //},false);

    // secondary export
    // ПОКА БЛЯДСКИЙ МАППИНГ СУЕТ СВОЕ ШТОПОПАЛО, то конфиги собвпадать не будут!!!
    //anytest.step(function () {
    //  for (var xmlI = 0; xmlI < anytest.charts.length; xmlI++) {
    //    if (!window[anytest.charts[xmlI]]['toXml'] || window[anytest.charts[xmlI]]['at_exclude_xml']) continue;
    //    var secondXML = window[anytest.charts[xmlI]]['toXml'](false, true);
    //    if (anytest.modes.XML_large_[xmlI] != secondXML)
    //      log(anytest.charts[xmlI], 'toXml after restore doesn\'t match diff:', anytest.utils.compareStrings(anytest.modes.XML_large_[xmlI], secondXML));
    //  }
    //},false);
  }

  ////////////////////// HIDDEN CONTAINER
  if (anytest.modes.hasMode(anytest.modes.Enum.HIDDEN_CONTAINER_1) || anytest.modes.hasMode(anytest.modes.Enum.HIDDEN_CONTAINER_2)) {
    consoleMsgMultiplier++;
    anytest.step(function () {
      document.getElementById('container').style.display = 'none';
      anytest.stepAppendCycle('HC-', true);
    },false,200);
  }

  ////////////////////// RESIZE
  if (anytest.modes.hasMode(anytest.modes.Enum.RESIZE)) {
    if (!anytest.utils.isEmptyObj(anytest.stage)) {
      consoleMsgMultiplier++;
      consoleMsgMultiplier++;

      ///// Charts
      anytest.modes.elemExec=0;
      anytest.step(function () {
        var excluded=false;
        for (var rI = 0; rI < anytest.charts.length; rI++) {
          if (!window[anytest.charts[rI]]['width'] || !window[anytest.charts[rI]]['height']) continue;
          if(window[anytest.charts[rI]]['at_exclude_R-CHART']) {
            excluded = true;
            continue;
          }
          anytest.modes.elemExec++;
          if (!window[anytest.charts[rI]]['width']()) window[anytest.charts[rI]]['width']('100%');
          if (!window[anytest.charts[rI]]['height']()) window[anytest.charts[rI]]['height']('100%');
          window[anytest.charts[rI]]['width'](anytest.modes.resizeCalc(window[anytest.charts[rI]]['width'](), 50));
          window[anytest.charts[rI]]['height'](anytest.modes.resizeCalc(window[anytest.charts[rI]]['height'](), 50));
        }
        if (anytest.modes.elemExec > 0 && !excluded) anytest.CAT.getScreen('R-CHART-plus', -1);
      },false);
      consoleMsgMultiplier++;
      anytest.step(function () {
        var excluded=false;
        for (var rI = 0; rI < anytest.charts.length; rI++) {
          if (!window[anytest.charts[rI]]['width'] || !window[anytest.charts[rI]]['height']) continue;
          if(window[anytest.charts[rI]]['at_exclude_R-CHART']) {
            excluded = true;
            continue;
          }
          window[anytest.charts[rI]]['width'](anytest.modes.resizeCalc(window[anytest.charts[rI]]['width'](), -100));
          window[anytest.charts[rI]]['height'](anytest.modes.resizeCalc(window[anytest.charts[rI]]['height'](), -100));
        }
        if (anytest.modes.elemExec > 0 && !excluded) anytest.CAT.getScreen('R-CHART-minus', -1);
      },false);
      consoleMsgMultiplier++;
      anytest.step(function () {
        for (var rI = 0; rI < anytest.charts.length; rI++) {
          if (!window[anytest.charts[rI]]['width'] || !window[anytest.charts[rI]]['height'] || window[anytest.charts[rI]]['at_exclude_R-CHART']) continue;
          window[anytest.charts[rI]]['width'](anytest.modes.resizeCalc(window[anytest.charts[rI]]['width'](), 50));
          window[anytest.charts[rI]]['height'](anytest.modes.resizeCalc(window[anytest.charts[rI]]['height'](), 50));
        }
        anytest.stepAppendCycle('R-CHART-', true);
      },false);

      /// STAGE
      consoleMsgMultiplier++;
      anytest.step(function(){
        anytest.stage['width'](anytest.modes.resizeCalc(anytest.stage['width'](), 150));
        anytest.stage['height'](anytest.modes.resizeCalc(anytest.stage['height'](), 150));
        anytest.CAT.getScreen('R-STG-plus', -1);
      }, false);
      consoleMsgMultiplier++;
      anytest.step(function(){
        anytest.stage['width'](anytest.modes.resizeCalc(anytest.stage['width'](), -200));
        anytest.stage['height'](anytest.modes.resizeCalc(anytest.stage['height'](), -200));
        anytest.CAT.getScreen('R-STG-minus', -1);
      }, false);
      consoleMsgMultiplier++;
      anytest.step(function(){
        //restore
        anytest.stage['width'](anytest.modes.resizeCalc(anytest.stage['width'](), 50));
        anytest.stage['height'](anytest.modes.resizeCalc(anytest.stage['height'](), 50));
        anytest.stepAppendCycle('R-STAGE-', true);
      }, false);
    }

    /// container
    consoleMsgMultiplier++;
    anytest.step(function(){
      document.getElementById('container').style.width = anytest.modes.resizeCalc(document.getElementById('container').style.width, 50);
      document.getElementById('container').style.height = anytest.modes.resizeCalc(document.getElementById('container').style.height, 50);
      anytest.CAT.getScreen('R-DIV-plus', -1);
    }, false);
    consoleMsgMultiplier++;
    anytest.step(function(){
      document.getElementById('container').style.width = anytest.modes.resizeCalc(document.getElementById('container').style.width, -100);
      document.getElementById('container').style.height = anytest.modes.resizeCalc(document.getElementById('container').style.height, -100);
      anytest.CAT.getScreen('R-DIV-minus', -1);
    }, false);
    consoleMsgMultiplier++;
    anytest.step(function(){
      //restore
      document.getElementById('container').style.width = anytest.modes.resizeCalc(document.getElementById('container').style.width, 50);
      document.getElementById('container').style.height = anytest.modes.resizeCalc(document.getElementById('container').style.height, 50);
      anytest.stepAppendCycle('R-DIV-', true);
    }, false);
  }

  //anytest.utils.doubleConsoleMsg(consoleMsgMultiplier);
};

anytest.modes.hiddenTrigger = false;
anytest.modes.hiddenModeDisplay_ = function(needStage) {
  if (anytest.utils.isEmptyObj(anytest.utils.loadManager) && !anytest.modes.hiddenTrigger) {
    document.getElementById('container1').style.display = 'block';
    document.getElementById('container').style.display = 'none';
    if (needStage) {
      window['stage']['dispose']();
      window['stage'] = anytest.stage;
    }
    anytest.modes.hiddenTrigger = true;
    //document.getElementById('container1');
  }
};


anytest.modes.resizeCalc = function(value, delta) {
  var isPerc = ((value||'1').toString().substr(-1) == '%');
  if (isPerc && Math.abs(delta).toString().length > 1) delta = delta/10;
  value = parseInt(value,10);
  value += delta;
  return value+(isPerc?'%':'px');
};
