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

  var validationResult = validateGeofenceCollection(params.geofences);
  if (!validationResult.success) {
    throw new Error('invalid GeofenceCollection');
  }

  self.__data = {
    geofences: standardizeGeofenceCollection(params.geofences),
    trackers: {}
  }

  debuglog.isEnabled && debuglog(' - constructor end!');
};

util.inherits(Clazz, EventEmitter);

Clazz.prototype.check = function(trackingpoint, ctx) {
  var self = this;
  ctx = ctx || {};

  var result = validateTrackingpoint(trackingpoint, ctx);
  if (!result.success) {
    return { actorId: trackingpoint.actorId, success: false }
  }

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

  var geopoint = standardizeGeopoint(trackingpoint.geopoint, ctx);
  self.__data.geofences.forEach(function(geofence) {
    if (turf.inside(geopoint, geofence.polygons)) {
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

var geofenceCollectionSchema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "polygons": {
        "oneOf": [{
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "type": "array",
              "items": {
                "type": "number"
              },
              "minItems": 2,
              "maxItems": 2
            },
            "minItems": 3
          },
          "minItems": 1
        }, {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": ["Feature"]
            },
            "geometry": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["Polygon"]
                },
                "coordinates": {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "minItems": 2,
                      "maxItems": 2
                    },
                    "minItems": 3
                  },
                  "minItems": 1
                }
              },
              "required": ["type", "coordinates"]
            }
          },
          "required": ["type", "geometry"]
        }]
      }
    },
    "required": ["id", "polygons"]
  }
}

var validateGeofenceCollection = (function(validatorType) {
  debuglog.isEnabled && debuglog(' - validatorType: %s', validatorType || 'ajv');
  if (validatorType == 'jsonschema') {
    var Validator = require('jsonschema').Validator;
    var validator = new Validator();
    return function(geofenceCollection, ctx) {
      var result = validator.validate(geofenceCollection, geofenceCollectionSchema);
      var valid = (result.errors.length == 0);
      if (result.errors.length > 0) {
        debuglog.isEnabled && debuglog(' - invalid geofenceCollection: %s', JSON.stringify(result));
      }
      debuglog.isEnabled && debuglog(' - validate(%s) -> %s', JSON.stringify(geofenceCollection), valid);
      return { success: valid }
    }
  } else {
    var Ajv = require('ajv');
    var ajv = new Ajv();
    var validator = ajv.compile(geofenceCollectionSchema);
    return function(geofenceCollection, ctx) {
      var valid = validator(geofenceCollection);
      debuglog.isEnabled && debuglog(' - validate(%s) -> %s', JSON.stringify(geofenceCollection), valid);
      return { success: valid }
    }
  }
})();

var standardizeGeofenceCollection = function(geofences) {
  geofences = geofences || [];
  geofences.forEach(function(geofence) {
    geofence.polygons = standardizeGeofence(geofence.polygons);
  });
  return geofences;
}

var standardizeGeofence = function(geofence, ctx) {
  if (geofence instanceof Array) {
    return {"type":"Feature","geometry":{"type":"Polygon","coordinates": geofence}};
  }
  return geofence;
}

var trackingpointSchema = {
  "type": "object",
  "properties": {
    "actorId": {
      "type": "string"
    },
    "geopoint": {
      "oneOf": [{
        "type": "array",
        "items": {
          "type": "number"
        },
        "minItems": 2,
        "maxItems": 2
      }, {
        "type": "object",
        "properties": {
          "lon": {
            "type": ["number"]
          },
          "lat": {
            "type": ["number"]
          }
        },
        "required": ["lon", "lat"]
      }, {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["Feature"]
          },
          "geometry": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": ["Point"]
              },
              "coordinates": {
                "type": "array",
                "items": {
                  "type": "number"
                },
                "minItems": 2,
                "maxItems": 2
              }
            }
          }
        },
        "required": ["type", "geometry"]
      }]
    }
  },
  "required": ["actorId", "geopoint"]
}

var validateTrackingpoint = (function(validatorType) {
  debuglog.isEnabled && debuglog(' - validatorType: %s', validatorType || 'ajv');
  if (validatorType == 'jsonschema') {
    var Validator = require('jsonschema').Validator;
    var validator = new Validator();
    return function(trackingpoint, ctx) {
      var result = validator.validate(trackingpoint, trackingpointSchema);
      var valid = (result.errors.length == 0);
      if (result.errors.length > 0) {
        debuglog.isEnabled && debuglog(' - invalid trackingpoint: %s', JSON.stringify(result, null, 2));
      }
      debuglog.isEnabled && debuglog(' - validate(%s) -> %s', JSON.stringify(trackingpoint), valid);
      return { success: valid }
    }
  } else {
    var Ajv = require('ajv');
    var ajv = new Ajv();
    var trackingpointValidate = ajv.compile(trackingpointSchema);
    return function(trackingpoint, ctx) {
      var valid = trackingpointValidate(trackingpoint);
      debuglog.isEnabled && debuglog(' - validate(%s) -> %s', JSON.stringify(trackingpoint), valid);
      return { success: valid }
    }
  }
})();

var standardizeGeopoint = function(geopoint, ctx) {
  if (ctx.geopointFormat) {
    // specifies the geopoint-format
    if (ctx.geopointFormat == 'array') {
      return {"type":"Feature","geometry":{"type":"Point","coordinates": geopoint}};
    } else if (ctx.geopointFormat == 'object') {
      var geopoint = [geopoint.lon, geopoint.lat];
      return {"type":"Feature","geometry":{"type":"Point","coordinates": geopoint}};
    }
    return geopoint;
  } else {
    // detects the geopoint-format
    if (geopoint instanceof Array) {
      return {"type":"Feature","geometry":{"type":"Point","coordinates": geopoint}};
    } else if (geopoint.lon && geopoint.lat) {
      var geopoint = [geopoint.lon, geopoint.lat];
      return {"type":"Feature","geometry":{"type":"Point","coordinates": geopoint}};
    }
    return geopoint;
  }
}

module.exports = Clazz;
