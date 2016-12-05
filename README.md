# geotool

> Node.js Geometry Toolkit

## Install

```shell
npm install --save geotool
```

## Usage

Open the terminal in which the `PROJECT_DIR` is the current working directory. Run `node`, copy & paste the below code stuff into the prompt to execute:

```javascript
var Tracker = require('geotool').Tracker;

var tracker = new Tracker({
  geofences: [{
    id: "myGeofence",
    polygons: [
      [
        [105.6500244140625,21.017854937856118],
        [105.80108642578125,21.12293562133021],
        [106.06201171875,21.09218798704055],
        [106.14166259765625,20.917831371761558],
        [106.05377197265625,20.666195922002352],
        [105.6939697265625,20.58136735381001],
        [105.49346923828125,20.715015145512098],
        [105.6500244140625,21.017854937856118]
      ], [
        [106.18011474609375,21.386589909132898],
        [106.41632080078124,21.40449100321618],
        [106.435546875,21.08706276222476],
        [106.04278564453125,21.248422235627014],
        [106.18011474609375,21.386589909132898]
      ]
    ]
  }]
});

tracker.on('change', function(data) {
  console.log('Event: %s', JSON.stringify(data));
});

var routes = [
  {"actorId":"actor_1","geopoint":[105.94253540039062,20.631298224310687]},
  {"actorId":"actor_1","geopoint":[105.94163417816162,20.634310424226808]},
  {"actorId":"actor_1","geopoint":[105.94094753265381,20.637161918535867]},
  {"actorId":"actor_1","geopoint":[105.94056129455566,20.639169981048425]},
  {"actorId":"actor_1","geopoint":[105.94000339508057,20.640776411973093]},
  {"actorId":"actor_1","geopoint":[105.93948841094969,20.64286474681087]},
  {"actorId":"actor_1","geopoint":[105.93901634216309,20.644953052973822]},
  {"actorId":"actor_1","geopoint":[105.93828678131104,20.647563395349877]}
];

routes.map(function(trackingpoint) {
  return tracker.check(trackingpoint);
}).forEach(function(result) {
  console.log('Result: %s', JSON.stringify(result));
});
```

The terminal will display the result:

```shell
Event: {"actorId":"actor_1","inside":["myGeofence"],"events":[{"type":"ENTER","geofenceId":"myGeofence"}]}
Result: {"actorId":"actor_1","inside":[],"events":[]}
Result: {"actorId":"actor_1","inside":[],"events":[]}
Result: {"actorId":"actor_1","inside":[],"events":[]}
Result: {"actorId":"actor_1","inside":[],"events":[]}
Result: {"actorId":"actor_1","inside":["myGeofence"],"events":[{"type":"ENTER","geofenceId":"myGeofence"}]}
Result: {"actorId":"actor_1","inside":["myGeofence"],"events":[]}
Result: {"actorId":"actor_1","inside":["myGeofence"],"events":[]}
Result: {"actorId":"actor_1","inside":["myGeofence"],"events":[]}
```
