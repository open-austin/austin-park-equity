// stream in osm features -> stream out same features but make the properties
// contain only the tags

var es = require('event-stream');
var JSONStream = require('JSONStream');


process.stdin
  .pipe(JSONStream.parse())
  .pipe(es.map(function(feature, cb) {
    feature.properties = feature.properties.tags;
    cb(null, feature);
  }))
  .pipe(JSONStream.stringify(false))
  .pipe(process.stdout);
