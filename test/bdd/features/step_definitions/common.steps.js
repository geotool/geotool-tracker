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
      var Geotool = self.Geotool;
      self.geotoolInstance = new Geotool({
        geofences: self.parseGeofences(table.hashes())
      });
      self.geotoolInstance.on('change', function(data) {
        debuglog.isEnabled && debuglog(' - state change: %s', JSON.stringify(data));
      });
      resolve();
    });
  });

  this.When(/^I request the method '([^']*)' of geotool instance with parameter: '([^']*)'$/, function (methodName, parameters) {
    var self = this;
    parameters = JSON.parse(parameters);
    return Promise.resolve().then(function() {
      if (!lodash.isObject(self.geotoolInstance) || !lodash.isFunction(self.geotoolInstance[methodName])) {
        return Promise.reject({ message: 'Invalid parameters'});
      }
      return self.geotoolInstance[methodName].apply(self.geotoolInstance, parameters);
    }).then(function(result) {
      self.functionResult = result;
    });
  });

  this.When('the actors go along the routes', function (table) {
    var self = this;
    var routes = self.parseTrackingpoints(table.hashes());
    return Promise.mapSeries(routes, function(route) {
      return self.geotoolInstance.trace(route);
    }).then(function(result) {
      self.trackingResult = result;
      return true;
    });
  });

  this.Then('the state of tracking points should be', function (table) {
    var self = this;
    return Promise.resolve('pending');
  });


  this.Then(/^the result should contain the object '([^']*)'$/, function (expectedResult) {
    var self = this;
    expectedResult = JSON.parse(expectedResult);
    return Promise.resolve().then(function() {
      debuglog.isEnabled && debuglog(' - self.functionResult: %s', JSON.stringify(self.functionResult));
      debuglog.isEnabled && debuglog(' - expectedResult: %s', JSON.stringify(expectedResult));
      assert.isTrue(lodash.isMatch(self.functionResult, expectedResult));
      return true;
    });
  });
};
