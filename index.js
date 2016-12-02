'use strict';

module.exports = function(opts) {
  opts = opts || {};

  var events = require('events');
  var util = require('util');
  var turf = require('turf');
  var Promise = opts.bluebird || require('bluebird');
  var lodash = opts.lodash || require('lodash');

  var debuglog = function() {};
  debuglog.isEnabled = true;

  var debugEnabled = process.env.DEBUG && process.env.DEBUG.indexOf('geotool') >= 0;
  if (debugEnabled) {
    var debug = require('debug');
    debuglog = debug('geotool');
    debuglog.isEnabled = debugEnabled;
  }

  var Clazz = function Clazz(params) {
    debuglog.isEnabled && debuglog(' + constructor begin ...');

    params = params || {};
    debuglog = params.debuglog || debuglog;

    var self = this;
    self.__data = lodash.defaults({}, lodash.pick(params, ['geofences']), { trails: {} });

    debuglog.isEnabled && debuglog(' - constructor end!');
  };

  Clazz.prototype.trace = function(trackingpoint) {
    return lodash.assign(trackingpoint, {event: 'NO'});
  }

  Clazz.prototype.stats = function() {
    var self = this;
    debuglog.isEnabled && debuglog(' - return geotool information');
    return {
      total: self.__data.geofences && self.__data.geofences.length || 0
    }
  }

  return Clazz;
};
