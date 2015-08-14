// tiny script that takes a GeoJSON feature collection and returns individual
// features

var es = require('event-stream');
var JSONStream = require('JSONStream');
var turf = require('turf');


process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.writeArray(function(err, features) {
    var fc = turf.featurecollection(features);
    es.readArray([fc])
      .pipe(JSONStream.stringify(false))
      .pipe(process.stdout);
  }));

