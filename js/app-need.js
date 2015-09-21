var config = require("../config.json");
var L = require("leaflet");
require("leaflet-providers");
var $ = require("jquery");

var grayscale = L.tileLayer.provider('CartoDB.Positron');

var map = L.map('map', {
    center: config.map_center, //Austin!
    zoom: 12,
    scrollWheelZoom: false,
    layers: [grayscale]
});

var baseMaps = {
    "Grayscale": grayscale
};

// adding parks shapefiles to Map
var parkLayer = L.geoJson(parks, {
    style: function style(feature) {
        return {
            fillColor: '#56DD54',
            weight: 1,
            opacity: 0.7,
            color: '#44A048',
            fillOpacity: 0.7
        };
    },
    onEachFeature: onEachParkFeature
}).addTo(map);

window.scores = [];
// higher value = more need
for (var i = 0; i <= censusTract.length - 1; i++) {
    current = censusTract[i].demographics;

    // Age Under 19
    censusTract[i].demographics.ageRatioUnder19 < 0.10 ? current.needScore = 0 :
        censusTract[i].demographics.ageRatioUnder19 < 0.15 ? current.needScore = 1 :
            censusTract[i].demographics.ageRatioUnder19 < 0.20 ? current.needScore = 2 :
                censusTract[i].demographics.ageRatioUnder19 < 0.25 ? current.needScore = 3 :
                    censusTract[i].demographics.ageRatioUnder19 < 0.30 ? current.needScore = 4 :
                        censusTract[i].demographics.ageRatioUnder19 < 0.35 ? current.needScore = 5 :
                            censusTract[i].demographics.ageRatioUnder19 < 0.40 ? current.needScore = 6 :
                                current.needScore = 7;

    // Health Insurance Coverage
    censusTract[i].demographics.healthInsuranceCoverage > 40 ? current.needScore += 0 :
        censusTract[i].demographics.healthInsuranceCoverage > 35 ? current.needScore += 1 :
            censusTract[i].demographics.healthInsuranceCoverage > 30 ? current.needScore += 2 :
                censusTract[i].demographics.healthInsuranceCoverage > 25 ? current.needScore += 3 :
                    censusTract[i].demographics.healthInsuranceCoverage > 20 ? current.needScore += 4 :
                        censusTract[i].demographics.healthInsuranceCoverage > 15 ? current.needScore += 5 :
                            censusTract[i].demographics.healthInsuranceCoverage > 10 ? current.needScore += 6 :
                                current.needScore += 7;

    // Muilthousing Units
    current.multihousingRatio = (parseFloat(current.unitsSingleAttached) +
        parseFloat(current.unitsSingleDetached) +
        parseFloat(current.unitsTwo)) / parseFloat(current.unitsTotal);
    censusTract[i].demographics.multihousingRatio > 0.80 ? current.needScore += 0 :
        censusTract[i].demographics.multihousingRatio > 0.70 ? current.needScore += 1 :
            censusTract[i].demographics.multihousingRatio > 0.60 ? current.needScore += 2 :
                censusTract[i].demographics.multihousingRatio > 0.50 ? current.needScore += 3 :
                    censusTract[i].demographics.multihousingRatio > 0.40 ? current.needScore += 4 :
                        censusTract[i].demographics.multihousingRatio > 0.30 ? current.needScore += 5 :
                            censusTract[i].demographics.multihousingRatio > 0.20 ? current.needScore += 6 :
                                current.needScore += 7;
    scores.push(current.needScore);
}
;

// Adding Census Tract Shapefiles to Map
var censusLayer = L.geoJson(censusTract, {
    style: function style(feature) {
        return {
            // fillColor: getAgeColor(feature.demographics.ageRatioUnder19),
            fillColor: getColor(feature.demographics.needScore),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    },
    onEachFeature: onEachCensusFeature
}).addTo(map);
censusLayer.bringToBack();

function getAgeColor(d) {
    return d < 0.10 ? '#f7fcfd' :
        d < 0.15 ? '#e0ecf4' :
            d < 0.20 ? '#bfd3e6' :
                d < 0.25 ? '#9ebcda' :
                    d < 0.30 ? '#8c96c6' :
                        d < 0.35 ? '#8c6bb1' :
                            d < 0.40 ? '#88419d' :
                                '#6e016b';
}

function getColor(d) {
    return d < 13 ? '#f7fcfd' :
        d < 14 ? '#e0ecf4' :
            d < 15 ? '#bfd3e6' :
                d < 16 ? '#9ebcda' :
                    d < 17 ? '#8c96c6' :
                        d < 18 ? '#8c6bb1' :
                            d < 19 ? '#88419d' :
                                '#6e016b';
}

function onEachCensusFeature(feature, layer) {
    var score = feature.demographics.needScore;
    var children = feature.demographics.ageRatioUnder19;
    var health = feature.demographics.healthInsuranceCoverage;
    var apartment = feature.demographics.multihousingRatio;

    popupContent = "<p><span class='park-title'>Need Score: " + score + "</span> \
					<br>Pop Under 19: " + children + " \
					<br>Health Insurance Coverage : " + health + " \
					<br>Ratio Single Unit Housing : " + apartment + "</p>";

    if (feature.properties) {
        layer.bindPopup(popupContent);
    }
}

function onEachParkFeature(feature, layer) {
    var parkName = feature.properties.PARK_NAME;
    var parkAcres = feature.properties.PARK_ACRES.toFixed(2);
    var parkType = feature.properties.PARK_TYPE;
    var popupContent = "<p><span class='park-title'>" + parkName + "</span> \
						<br>" + parkAcres + " Acres \
						<br>Park Type: " + parkType + "</p>";

    if (feature.properties) {
        layer.bindPopup(popupContent);
    }
}

var parksOn = true;
function toggleParksLayer() {
    if (parksOn === true) {
        map.removeLayer(parkLayer);
    } else {
        map.addLayer(parkLayer);
    }
    parksOn = !parksOn;
}


var overlayMaps = {
    "Parks": parkLayer
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true,
    autoZIndex: true
}).addTo(map);

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function showOnMap(geojsonFeatures) {
    if (!geojsonFeatures) {
        return;
    }
    L.geoJson(geojsonFeatures, {
        onEachFeature: function(feature, layer) {
            var text = [];
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

// Census SDK

console.log("City SDK");

var sdk = new CitySDK();
var censusModule = sdk.modules.census;

censusModule.enable("58211e2426331117ab16deabbfe10b226b95b61b");

var geojsonCensus = L.geoJson().addTo(map);

var request = {
    "lat": 30.26618,
    "lng": -97.74467,
    "level": "county",
    "sublevel": "true",
    "variables": ["income", "population", "poverty"]
};

// censusModule.APIRequest(request, function (response) {
//   console.log(response);
// });

censusModule.GEORequest(request, function(response) {
    console.log(response);

    response.features.forEach(function(f) {
        geojsonCensus.addData(f);
    })
});

// censusModule.getACSVariableDictionary("acs5", 2013)
