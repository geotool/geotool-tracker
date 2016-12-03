'use strict';

var EventEmitter = require('events');
var util = require('util');
var turf = require('turf');
var TrackingTrigger = require('./tracking-trigger.js');

var debug = require('./utils/debug.js');
var debuglog = debug('geotool:trackingCurator');

var Clazz = function Clazz(params) {
  debuglog.isEnabled && debuglog(' + constructor begin ...');

  EventEmitter.call(this);
  params = params || {};
  params.package = params.package || {};

  var self = this;
  self.__data = {
    geofences: params.geofences || [],
    trackers: {}
  }

  debuglog.isEnabled && debuglog(' - constructor end!');
};

util.inherits(Clazz, EventEmitter);

Clazz.prototype.check = function(trackingpoint, ctx) {
  var self = this;
  ctx = ctx || {};

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

  self.__data.geofences.forEach(function(geofence) {
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

module.exports = Clazz;
