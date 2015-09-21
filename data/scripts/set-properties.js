// takes a json string, stream in GeoJSON features and stream out features with
// the json merged into the properties

var es = require('event-stream');
var JSONStream = require('JSONStream');
var merge = require('lodash.merge');


process.stdin
    .pipe(JSONStream.parse())
    .pipe(es.map(function(feature, cb) {
        feature.properties = merge(mergeObject, feature.properties);
        cb(null, feature);
    }))
    .pipe(JSONStream.stringify(false))
    .pipe(process.stdout);
