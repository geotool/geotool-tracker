'use strict';

var debug = function(pkgName) {
  var isEnabled = process.env.DEBUG && process.env.DEBUG.indexOf(pkgName) >= 0;
  var log = (isEnabled) ? require('debug')(pkgName) : function() {};
  log.isEnabled = isEnabled;
  return log;
};
debug.isEnabled = process.env.DEBUG;

module.exports = debug;
