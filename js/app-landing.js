var config = require("../config.json");
var queue = require("queue-async");
var L = require("leaflet");
require("leaflet-providers");
var $ = require("jquery");
var _ = require("lodash");
var d3 = require("d3");

	$('.parks').click( toggleParksLayer );

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
    'rgb(0,69,41)'];

  var greyColors = ['rgb(255,255,255)','rgb(240,240,240)','rgb(217,217,217)','rgb(189,189,189)','rgb(150,150,150)','rgb(115,115,115)','rgb(82,82,82)','rgb(37,37,37)','rgb(0,0,0)'];

	var map = L.map('main-map', {
		center: config.map_center, //Austin!
		zoom: 12,
		scrollWheelZoom: false,
		layers: [grayscale] //include more options in array like terrain
	});

	var baseMaps = {
	    "Grayscale": grayscale
	    // "Terrain": terrain, //removing other tiles now for simplicity
	};

	var districtLines = L.geoJson( districts, {
		weight: 1,
		opacity: 1,
		color: '#666',
		fillOpacity: 0
	}).addTo(map)


  // Heatmap layer and Ring Colors
	var heatmap = L.geoJson( parkAccessRing, {
		style: function style(feature){
			return {
				fillColor: getRingColor(feature.properties.distance_l),
				weight: 0,
				opacity: 0,
				fillOpacity: 0.5
			};
		}
	}).addTo(map)

	function getRingColor(d) {
		return d === "> 1 mile" ? '#FF8080' :
		 			 d === "1 mile" 	? '#FFB380' :
					 d === "1/2 mile" ? '#FFE680' :
					 d === "1/4 mile" ? '#E5F57F' :
					 d === "500'" 		? '#BBE47F' :
					 d === "100'" 		? '#9BD37F' :
					 										'#FF8080';
	}

	function getParkColor(d) {
    // LOGIC: return cemeteries as gray, OSM Parks as green5,
    // undeveloped parks as brown, all others as green.
    return d.properties.PARK_TYPE === "Cemetery" ? greyColors[5]  :
           d.id                                  ? greenColors[5] :
           d.properties.am_plus_fac_sum > 0      ? '#56DD54' : "#9f7048";
	}

	function onEachFeature(feature, layer) {
		var parkName 	   = feature.properties.PARK_NAME,
  			parkAcres 	 = feature.properties.PARK_ACRES.toFixed(2),
  			parkType 		 = feature.properties.PARK_TYPE,
  			parkStatus	 = feature.properties.DEVELOPMEN,
        parkAmen     = feature.properties.amenities_count,
        parkFac      = feature.properties.facilities_count,
        parkTrails   = feature.properties.trails_count,
  			popupContent = "<p><span class='park-title'>" + parkName + "</span> \
  											<br>" + parkAcres + " Acres \
  											<br>Park Type: " + parkType +
  											"<br>Status: " + parkStatus +
  											"<br>" + parkAmen + " Amenities, " + parkFac + " Facilities, " + parkTrails + " Trails</p>";

	    if (feature.properties) {
	        layer.bindPopup( popupContent );
	    }
	}


  // create Array of parks by "PARK_TYPE"
  var parksByType = _.groupBy(parks.features, function(n){
    return n.properties.PARK_TYPE
  });

  var cemeteries        = parksByType["Cemetery"],
      districtParks     = parksByType["District"],
      golfCourses       = parksByType["Golf Course"],
      greenbelts        = parksByType["Greenbelt"],
      metroParks        = parksByType["Metropolitan"],
      naturePreserves   = parksByType["Nature Preserve"],
      neighborhoodParks = parksByType["Neighborhood"],
      plantingStrips    = parksByType["Planting Strips/Triangles"],
      pocketParks       = parksByType["Pocket"],
      schoolParks       = parksByType["School"],
      specialParks      = parksByType["Special"];

  var drawLayer = function(layer, popup){
    return L.geoJson(layer, {
      style: function style(feature){
        return {
          fillColor: getParkColor(feature),
          weight: 1,
          opacity: 0.7,
          color: '#44A048',
          fillOpacity: 0.7
        };
      },
      onEachFeature: popup
    }).addTo(map);
  }

  var cemeteryLayer     = drawLayer(cemeteries, onEachFeature),
      districtParkLayer = drawLayer(districtParks, onEachFeature),
      golfLayer         = drawLayer(golfCourses, onEachFeature),
      greenbeltLayer    = drawLayer(greenbelts, onEachFeature),
      metroParkLayer    = drawLayer(metroParks, onEachFeature),
      naturePresLayer   = drawLayer(naturePreserves, onEachFeature),
      neighborhoodLayer = drawLayer(neighborhoodParks, onEachFeature),
      plantingLayer     = drawLayer(plantingStrips, onEachFeature),
      pocketLayer       = drawLayer(pocketParks, onEachFeature),
      schoolLayer       = drawLayer(schoolParks, onEachFeature),
      specialLayer      = drawLayer(specialParks, onEachFeature),
      osmParksLayer     = drawLayer(osmParks, onEachOSMPark);

  function onEachOSMPark(feature, layer){
    	var parkName     = feature.properties.name || 'Unnamed Park',
          popupContent = "<p><span class='park-title'>"+parkName+"</span> \
                          <br>Park Type: Non-PARD Facility</p>";

      if (feature.properties) {
          layer.bindPopup( popupContent );
      }
  }

	var parksOn = true;
	function toggleParksLayer(){
		if (parksOn === true){
			map.removeLayer(parkLayer);
		} else {
			map.addLayer(parkLayer);
		}
		parksOn = !parksOn;
	}


	var overlayMaps = {
		// "Parks": parkLayer,
    "Non-PARD Parks": osmParksLayer,
    "Cemeteries": cemeteryLayer,
    "Golf Course": golfLayer,
    "School Parks": schoolLayer,
    "Heatmap": heatmap
	};

	L.control.layers(baseMaps, overlayMaps, {collapsed: true, autoZIndex: true}).addTo(map);

	function isInArray(value, array) {
	  return array.indexOf(value) > -1;
	}

	// adding district shapefiles to Map
	var districtLayer;
	function addSingleDistrictLayer(districtNum){
		districtLayer = L.geoJson(districts.features[districtNum], {
			style: function style(feature) {
				return {
					fillColor: "transparent",
					weight: 3,
					opacity: 1,
					color: '#666',
					dashArray: '',
				};
			}
		}).addTo(map);
    districtLayer.bringToBack();
		map.fitBounds(districtLayer.getBounds());
	}

	// Loading Data with D3
	var distDemoData,
		  parkAcreageData,
		  censusData;

	queue()
	  .defer(d3.json, "data/district-demographics.json")
	  .defer(d3.json, "data/park-acreage-data.json")
	  // .defer(d3.json, "data/census-tract.json")
	  .await(analyze);

	function analyze(error, demographics, parks, census) {
	  if(error) { console.log(error); }

	  distDemoData 		  = demographics;
	  parkAcreageData 	= parks;
	  // censusData 		    = census;

	}

	// d3.json("data/district-demographics.json", function(data) {
	// 	distDemoData = data;
	// 	console.log(distDemoData[0]);
	// });

	// d3.json("data/district-park-acreage.json", function(data) {
	// 	parkAcreageData = data;
	// 	console.log(parkAcreageData[0]);
	// });

	// DROPDOWN
	$(".dropdown .title").click(function () {
	  $(this).parent().toggleClass("closed");
	  $('.facts-table').toggleClass("no-show");
	});

	$(".dropdown li").click(function () {
	  // capture district num/index selected
	  var $this = $(this),
	  		districtNum 	= parseInt( $this.data('district') ),
	  		districtIndex = districtNum - 1;

	  $this.parent().parent().toggleClass("closed").find(".title").text($this.text());
	  $('.facts-table').toggleClass("no-show");

	  // add district polygon to map
	  if (districtLayer){ map.removeLayer(districtLayer); };
	  addSingleDistrictLayer(districtIndex);
	  populateDistrictFacts(districtIndex);

	});

	function populateDistrictFacts(districtIndex){
		var districtFeatures 			= districts.features[districtIndex].properties,
				districtDemographics 	= distDemoData[districtIndex],
				districtParks 				= parkAcreageData[districtIndex],

			// Parks Data
			totParkAcres 			= (districtParks["Total Park Acres"]).toFixed(2),
			parkAcresRank 		= districtParks["Park Acres Rank"],
			totParksNum 			= districtParks["Park Count"],
			parksNumRank 			= districtParks["Park Count Rank"],
			percParkCoverage 	= districtParks["Percent Park Coverage"],
			parkCoverageRank 	= districtParks["Coverage Rank"],
			// pocketParks 					= districtFeatures.POCKET_PARKS,
			// neighborhoodParks 		= districtFeatures.NEIGHBORHOOD_PARKS,
			// districtParks 				= districtFeatures.DISTRICT_PARKS,
			// metroParks 						= districtFeatures.METRO_PARKS,

			// Demographic Data
			familyIncome 	= districtDemographics.medianFamilyIncome2013,
			rankIncome 		= districtDemographics.rankMedianFamilyIncome2013,
			percRenter 		= districtDemographics.percentRenterOccupiedHousingUnitsOfTotalOccupied2010,
			rankRenter 		= districtDemographics.rankRenterOccupiedHousing2010,
			percPoverty		= districtDemographics.povertyRate2013,
			rankPoverty		= districtDemographics.rankPoveryRate2013,
			percInsurance	= districtDemographics.percentWithoutHealthInsurance2013,
			rankInsurance	= districtDemographics.rankWithoutHealthInsurance2013,
			popUnder18 		= districtDemographics.ageUnderEighteen2010,
			rankUnder18 	= districtDemographics.rankAgeUnderEighteen2010;

		$('#tot-park-acres').text( totParkAcres );
		$('#park-acres-rank').text( parkAcresRank );
		$('#tot-parks-num').text( totParksNum );
		$('#parks-num-rank').text( parksNumRank );
		$('#perc-park-coverage').text( percParkCoverage );
		$('#park-coverage-rank').text( parkCoverageRank );
		$('#pop-under-18').text( popUnder18 );
		$('#pop-under-18-rank').text( rankUnder18 );
		$('#family-income').text( familyIncome );
		$('#family-income-rank').text( rankIncome );
		$('#perc-renters').text( percRenter );
		$('#perc-renters-rank').text( rankRenter );
		$('#perc-poverty').text( percPoverty );
		$('#perc-poverty-rank').text( rankPoverty );
		$('#perc-insurance').text( percInsurance );
		$('#perc-insurance-rank').text( rankInsurance );

		applyRankingColors( $("#perc-insurance-rank") );
		applyRankingColors( $("#perc-poverty-rank") );
		applyRankingColors( $("#family-income-rank") );
		applyRankingColors( $("#park-acres-rank") );
		applyRankingColors( $("#parks-num-rank") );
		applyRankingColors( $("#park-coverage-rank") );

	};

	function applyRankingColors($rankValue){
		var rankInt = parseInt($rankValue.text());
		$rankValue.parent().removeClass();

		if ( rankInt == 1 || rankInt == 2 ) {
			$rankValue.parent().addClass("rgdiv4-5");
		} else if ( rankInt == 3 || rankInt == 4 ) {
			$rankValue.parent().addClass("rgdiv3-5");
		} else if ( rankInt == 5 || rankInt == 6 ) {
			$rankValue.parent().addClass("rgdiv2-5");
		} else if ( rankInt == 7 || rankInt == 8 ) {
			$rankValue.parent().addClass("rgdiv1-5");
		} else if ( rankInt == 9 || rankInt == 10 ) {
			$rankValue.parent().addClass("rgdiv0-5");
		}
	};
