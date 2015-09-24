var config = require('../config.json');
var L = require('leaflet');
require('leaflet-providers');

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

// Adding Census Tract Shapefiles to Map
debugger
var censusLayer = L.geoJson(censusTract, {
    style: function style(feature) {
        return {
            // fillColor: getColor(feature.demographics.needScore),
            weight: 1,
            opacity: 1,
            color: config.colors.purple4,
            fillColor: "transparent",
            dashArray: '3',
            fillOpacity: 0.7,
        };
    },
    onEachFeature: onEachCensusFeature,
}).addTo(map);
censusLayer.bringToBack();

function onEachCensusFeature(feature, layer) {}

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
  };

var overlayMaps = {
    'Parks': parkLayer,
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true,
    autoZIndex: true,
}).addTo(map);
