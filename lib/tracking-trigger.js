'use strict';

var EventEmitter = require('events');
var util = require('util');

var clazz = require('./utils/clazz.js');
var commons = require('geotool-commons');
var debuglog = commons.getDebugger('geotool:trackingCurator');

var Clazz = function(params) {
  debuglog && debuglog(' + constructor begin ...');

  EventEmitter.call(this);
  params = params || {};

  clazz.defineProperties.call(this, {
    context: {
      id: params.actorId,
      latest: null
    }
  });

  debuglog && debuglog(' - constructor end!');
};

util.inherits(Clazz, EventEmitter);

Clazz.prototype.check = function(trackingResult) {
  var self = this;
  if (self.context.latest) {
    var i;
    var movement = {};
    for(i=0; i<trackingResult.inside.length; i++) {
      if (movement[trackingResult.inside[i]] == null) {
        movement[trackingResult.inside[i]] = 0;
      }
      movement[trackingResult.inside[i]] += 1;
    }
    for(i=0; i<self.context.latest.inside.length; i++) {
      if (movement[self.context.latest.inside[i]] == null) {
        movement[self.context.latest.inside[i]] = 0;
      }
      movement[self.context.latest.inside[i]] -= 1;
    }
    var movementKeys = Object.keys(movement);
    for(i=0; i<movementKeys.length; i++) {
      if (movement[movementKeys[i]] > 0) {
        trackingResult.events.push({
          type: 'ENTER',
          geofenceId: movementKeys[i],
        });
        self.emit('change', trackingResult);
      } else if (movement[movementKeys[i]] < 0) {
        trackingResult.events.push({
          type: 'LEAVE',
          geofenceId: movementKeys[i],
        });
        self.emit('change', trackingResult);
      }
    }
  }
  self.context.latest = trackingResult;
};

module.exports = Clazz;
