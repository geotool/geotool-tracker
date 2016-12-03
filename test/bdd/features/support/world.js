'use strict';

var events = require('events');
var util = require('util');

events.EventEmitter.defaultMaxListeners = 100;

var Promise = require('bluebird');
var lodash = require('lodash');
var debug = require('debug');
var debuglog = debug('geotool:test:bdd:world');

var Geotool = require('../../../../index.js').Tracker;

var World = function World(callback) {

  this.Geotool = Geotool;
  this.geotoolInstance = null;
  this.trackingResult = [];
  this.changeEventResult = [];

  this.parseGeofences = function (objectArray) {
    objectArray = objectArray || [];
    return lodash.map(objectArray, function(object) {
      try {
        return {
          id: object.id,
          polygons: JSON.parse(object.polygons)
        }
      } catch(exception) {
        return {}
      }
    });
  };

  this.parseTrackingpoints = function (objectArray) {
    objectArray = objectArray || [];
    return lodash.map(objectArray, function(object) {
      try {
        return {
          actorId: object.actorId,
          geopoint: JSON.parse(object.geopoint)
        }
      } catch(exception) {
        return {}
      }
    });
  };

  this.parseTrackingResult = function (objectArray) {
    objectArray = objectArray || [];
    return lodash.map(objectArray, function(object) {
      try {
        return {
          actorId: object.actorId,
          inside: JSON.parse(object.inside),
          events: JSON.parse(object.events)
        }
      } catch(exception) {
        return {}
      }
    });
  };
};

module.exports.World = World;
