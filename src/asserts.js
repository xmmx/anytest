goog.provide('anytest.asserts');
goog.require('anytest.utils');

anytest.asserts.itemCount_ = 0

anytest.asserts.equal = function (a, b, strict) {
  anytest.asserts.itemCount_++;
  var res = true;
  if (strict) {
    res = (a === b);
  } else {
    res = (a == b);
  }
  if (!res) {
    log('assert '+anytest.asserts.itemCount_+' failed! not '+(strict?'strict ':'')+'equal', a,strict?typeof a:'',b,strict?typeof b:'');
  }
};


anytest.asserts.deepEqual = function (a, b) {
  log(JSON.stringify(a),JSON.stringify(b),' START');
  anytest.asserts.itemCount_++;
  var res = true;
  res = anytest.utils.compareObjects(a,b);

  if (res) {
    //log(JSON.stringify(res));
    log('assert '+anytest.asserts.itemCount_+' failed!',JSON.stringify(a),JSON.stringify(b),JSON.stringify(res));
  }
};


anytest.asserts.not = function (inst) {
  anytest.asserts.itemCount_++;
  if (inst != null || inst != undefined) {
    log('assert '+anytest.asserts.itemCount_+' failed! instance not null.');
  }
};


anytest.asserts.notEqual = function (a, b, strict) {
  anytest.asserts.itemCount_++;
  var res = true;
  if (strict) {
    res = (a === b);
  } else {
    res = (a == b);
  }
  if (res) {
    log('assert '+anytest.asserts.itemCount_+' failed! '+(strict?'strict ':'')+'equal', a);
  }
};


anytest.asserts.notDeepEqual = function (a, b) {
  anytest.asserts.itemCount_++;
  var res = true;
  res = anytest.utils.compareObjects(a,b);
  if (!res) {
    log('assert '+anytest.asserts.itemCount_+' failed! equal',a);
  }
};

goog.exportSymbol('anytest.asserts.equal', anytest.asserts.equal);
goog.exportSymbol('anytest.asserts.deepEqual', anytest.asserts.deepEqual);
goog.exportSymbol('anytest.asserts.not', anytest.asserts.not);
goog.exportSymbol('anytest.asserts.notEqual', anytest.asserts.notEqual);
goog.exportSymbol('anytest.asserts.notDeepEqual', anytest.asserts.notDeepEqual);