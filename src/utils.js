goog.provide('anytest.utils');


/**
 @namespace
 @ignore
 @name anytest.utils
 */


/**
 * Div с информацией для браузеров юез консоли.
 * @type {Element}
 */
anytest.utils.statusDiv = null;


/**
 * Выводит сообщение в консоль браузера (если она есть, иначе в спе див).
 * @return {*}
 */
anytest.utils.log = function () {
  if (window['console'] && window['console']['log'] && typeof window['console']['log'] != 'object')
    window['console']['log']['apply'](window['console'], arguments);
  //  else {
  var args = [];
  for (var a = 0; a < arguments.length; a++)
    args.push(arguments[a]);
  document.getElementById('status').value = args.join('\n');

  //  }
  return window['anytest'];
};


/**
 * Содает див.
 * @param {string=} opt_id Div id.
 * @param {boolean=} opt_isFirstChild Воткнуть ли див в начало body.
 * @return {Element} Созданный див.
 */
anytest.utils.createDiv = function (opt_id, opt_isFirstChild) {
  if (opt_id && document.getElementById(opt_id))
    return document.getElementById(opt_id);
  var _div = document.createElement('div');
  if (opt_id) _div.id = opt_id;
  if (opt_isFirstChild)
    document.body.insertBefore(_div, document.body.firstChild);
  else
    document.body.appendChild(_div);
  return _div;
};


/**
 * Возвращает значение выбранного input:radio.
 * @param {string} name
 * @return {*}
 */
anytest.utils.getCheckedRadioByName = function (name) {
  var elements = document.getElementsByName(name);
  for (var i = 0, len = elements.length; i < len; ++i)
    if (elements[i].checked) return elements[i].value;
};


var compareObjects_count = 0;
/**
 *
 * @param {*} o1
 * @param {*} o2
 * @param {boolean|number=} opt_isRecursive
 * @return {*}
 */
anytest.utils.compareObjects = function (o1, o2, opt_isRecursive) {
  if (compareObjects_count > 10000) return false;
  if (opt_isRecursive) compareObjects_count++;
  else compareObjects_count = 0;
  if (compareObjects_count > 10000) {
    log('comapreObject recursive fail', o1,o2);
    return false;
  }
  var k, kDiff,
      diff = {};
  for (k in o1) {
    if (!o1.hasOwnProperty(k)) {
    } else if (typeof o1[k] != 'object' || typeof o2[k] != 'object') {
      if (!(k in o2) || o1[k] !== o2[k]) {
        diff[k] = o2[k];
      }
    } else if (kDiff = anytest.utils.compareObjects(o1[k], o2[k],1)) {
      diff[k] = kDiff;
    }
  }
  for (k in o2) {
    if (o2.hasOwnProperty(k) && !(k in o1)) {
      diff[k] = o2[k];
    }
  }
  for (k in diff) {
    if (diff.hasOwnProperty(k)) {
      return diff;
    }
  }
  return false;
};

anytest.utils.getParameterByName = function (name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};


anytest.utils.loadManager = {};


/**
 *
 * @param path
 * @param {Function=} opt_callback
 * @param {boolean=} opt_isEval
 * @returns {*}
 */
anytest.utils.loadFile = function (path, opt_callback, opt_isEval) {
  anytest.utils.loadManager[path] = true;
  var resource;
  if (opt_callback === null) opt_callback = function () {
  };
  opt_callback = opt_callback || function () {
        if (!resource.readyState == 4 || !resource.status == 200) {
          log('fail', resource)
        }
      };
  resource = new XMLHttpRequest();
  resource.open('GET', path, false);
  resource.onreadystatechange = function () {
    delete anytest.utils.loadManager[path];
    opt_callback();
  };
  resource.send(null);
  if (opt_isEval) eval(resource.response.toString());
  else return resource.response;
}


/**
 *
 * @param path
 * @param {Function=} opt_callback
 * @returns {*}
 */
anytest.utils.loadScript = function (path, opt_callback) {
  anytest.utils.loadManager[path] = true;
  var s = document.createElement('script');
  s.type = "text/javascript";
  s.async = true;
  s.src = path;
  s.addEventListener('load', function () {
    delete anytest.utils.loadManager[path];
    if (opt_callback) opt_callback();
  }, false);
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(s);
};

anytest.utils.pathToSchema_ = '';
anytest.utils.getPathToSchema = function () {
  if (!anytest.utils.pathToSchema_) {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf('anytest.min.js') > -1) {
        anytest.utils.pathToSchema_ = scripts[i].src.replace('anytest.min.js', '');
      }
    }
  }
  return anytest.utils.pathToSchema_;
};


/**
 *
 * @param {number} multiplier
 */
anytest.utils.doubleConsoleMsg = function (multiplier) {
  var body = document.getElementsByTagName('body')[0];
  var msgs = document.getElementsByClassName("consoleMsg");
  var i, d;
  var divs = [];
  for (i = 0; i < msgs.length; i++) {
    divs.push(msgs[i].cloneNode(true));
  }
  msgs = document.getElementsByClassName("ignoreConsoleMsg");
  for (i = 0; i < msgs.length; i++) {
    divs.push(msgs[i].cloneNode(true));
  }
  for (var j = 0; j < multiplier; j++)
    for (var ii = 0; ii < divs.length; ii++)
    {
      body.appendChild(divs[ii].cloneNode(true));
    }
};


anytest.utils.isEmptyObj = function (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
};

anytest.utils.getKeyByValue = function (obj, value) {
  for (var prop in obj) {
    if (obj[prop] === value)
      return prop;
  }
}

anytest.utils.compareStrings = function (s1,s2){
  var string1 = [];
  var string2 = [];
  string1 = s1.split(" ");
  string2 = s2.split(" ");
  var diff = [];
  var biggestStr = string2;
  if(s1.length>s2.length) biggestStr = string1;
  for(var x=0;x<biggestStr.length;x++){
    if(string1[x]!=string2[x]){
      diff.push(string2[x]);
    }
  }
  return diff.join(' ');
}