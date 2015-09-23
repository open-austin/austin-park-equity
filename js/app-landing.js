var queue = require('queue-async');
var $ = require('jquery');
var _ = require('lodash');
var d3 = require('d3');
var L = require('leaflet');
require('leaflet-providers');

var config = require('../config.json');


// $('.districts-toggles li').on( 'click', function(){
// 	$this = $(this);
// 	var districtNum = parseInt($this.data('district'));
// 	var districtIndex = districtNum - 1;
// 	if (districtLayer){ map.removeLayer(districtLayer); };
// 	addSingleDistrictLayer(districtIndex);
// });

var grayscale = L.tileLayer.provider('CartoDB.Positron');
// terrain = L.tileLayer.provider('Stamen.Terrain');
// blackAndWhite = 'OpenStreetMap.BlackAndWhite'
// 'Thunderforest.Transport'
// 'OpenMapSurfer.Roads'
// 'OpenMapSurfer.Grayscale'
// 'Stamen.Toner'
// 'Esri.WorldGrayCanvas'
// 'CartoDB.DarkMatter'

var greenColors = [
    'rgb(255,255,229)',
    'rgb(247,252,185)',
    'rgb(217,240,163)',
    'rgb(173,221,142)',
    'rgb(120,198,121)',
    'rgb(65,171,93)',
    'rgb(35,132,67)',
    'rgb(0,104,55)',
    'rgb(0,69,41)',
];

var greyColors = ['rgb(255,255,255)', 'rgb(240,240,240)', 'rgb(217,217,217)', 'rgb(189,189,189)', 'rgb(150,150,150)', 'rgb(115,115,115)', 'rgb(82,82,82)', 'rgb(37,37,37)', 'rgb(0,0,0)'];

var map = L.map('main-map', {
    center: config.map_center, // Austin!
    zoom: 12,
    scrollWheelZoom: false,
    layers: [grayscale], // include more options in array like terrain,
});

var baseMaps = {
    'Grayscale': grayscale,
    // 'Terrain': terrain, // removing other tiles now for simplicity,
};

L.geoJson(districts, {
    weight: 1,
    opacity: 1,
    color: '#666',
    fillOpacity: 0,
}).addTo(map);

function getRingColor(d) {
    if (d === '> 1 mile') { return '#FF8080'; }
    if (d === '1 mile') { return '#FFB380'; }
    if (d === '1/2 mile') { return '#FFE680'; }
    if (d === '1/4 mile') { return '#E5F57F'; }
    if (d === '500') { return '#BBE47F'; }
    if (d === '100') { return '#9BD37F'; }
    return '#FF8080';
}
var heatmap = L.geoJson(parkAccessRing, {
    style: function style(feature) {
        return {
            fillColor: getRingColor(feature.properties.distance_l),
            weight: 0,
            opacity: 0,
            fillOpacity: 0.5,
        };
    },
}).addTo(map);


function getParkColor(d) {
    // LOGIC: return cemeteries as gray, OSM Parks as green5,
    // undeveloped parks as brown, all others as green.

    if (d.properties.PARK_TYPE === 'Cemetery') {
        return greyColors[5];
    }
    if (d.id) {
        return greenColors[5];
    }
    if (d.properties.am_plus_fac_sum > 0) {
        return '#56DD54';
    }
    return '#9f7048';
}

function onEachFeature(feature, layer) {
    var parkName = feature.properties.PARK_NAME;
    var parkAcres = feature.properties.PARK_ACRES.toFixed(2);
    var parkType = feature.properties.PARK_TYPE;
    var parkStatus = feature.properties.DEVELOPMEN;
    var parkAmen = feature.properties.amenities_count;
    var parkFac = feature.properties.facilities_count;
    var parkTrails = feature.properties.trails_count;
    var popupContent = '<p><span class="park-title">' + parkName + '</span> \
  											<br>' + parkAcres + ' Acres \
  											<br>Park Type: ' + parkType +
            '<br>Status: ' + parkStatus +
            '<br>' + parkAmen + ' Amenities, ' + parkFac + ' Facilities, ' + parkTrails + ' Trails</p>';

    if (feature.properties) {
        layer.bindPopup(popupContent);
    }
}


// create Array of parks by 'PARK_TYPE'
var parksByType = _.groupBy(parks.features, function(n) {
    return n.properties.PARK_TYPE;
});

var cemeteries = parksByType.Cemetery;
var districtParks = parksByType.District;
var golfCourses = parksByType['Golf Course'];
var greenbelts = parksByType.Greenbelt;
var metroParks = parksByType.Metropolitan;
var naturePreserves = parksByType['Nature Preserve'];
var neighborhoodParks = parksByType.Neighborhood;
var plantingStrips = parksByType['Planting Strips/Triangles'];
var pocketParks = parksByType.Pocket;
var schoolParks = parksByType.School;
var specialParks = parksByType.Special;

var drawLayer = function(layer, popup) {
    return L.geoJson(layer, {
        style: function style(feature) {
            return {
                fillColor: getParkColor(feature),
                weight: 1,
                opacity: 0.7,
                color: '#44A048',
                fillOpacity: 0.7,
            };
        },
        onEachFeature: popup,
    }).addTo(map);
};

function onEachOSMPark(feature, layer) {
    var parkName = feature.properties.name || 'Unnamed Park';
    var popupContent = '<p><span class="park-title">' + parkName + '</span> \
                          <br>Park Type: Non-PARD Facility</p>';

    if (feature.properties) {
        layer.bindPopup(popupContent);
    }
}


var cemeteryLayer = drawLayer(cemeteries, onEachFeature);
var golfLayer = drawLayer(golfCourses, onEachFeature);
var osmParksLayer = drawLayer(osmParks, onEachOSMPark);
var schoolLayer = drawLayer(schoolParks, onEachFeature);
drawLayer(districtParks, onEachFeature);
drawLayer(greenbelts, onEachFeature);
drawLayer(metroParks, onEachFeature);
drawLayer(naturePreserves, onEachFeature);
drawLayer(neighborhoodParks, onEachFeature);
drawLayer(plantingStrips, onEachFeature);
drawLayer(pocketParks, onEachFeature);
drawLayer(specialParks, onEachFeature);

var parksOn = true;
function toggleParksLayer() {
    if (parksOn === true) {
        map.removeLayer(parkLayer);
    } else {
        map.addLayer(parkLayer);
    }
    parksOn = !parksOn;
}
$('.parks').click(toggleParksLayer);


var overlayMaps = {
    // 'Parks': parkLayer,
    'Non-PARD Parks': osmParksLayer,
    'Cemeteries': cemeteryLayer,
    'Golf Course': golfLayer,
    'School Parks': schoolLayer,
    'Heatmap': heatmap,
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true,
    autoZIndex: true,
}).addTo(map);

// adding district shapefiles to Map
var districtLayer;
function addSingleDistrictLayer(districtNum) {
    districtLayer = L.geoJson(districts.features[districtNum], {
        style: function style() {
            return {
                fillColor: 'transparent',
                weight: 3,
                opacity: 1,
                color: '#666',
                dashArray: '',
            };
        },
    }).addTo(map);
    districtLayer.bringToBack();
    map.fitBounds(districtLayer.getBounds());
}

// Loading Data with D3
var distDemoData;
var parkAcreageData;

queue()
    .defer(d3.json, 'data/json/district-demographics.json')
    .defer(d3.json, 'data/json/park-acreage-data.json')
    // .defer(d3.json, 'data/geojson/census-tract.geojson')
    .await(function analyze(error, demographics, parks, census) {
        if (error) {
            console.log(error);
        }

        distDemoData = demographics;
        parkAcreageData = parks;
        censusData = census;
    });

// d3.json('data/json/district-demographics.json', function(data) {
// 	distDemoData = data;
// 	console.log(distDemoData[0]);
// });

// d3.json('data/json/district-park-acreage.json', function(data) {
// 	parkAcreageData = data;
// 	console.log(parkAcreageData[0]);
// });

// DROPDOWN
$('.dropdown .title').click(function() {
    $(this).parent().toggleClass('closed');
    $('.facts-table').toggleClass('no-show');
});

function applyRankingColors($rankValue) {
    var rankInt = parseInt($rankValue.text(), 10);
    $rankValue.parent().removeClass();

    if (rankInt === 1 || rankInt === 2) {
        $rankValue.parent().addClass('rgdiv4-5');
    } else if (rankInt === 3 || rankInt === 4) {
        $rankValue.parent().addClass('rgdiv3-5');
    } else if (rankInt === 5 || rankInt === 6) {
        $rankValue.parent().addClass('rgdiv2-5');
    } else if (rankInt === 7 || rankInt === 8) {
        $rankValue.parent().addClass('rgdiv1-5');
    } else if (rankInt === 9 || rankInt === 10) {
        $rankValue.parent().addClass('rgdiv0-5');
    }
}

function populateDistrictFacts(districtIndex) {
    var districtDemographics = distDemoData[districtIndex];
    var districtParks = parkAcreageData[districtIndex];
    var totParkAcres = (districtParks['Total Park Acres']).toFixed(2);
    var parkAcresRank = districtParks['Park Acres Rank'];
    var totParksNum = districtParks['Park Count'];
    var parksNumRank = districtParks['Park Count Rank'];
    var percParkCoverage = districtParks['Percent Park Coverage'];
    var parkCoverageRank = districtParks['Coverage Rank'];
    var familyIncome = districtDemographics.medianFamilyIncome2013;
    var rankIncome = districtDemographics.rankMedianFamilyIncome2013;
    var percRenter = districtDemographics.percentRenterOccupiedHousingUnitsOfTotalOccupied2010;
    var rankRenter = districtDemographics.rankRenterOccupiedHousing2010;
    var percPoverty = districtDemographics.povertyRate2013;
    var rankPoverty = districtDemographics.rankPoveryRate2013;
    var percInsurance = districtDemographics.percentWithoutHealthInsurance2013;
    var rankInsurance = districtDemographics.rankWithoutHealthInsurance2013;
    var popUnder18 = districtDemographics.ageUnderEighteen2010;
    var rankUnder18 = districtDemographics.rankAgeUnderEighteen2010;

    $('#tot-park-acres').text(totParkAcres);
    $('#park-acres-rank').text(parkAcresRank);
    $('#tot-parks-num').text(totParksNum);
    $('#parks-num-rank').text(parksNumRank);
    $('#perc-park-coverage').text(percParkCoverage);
    $('#park-coverage-rank').text(parkCoverageRank);
    $('#pop-under-18').text(popUnder18);
    $('#pop-under-18-rank').text(rankUnder18);
    $('#family-income').text(familyIncome);
    $('#family-income-rank').text(rankIncome);
    $('#perc-renters').text(percRenter);
    $('#perc-renters-rank').text(rankRenter);
    $('#perc-poverty').text(percPoverty);
    $('#perc-poverty-rank').text(rankPoverty);
    $('#perc-insurance').text(percInsurance);
    $('#perc-insurance-rank').text(rankInsurance);

    applyRankingColors($('#perc-insurance-rank'));
    applyRankingColors($('#perc-poverty-rank'));
    applyRankingColors($('#family-income-rank'));
    applyRankingColors($('#park-acres-rank'));
    applyRankingColors($('#parks-num-rank'));
    applyRankingColors($('#park-coverage-rank'));
}

$('.dropdown li').click(function() {
    // capture district num/index selected
    var $this = $(this);
    var districtNum = parseInt($this.data('district'), 10);
    var districtIndex = districtNum - 1;

    $this.parent().parent().toggleClass('closed').find('.title').text($this.text());
    $('.facts-table').toggleClass('no-show');

    // add district polygon to map
    if (districtLayer) {
        map.removeLayer(districtLayer);
    }

    addSingleDistrictLayer(districtIndex);
    populateDistrictFacts(districtIndex);
});
