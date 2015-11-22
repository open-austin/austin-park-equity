var _ = require('lodash');
var fs = require('fs');
var http = require('http');
var extract = require('extract-zip');

// ------------
// Step 1: Make it easy to Add or Remove Tables

var tablesArray = [
  "B27001", // Health Insurance Coverage Status by Sex by Age -- ACS 2013 5yr
  "B17001", // Poverty Status in the Past 12 Months by Sex by Age -- ACS 2013 5yr
  "B01001", // Sex by Age -- ACS 2013 5yr
  "B01003"  // Total Population -- ACS 2013 5yr
];

// ------------
// Step 2: Create directories with csv and metatable for each table

var pullCensusReporterData = function(tablesArray){
  _.forEach(tablesArray, function(tableId){
    var rawPath = './data/temp/' + tableId + '.zip';
    var targetPath = './data/raw/census';
    var baseUrl = 'http://api.censusreporter.org/1.0/data/download/latest?table_ids=' + tableId + '&geo_ids=16000US4805000,140|16000US4805000&format=csv'

    var file = fs.createWriteStream(rawPath);
    http.get(baseUrl, function(response){
      response.pipe(file).on('finish', function(){
        extract(rawPath, {dir: targetPath}, function (err) {
          if (err) { throw err };
          console.log("Data downloaded from US Census table " + tableId + " and extracted to " + targetPath);
        });
      });
    });
  });
}

pullCensusReporterData(tablesArray);

// ------------
// Step 3: Bring down geojson for geo_ids

// ------------
// Step 4: Merge data from each table into geojson
