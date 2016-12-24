Feature: Tracking event with extra information object

Scenario: Tracing the enter & leave geometry polygon with extra information object
  Given a list of geofences that each contains a list of geometry polygon
    | id        | polygons |
    | geofence2 | [[[105.6500244140625,21.017854937856118],[105.80108642578125,21.12293562133021],[106.06201171875,21.09218798704055],[106.14166259765625,20.917831371761558],[106.05377197265625,20.666195922002352],[105.6939697265625,20.58136735381001],[105.49346923828125,20.715015145512098],[105.6500244140625,21.017854937856118]],[[106.18011474609375,21.386589909132898],[106.41632080078124,21.40449100321618],[106.435546875,21.08706276222476],[106.04278564453125,21.248422235627014],[106.18011474609375,21.386589909132898]]] |
  When the actors go along the routes
    | actorId | geopoint | extraInfo |
    | actor_1 | [105.94253540039062,20.631298224310687] | { "price": 10.37 } |
    | actor_1 | [105.94163417816162,20.634310424226808] | { "price": 11.17 } |
    | actor_1 | [105.94094753265381,20.637161918535867] | { "price": 10.56 } |
    | actor_1 | [105.94056129455566,20.639169981048425] | { "price": 19.21 } |
    | actor_1 | [105.94000339508057,20.640776411973093] | { "price": 13.02 } |
    | actor_1 | [105.93948841094969,20.64286474681087]  | { "price": 18.97 } |
    | actor_1 | [105.93901634216309,20.644953052973822] | { "price": 28.11 } |
    | actor_1 | [105.93828678131104,20.647563395349877] | { "price": 11.78 } |
  Then the state of tracking points should be
    | actorId | events                                         | inside        | extraInfo |
    | actor_1 | []                                             | []            | { "price": 10.37 } |
    | actor_1 | []                                             | []            | { "price": 11.17 } |
    | actor_1 | []                                             | []            | { "price": 10.56 } |
    | actor_1 | []                                             | []            | { "price": 19.21 } |
    | actor_1 | [{"type": "ENTER", "geofenceId": "geofence2"}] | ["geofence2"] | { "price": 13.02 } |
    | actor_1 | []                                             | ["geofence2"] | { "price": 18.97 } |
    | actor_1 | []                                             | ["geofence2"] | { "price": 28.11 } |
    | actor_1 | []                                             | ["geofence2"] | { "price": 11.78 } |
  And the change event has been triggered '1' times
    | actorId | events                                         | inside        | extraInfo |
    | actor_1 | [{"type": "ENTER", "geofenceId": "geofence2"}] | ["geofence2"] | { "price": 13.02 } |
