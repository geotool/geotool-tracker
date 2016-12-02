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
        var GeotoolClazz = self.Geotool;
        self.geotoolInstance[rd.id] = new GeotoolClazz({
          geofences: rd.geofences
        });
      });
      resolve();
    });
  });

  this.When(/^I request the method '([^']*)' of instance '([^']*)' with parameter: '([^']*)'$/, function (methodName, geotoolName, parameters) {
    var self = this;
    parameters = JSON.parse(parameters);
    return Promise.resolve().then(function() {
      if (!lodash.isObject(self.geotoolInstance[geotoolName]) || !lodash.isFunction(self.geotoolInstance[geotoolName][methodName])) {
        return Promise.reject({ message: 'Invalid parameters'});
      }
      return self.geotoolInstance[geotoolName][methodName].apply(self.geotoolInstance[geotoolName], parameters);
    }).then(function(result) {
      self.functionResult = result;
    });
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
