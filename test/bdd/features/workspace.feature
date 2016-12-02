Feature: Temporary workspace

Scenario: Check whether a geopoint belongs or not to a geofence
  Given a list of geofences that each contains a list of geometry polygon
    | id       | geofence |
    | example1 | [{"id":"A1111","polygon":{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-112.074279,40.52215],[-112.074279,40.853293],[-111.610107,40.853293],[-111.610107,40.52215],[-112.074279,40.52215]]]}}}] |
