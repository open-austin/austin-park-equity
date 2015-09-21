// This was putting park data on the map
// var PARK_COLOR = '#2DCB70';
// var parkData;
// d3.json("data/deprecated/parks.json", function(error, json) {
//   if (error) return console.warn(error);
//   parkData = json;
//   _.each(parkData,function(park){
//   	var coords = flipCoords(park.geometry);
//     // var shape = L.mapbox.featureLayer().setGeoJSON(turf.polygon(coords));
//     // shape.addTo(map);
//     L.polygon(coords, {color:PARK_COLOR, fillColor: PARK_COLOR, weight: 1}).addTo(map);
//     var parkToBuffer = turf.polygon(park.geometry);
//     //console.log(parkToBuffer);
//     var buffer = turf.buffer(parkToBuffer, 0.25, 'miles');
//     var collection = turf.featurecollection([buffer, parkToBuffer]);
//     //collection.addTo(map);
//     console.log(collection);
//   });
// });

// This was creating the map
// map = L.map('map-canvas').setView([30.2500, -97.7500], 10);

// map.data.setStyle({
//     fillColor: 'blue'
// });

// This was adding a tile layer
// L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
//             attribution: '&copy; Map tiles by MAPC',
//             minZoom: 0,
//             maxZoom: 17,
//             id: 'drmaples.ipbindf8'
//         }).addTo(map);

console.log(censusData[0]);

function getColor(d) {
    return d < 20  ? '#800026' :
           d < 25  ? '#BD0026' :
           d < 30  ? '#E31A1C' :
           d < 35  ? '#FC4E2A' :
           d < 40  ? '#FD8D3C' :
           d < 45  ? '#FEB24C' :
           d < 50  ? '#FED976' :
                     '#FFEDA0';
}


function style(age) {
    return {
        fillColor: getColor(parseInt(age ? age : '0')),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var tractCallback = function(err,response) {
    _.each(response,function(feature){
    	var props = feature.properties;
		var coords = flipCoords(feature.geometry.coordinates[0]);
		L.polygon(coords, {color: "#A6CFD5", weight: 1}).addTo(map);
		L.polygon(coords, style(props.age)).addTo(map).bringToBack();

    });
};

function flipCoords(coords){
	return coords.map(function(data){
		return [data[1],data[0]];
	});
}

var affordableHousing;

$.when($.get('https://data.austintexas.gov/resource/wa68-dsqa.json')).then(function( data, textStatus, jqXHR ) {
 console.log( jqXHR.response );
 console.log( data );
 affordableHousing = data;
})

// censusModule.GEORequest(request, callback);

d3.json("data/geojson/tracts.json", tractCallback);
