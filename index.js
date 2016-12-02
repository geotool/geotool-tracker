'use strict';

module.exports = function(opts) {
  opts = opts || {};

  var events = require('events');
  var util = require('util');

  var Promise = opts.bluebird || require('bluebird');
  var lodash = opts.lodash || require('lodash');

  var debuglog = function() {
    console.log.apply(console, arguments);
  };
  debuglog.isEnabled = true;

  if (process.env.DEBUG && process.env.DEBUG.indexOf('geotool') >= 0) {
    var debug = require('debug');
    debuglog = debug('geotool');
    debuglog.isEnabled = true;
  }

  var Clazz = function(params) {
    params = params || {};
    var self = this;
    debuglog = params.debuglog || debuglog;

    debuglog.isEnabled && debuglog(' + constructor begin ...');

    

    debuglog.isEnabled && debuglog(' - constructor end!');
  };

  util.inherits(Clazz, events.EventEmitter);

  return Clazz;
};
