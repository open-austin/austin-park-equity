var config = require('../config.json');
var $ = require('jquery');
var queue = require('queue-async');
var d3 = require('d3');
var L = require('leaflet');
require('leaflet-providers');

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

var map = L.map('map', {
    center: config.map_center, // Austin!
    zoom: 12,
    scrollWheelZoom: false,
    layers: [grayscale], // include more options in array like terrain
});

var baseMaps = {
    // "Terrain": terrain, // removing other tiles now for simplicity
    'Grayscale': grayscale,
};

function getRingColor(d) {
    if (d === '> 1 mile') { return '#FF8080'; }
    if (d === '1 mile') { return '#FFB380'; }
    if (d === '1/2 mile') { return '#FFE680'; }
    if (d === '1/4 mile') { return '#E5F57F'; }
    if (d === "500'") { return '#BBE47F'; }
    if (d ===  "100'") { return '#9BD37F'; }

    return 'red';
}

L.geoJson(parkAccessRing, {
    style: function style(feature) {
        return {
            fillColor: getRingColor(feature.properties.distance_l),
            weight: 0,
            opacity: 0,
            fillOpacity: 0.6,
        };
    },
}).addTo(map);


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
    onEachFeature: function onEachFeature(feature, layer) {
        var parkName = feature.properties.PARK_NAME;
        var parkAcres = feature.properties.PARK_ACRES.toFixed(2);
        var parkType = feature.properties.PARK_TYPE;
        var popupContent = "<p><span class='park-title'>" + parkName + '</span> \
    						<br>' + parkAcres + ' Acres \
    						<br>Park Type: ' + parkType + '</p>';

        if (feature.properties) {
            layer.bindPopup(popupContent);
        }
    },
}).addTo(map);


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
    'Parks': parkLayer,
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: true,
    autoZIndex: true,
}).addTo(map);

function getColor(d) {
    if (d > 9) { return '#8dd3c7'; }
    if (d > 8) { return '#ffffb3'; }
    if (d > 7) { return '#bebada'; }
    if (d > 6) { return '#fb8072'; }
    if (d > 5) { return '#80b1d3'; }
    if (d > 4) { return '#fdb462'; }
    if (d > 3) { return '#b3de69'; }
    if (d > 2) { return '#fccde5'; }
    if (d > 1) { return '#98e986'; }
    return '#bc80bd';
}

// adding district shapefiles to Map
var districtLayer;
function addSingleDistrictLayer(districtNum) {
    districtLayer = L.geoJson(districts.features[districtNum], {
        style: function style(feature) {
            return {
                fillColor: getColor(feature.properties.DISTRICT_N),
                weight: 1,
                opacity: 1,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.6,
            };
        },
    }).addTo(map);
    map.fitBounds(districtLayer.getBounds());
    districtLayer.bringToBack();
}

// Loading Data with D3
var distDemoData;
var parkAcreageData;

queue()
    .defer(d3.json, 'data/json/district-demographics.json')
    .defer(d3.json, 'data/json/park-acreage-data.json')
    .defer(d3.json, 'data/geojson/census-tract.geojson')
    .await(function analyze(error, demographics, parks, census) {
        if (error) {
            console.log(error);
        }

        distDemoData = demographics;
        parkAcreageData = parks;
        censusData = census;
    });

// d3.json("data/json/district-demographics.json", function(data) {
// 	distDemoData = data;
// 	console.log(distDemoData[0]);
// });

// d3.json("data/json/district-park-acreage.json", function(data) {
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

    // Parks Data
    var totParkAcres = (districtParks['Total Park Acres']).toFixed(2);
    var parkAcresRank = districtParks['Park Acres Rank'];
    var totParksNum = districtParks['Park Count'];
    var parksNumRank = districtParks['Park Count Rank'];
    var percParkCoverage = districtParks['Percent Park Coverage'];
    // var pocketParks 					= districtFeatures.POCKET_PARKS;
    // var neighborhoodParks 		= districtFeatures.NEIGHBORHOOD_PARKS;
    // var districtParks 				= districtFeatures.DISTRICT_PARKS;
    // var metroParks 						= districtFeatures.METRO_PARKS;

    // Demographic Data
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
