var L = require('leaflet');
require('leaflet-providers');

var config = require('../config.json');

var grayscale = L.tileLayer.provider('CartoDB.Positron');

var map = L.map('map', {
    center: config.map_center, // Austin!
    zoom: 12,
    scrollWheelZoom: false,
    layers: [grayscale],
});

var baseMaps = {
    'Grayscale': grayscale,
};

function getAgeUnder19Score(ageRatioUnder19) {
    if (ageRatioUnder19 < 0.10) { return 0; }
    if (ageRatioUnder19 < 0.15) { return 1; }
    if (ageRatioUnder19 < 0.20) { return 2; }
    if (ageRatioUnder19 < 0.25) { return 3; }
    if (ageRatioUnder19 < 0.30) { return 4; }
    if (ageRatioUnder19 < 0.35) { return 5; }
    if (ageRatioUnder19 < 0.40) { return 6; }
    return 7;
}

function getMultihousingRatioScore(multihousingRatio) {
    if (multihousingRatio > 0.80) { return 0; }
    if (multihousingRatio > 0.70) { return 1; }
    if (multihousingRatio > 0.60) { return 2; }
    if (multihousingRatio > 0.50) { return 3; }
    if (multihousingRatio > 0.40) { return 4; }
    if (multihousingRatio > 0.30) { return 5; }
    if (multihousingRatio > 0.20) { return 6; }
    return 7;
}

function getHealthInsuranceScore(healthInsuranceCoverage) {
    if (healthInsuranceCoverage > 40) { return 0; }
    if (healthInsuranceCoverage > 35) { return 1; }
    if (healthInsuranceCoverage > 30) { return 2; }
    if (healthInsuranceCoverage > 25) { return 3; }
    if (healthInsuranceCoverage > 20) { return 4; }
    if (healthInsuranceCoverage > 15) { return 5; }
    if (healthInsuranceCoverage > 10) { return 6; }
    return 7;
}

window.scores = [];
// higher value = more need
for (var i = 0; i <= censusTract.length - 1; i++) {
    var current = censusTract[i].demographics;
    var needScore = 0;

    needScore += getAgeUnder19Score(current.ageRatioUnder19);
    needScore += getHealthInsuranceScore(current.healthInsuranceCoverage);

    var multihousingRatio = (parseFloat(current.unitsSingleAttached) +
        parseFloat(current.unitsSingleDetached) +
        parseFloat(current.unitsTwo)) / parseFloat(current.unitsTotal);
    needScore += getMultihousingRatioScore(multihousingRatio);

    scores.push(needScore);
}


function onEachCensusFeature(feature, layer) {
    var score = feature.demographics.needScore;
    var children = feature.demographics.ageRatioUnder19;
    var health = feature.demographics.healthInsuranceCoverage;
    var apartment = feature.demographics.multihousingRatio;

    popupContent = '<p><span class="park-title">Need Score: ' + score + '</span> \
					<br>Pop Under 19: ' + children + ' \
					<br>Health Insurance Coverage : ' + health + ' \
					<br>Ratio Single Unit Housing : ' + apartment + '</p>';

    if (feature.properties) {
        layer.bindPopup(popupContent);
    }
}

function getColor(d) {
    if (d < 13) { return '#f7fcfd'; }
    if (d < 14) { return '#e0ecf4'; }
    if (d < 15) { return '#bfd3e6'; }
    if (d < 16) { return '#9ebcda'; }
    if (d < 17) { return '#8c96c6'; }
    if (d < 18) { return '#8c6bb1'; }
    if (d < 19) { return '#88419d'; }
    return '#6e016b';
}
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
            fillOpacity: 0.7,
        };
    },
    onEachFeature: onEachCensusFeature,
}).addTo(map);
censusLayer.bringToBack();


function onEachParkFeature(feature, layer) {
    var parkName = feature.properties.PARK_NAME;
    var parkAcres = feature.properties.PARK_ACRES.toFixed(2);
    var parkType = feature.properties.PARK_TYPE;
    var popupContent = '<p><span class="park-title">' + parkName + '</span> \
						<br>' + parkAcres + ' Acres \
						<br>Park Type: ' + parkType + '</p>';

    if (feature.properties) {
        layer.bindPopup(popupContent);
    }
}
// adding parks shapefiles to Map
var parkLayer = L.geoJson(parks, {
    style: function style() {
        return {
            fillColor: '#56DD54',
            weight: 1,
            opacity: 0.7,
            color: '#44A048',
            fillOpacity: 0.7,
        };
    },
    onEachFeature: onEachParkFeature,
}).addTo(map);

var overlayMaps = {
    'Parks': parkLayer,
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true,
    autoZIndex: true,
}).addTo(map);
