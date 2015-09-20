// takes a json string, stream in GeoJSON features and stream out features with
// the json merged into the properties

var es = require('event-stream');
var fs = require('fs');
var JSONStream = require('JSONStream');
var minimist = require('minimist');
var merge = require('lodash.merge');

var argv = minimist(process.argv.slice(2));

var mergeObject = JSON.parse(argv['_'][0]);


process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.map(function(feature, cb) {
    feature.properties = merge(mergeObject, feature.properties);
    cb(null, feature);
  }))
  .pipe(JSONStream.stringify(false))
  .pipe(process.stdout);
