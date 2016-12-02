'use strict';

var events = require('events');
var util = require('util');

events.EventEmitter.defaultMaxListeners = 100;

var Promise = require('bluebird');
var lodash = require('lodash');
var debug = require('debug');
var debuglog = debug('geotool:test:bdd:world');

var Geotool = require('../../../../index.js')();

var World = function World(callback) {

  this.Geotool = Geotool;
  this.geotoolInstance = {};

  this.parseRegistration = function (objectArray) {
    objectArray = objectArray || [];
    return lodash.map(objectArray, function(object) {
      try {
        return {
          id: object.id,
          geofences: JSON.parse(object.geofences)
        }
      } catch(exception) {
        return {}
      }
    });
  };
};

module.exports.World = World;
