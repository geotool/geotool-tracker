'use strict';

module.exports = function(opts) {
  opts = opts || {};

  var EventEmitter = require('events');
  var util = require('util');
  var turf = require('turf');
  var Promise = opts.bluebird || require('bluebird');
  var lodash = opts.lodash || require('lodash');

  var TrackingTrigger = require('./lib/tracking-trigger.js');

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

    EventEmitter.call(this);
    params = params || {};
    debuglog = params.debuglog || debuglog;

    var self = this;
    self.__data = lodash.defaults({}, lodash.pick(params, ['geofences']), { trackers: {} });

    debuglog.isEnabled && debuglog(' - constructor end!');
  };

  util.inherits(Clazz, EventEmitter);

  Clazz.prototype.trace = function(trackingpoint) {
    var self = this;

    if (!self.__data.trackers[trackingpoint.actorId]) {
      self.__data.trackers[trackingpoint.actorId] = new TrackingTrigger({
        actorId: trackingpoint.actorId
      });
      self.__data.trackers[trackingpoint.actorId].on('change', function(data) {
        self.emit('change', data);
      });
    }

    var trackingResult = {
      actorId: trackingpoint.actorId,
      inside: [],
      events: []
    };

    lodash.forEach(self.__data.geofences, function(geofence) {
      if (turf.inside(trackingpoint.geopoint, geofence.polygons)) {
        trackingResult.inside.push(geofence.id);
      }
    });

    self.__data.trackers[trackingpoint.actorId].check(trackingResult);

    return trackingResult;
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
