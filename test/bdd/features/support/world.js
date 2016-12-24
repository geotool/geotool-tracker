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

  var parseTableObjects = function(rules, objectArray) {
    rules = rules || {};
    rules.stringFields = rules.stringFields || ['id', 'actorId'];
    rules.objectFields = rules.objectFields || ['polygons', 'geopoint', 'extraInfo'];
    objectArray = objectArray || [];
    return lodash.map(objectArray, function(object) {
      try {
        var parsedObject = {};
        rules.stringFields.forEach(function(fieldName) {
          parsedObject[fieldName] = object[fieldName];
        });
        rules.objectFields.forEach(function(fieldName) {
          if (typeof(object[fieldName]) == 'string' && object[fieldName].length > 0) {
            parsedObject[fieldName] = JSON.parse(object[fieldName]);
          }
        });
        return parsedObject;
      } catch(exception) {
        return {}
      }
    });
  }

  this.parseGeofences = parseTableObjects.bind(this, {
    stringFields: ['id'],
    objectFields: ['polygons']
  });

  this.parseTrackingpoints = parseTableObjects.bind(this, {
    stringFields: ['actorId'],
    objectFields: ['geopoint', 'extraInfo']
  });

  this.parseTrackingResult = parseTableObjects.bind(this, {
    stringFields: ['actorId'],
    objectFields: ['events', 'inside', 'extraInfo']
  });
};

module.exports.World = World;
