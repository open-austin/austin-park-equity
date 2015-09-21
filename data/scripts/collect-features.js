// stream in individual features -> stream out a featurecollection

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
