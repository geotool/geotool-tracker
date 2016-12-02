'use strict';

var EventEmitter = require('events');
var util = require('util');

var Clazz = function(params) {
  EventEmitter.call(this);
  params = params || {};

  var self = this;
  self.__data = {
    id: params.actorId,
    latest: null
  };

  self.check = function(trackingResult) {
    if (self.__data.latest) {
      var i;
      var movement = {};
      for(i=0; i<trackingResult.inside.length; i++) {
        if (movement[trackingResult.inside[i]] == null) {
          movement[trackingResult.inside[i]] = 0;
        }
        movement[trackingResult.inside[i]] += 1;
      }
      for(i=0; i<self.__data.latest.inside.length; i++) {
        if (movement[self.__data.latest.inside[i]] == null) {
          movement[self.__data.latest.inside[i]] = 0;
        }
        movement[self.__data.latest.inside[i]] -= 1;
      }
      var movementKeys = Object.keys(movement);
      for(i=0; i<movementKeys.length; i++) {
        if (movement[movementKeys[i]] > 0) {
          trackingResult.events.push({
            type: 'ENTER',
            geofenceId: movementKeys[i],
          });
        } else if (movement[movementKeys[i]] < 0) {
          trackingResult.events.push({
            type: 'LEAVE',
            geofenceId: movementKeys[i],
          });
        }
      }
    }
    self.__data.latest = trackingResult;
  }
};

util.inherits(Clazz, EventEmitter);

module.exports = Clazz;
