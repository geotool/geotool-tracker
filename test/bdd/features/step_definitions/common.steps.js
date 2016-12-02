'use strict';

var util = require('util');
var Devebot = require('devebot');
var Promise = Devebot.require('bluebird');
var lodash = Devebot.require('lodash');
var assert = require('chai').assert;

var debug = Devebot.require('debug');
var debuglog = debug('geotool:test:bdd:steps:common');

module.exports = function() {
  this.World = require('../support/world.js').World;

  this.Given(/^a list of geofences that each contains a list of geometry polygon$/, function (table) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var rds = self.parseRegistration(table.hashes());
      lodash.forEach(rds, function(rd) {
        self.geotoolInstance[rd.id] = new self.Geotool({
          geofence: rd.geofence
        });
      });
      resolve();
    });
  });
};
