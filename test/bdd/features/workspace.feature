Feature: Temporary workspace

Scenario: Check whether a geopoint belongs or not to a geofence
  Given a list of geofences that each contains a list of geometry polygon
    | id        | polygons |
    | geofence1 | {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-112.074279,40.52215],[-112.074279,40.853293],[-111.610107,40.853293],[-111.610107,40.52215],[-112.074279,40.52215]]]}} |
  When I request the method 'stats' of geotool instance with parameter: '[]'
  Then the result should contain the object '{ "total": 1 }'

Scenario: Tracing the enter & leave geometry polygon
  Given a list of geofences that each contains a list of geometry polygon
    | id        | polygons |
    | geofence1 | {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-112.074279,40.52215],[-112.074279,40.853293],[-111.610107,40.853293],[-111.610107,40.52215],[-112.074279,40.52215]]]}} |
    | geofence2 | {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[105.6500244140625,21.017854937856118],[105.80108642578125,21.12293562133021],[106.06201171875,21.09218798704055],[106.14166259765625,20.917831371761558],[106.05377197265625,20.666195922002352],[105.6939697265625,20.58136735381001],[105.49346923828125,20.715015145512098],[105.6500244140625,21.017854937856118]],[[106.18011474609375,21.386589909132898],[106.41632080078124,21.40449100321618],[106.435546875,21.08706276222476],[106.04278564453125,21.248422235627014],[106.18011474609375,21.386589909132898]]]}} |
  When the actors go along the routes
    | actorId | geopoint |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94253540039062,20.631298224310687]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94163417816162,20.634310424226808]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94094753265381,20.637161918535867]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94056129455566,20.639169981048425]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94000339508057,20.640776411973093]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93948841094969,20.64286474681087]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93901634216309,20.644953052973822]}} |
    | actor_1 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93828678131104,20.647563395349877]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.92421054840088,21.11036509270176]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.9261417388916,21.108563496570692]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.92700004577635,21.107722744225367]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.9282875061035,21.106601733690066]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93043327331543,21.104720018401846]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93232154846191,21.10259805552627]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93360900878906,21.101036591776115]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.93581914901733,21.10295839098265]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.9380292892456,21.10484012860101]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.9397029876709,21.106241407077153]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94047546386717,21.106861969033197]}} |
    | actor_2 | {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[105.94146251678465,21.107702726254338]}} |
  Then the state of tracking points should be
    | actorId | events                                         | inside        |
    | actor_1 | []                                             | []            |
    | actor_1 | []                                             | []            |
    | actor_1 | []                                             | []            |
    | actor_1 | []                                             | []            |
    | actor_1 | [{"type": "ENTER", "geofenceId": "geofence2"}] | ["geofence2"] |
    | actor_1 | []                                             | ["geofence2"] |
    | actor_1 | []                                             | ["geofence2"] |
    | actor_1 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | []            |
    | actor_2 | []                                             | []            |
    | actor_2 | [{"type": "ENTER", "geofenceId": "geofence2"}] | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | []                                             | ["geofence2"] |
    | actor_2 | [{"type": "LEAVE", "geofenceId": "geofence2"}] | []            |
    | actor_2 | []                                             | []            |
