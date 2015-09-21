// stream in feature collections -> stream out individual features

var JSONStream = require('JSONStream');


process.stdin
    .pipe(JSONStream.parse('features.*'))
    .pipe(JSONStream.stringify(false))
    .pipe(process.stdout);
