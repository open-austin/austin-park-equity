// d3.csv("/data/district_demographic_data.csv", function (d) {
//   return {
//     renterHousing : +d.renterOccupiedHousingUnits2010,
//     totalHousing : +d.totalOccupiedHousingUnits2010
//   };
// }, function(data){
//   // console.log(data[0]);

// });

// d3.json("/data/district_demographics.json", function(data) {
//   console.log(data[0]);
// });

queue()
  .defer(d3.json, "/data/district-demographics.json")
  .await(analyze);

// d3.json

function analyze(error, distDemosJson) {
  if(error) {console.log(error); }

  var pop18Array = [];

  for (var i = 0; i <= distDemosJson.length - 1; i++) {
    distDemosJson[i].popUnder18 = (distDemosJson[i].ageUnderTen2010 +
                      distDemosJson[i].ageTenToSeventeen2010);
    pop18Array.push( distDemosJson[i].popUnder18 );
    // console.log(popUnder18);
  };
  console.log(pop18Array);
}

