var map;

L.mapbox.accessToken = 'pk.eyJ1IjoibWF0ZW9jb2RlcyIsImEiOiJUZVVZSVBvIn0.PkZleldXk_6KCuoGhx6-CA';

$.getJSON('/data/city_of_austin_parks.geojson', function (parks) {
    $.getJSON('https://maptimeatx.github.io/intro-to-turf/data/austin_districts.geojson', function (districts) {
        setupMap();
        main(parks, districts);
    });
});

var districtStyles = function(){
	return {
		fillColor: "transparent",
		color: "black",
		opacity: 0.5,
		weight: 1,
		fillOpacity: 0,
	}
};

var parkStyles = function(){
	return {
		fillColor: '#56DD54',
		weight: 1,
		opacity: 0.7,
		color: '#44A048',
		fillOpacity: 0.7
	};
}

function main(parks, districts) {
    console.log("parks:", parks);
    console.log("districts:", districts);
    //YOUR MISSION: Use methods from turf to
    // have fun with the landmark and district datasets.
    //
    //You can use the showResult function to display
    //  some text below the map.
    //
    //You can use the showOnMap function to display your
    // GeoJSON result on the map with popups.

    //Example: Show the total area of all districts
    var totalArea = turf.area(districts);
    showResult(totalArea);

    //Example: Find the area of each district
    for (var i=0; i < districts.features.length; i++) {
        var district = districts.features[i];
        var districtArea = turf.area(district);
        district.properties.Area = districtArea;
    }
    // showLayerOnMap(districts, districtStyles);
    showLayerOnMap(parks, parkStyles);

  	// Using Turf.js to draw buffers


    var p1 = parks.features[60]
    var p1Buff = turf.buffer(p1, 0.25, "miles");
    showOnMap(p1Buff);




    //Some suggestions:
    //  - EASY: Find the center of Austin based on the districts
    //  - EASY: Combine (merge) the districts into a single feature
    //  - EASY: Find the number of landmarks in each district
    //  - MEDIUM: Find all the landmarks in district 9
    //  - HARD: Find the centroid of EACH district
}

function showResult(any) {
    $('.aside').text("Result: " + any.toString());
}

//This function shows the given features as a layer on the map.
//It also adds popups to each of the features.
//You should not need to modify this function -- it's here as a handy helper
function showOnMap(geojsonFeatures) {
    if (!geojsonFeatures) { return; }
    L.geoJson(geojsonFeatures, {
        onEachFeature: function (feature, layer) {
            var text =  [];
            for (prop in feature.properties) {
                if (hasOwnProperty.call(feature.properties, prop)) {
                    text.push("<b>" + prop + "</b>: " + feature.properties[prop]);
                }
              }
            if (text.length) {
                layer.bindPopup(text.join('<br>'));
            }
        }
    }).addTo(map);
}

function showLayerOnMap(geojsonFeatures, styles) {
    if (!geojsonFeatures) { return; }
    L.geoJson(geojsonFeatures, {
    		style: styles,
        onEachFeature: function (feature, layer) {
            var text =  [];
            for (prop in feature.properties) {
                if (hasOwnProperty.call(feature.properties, prop)) {
                    text.push("<b>" + prop + "</b>: " + feature.properties[prop]);
                }
              }
            if (text.length) {
                layer.bindPopup(text.join('<br>'));
            }
        }
    }).addTo(map);
}


//This function sets up the map. It does not need to be modified.
function setupMap() {
    map = L.map('map', {
        center: [30.26715, -97.74306],
        zoom: 11,
        layers: [L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        })]
    });
}
