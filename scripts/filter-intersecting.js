// tiny script that takes a GeoJSON feature collection and returns individual
// features

var es = require('event-stream');
var fs = require('fs');
var JSONStream = require('JSONStream');
var minimist = require('minimist');
var turf = require('turf');

var argv = minimist(process.argv.slice(2));

var filterFeaturesPath = argv['_'][0];


// returns true if poly1 intersects poly2, else false
function intersects (poly1, poly2) {
  try {
    var intersection = turf.intersect(poly1, poly2);
    return intersection !== undefined;
  } catch (err) {
    console.error(err);
    return true;
  }
}


fs.createReadStream(filterFeaturesPath)
  .pipe(JSONStream.parse())
  .pipe(es.writeArray(function(err, filterFeatures) {
    process.stdin
      .pipe(JSONStream.parse())
      .pipe(es.map(function(feature, cb) {
        filterFeatures.forEach(function (filterFeature) {
          if (intersects(feature, filterFeature)) {
            // if intersects with one of the filter features, then filter it out
            cb();
          }
        });

        // we found no intersections so this feature is good to pass along
        cb(null, feature);
      }))
      .pipe(JSONStream.stringify(false))
      .pipe(process.stdout)
      .on('error', function(err) {
        console.log(err);
      });
  }));
