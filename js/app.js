(function(){

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

	var map = L.map('map', {
		center: [30.26618, -97.74467], //Austin!
		zoom: 12,
		scrollWheelZoom: false,
		layers: [grayscale] //include more options in array like terrain
	});

	var baseMaps = {
	    // "Terrain": terrain, //removing other tiles now for simplicity
	    "Grayscale": grayscale
	};

	// adding parks shapefiles to Map
	var parkLayer = L.geoJson(parks, {
		style: function style(feature){
			return {
				fillColor: '#56DD54',
				weight: 1,
				opacity: 0.7,
				color: '#44A048',
				fillOpacity: 0.7
			};
		},
		onEachFeature: onEachFeature
	}).addTo(map);

	function onEachFeature(feature, layer) {
		var parkName 	= feature.properties.PARK_NAME,
			parkAcres 	= feature.properties.PARK_ACRES.toFixed(2),
			parkType 	= feature.properties.PARK_TYPE,

			popupContent = "<p><span class='park-title'>"+parkName+"</span> \
						<br>"+parkAcres+" Acres \
						<br>Park Type: "+parkType+"</p>";

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
		"Parks": parkLayer
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
					fillColor: getColor(feature.properties.DISTRICT_N),
					weight: 1,
					opacity: 1,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.6
				};
			}
		}).addTo(map);
		map.fitBounds(districtLayer.getBounds());
		districtLayer.bringToBack();
	}

	function getColor(d) {
		return d > 9 ? '#8dd3c7' :
			d > 8 ? '#ffffb3' :
			d > 7 ? '#bebada' :
			d > 6 ? '#fb8072' :
			d > 5 ? '#80b1d3' :
			d > 4 ? '#fdb462' :
			d > 3 ? '#b3de69' :
			d > 2 ? '#fccde5' :
			d > 1 ? '#98e986' :
			'#bc80bd';
	}

	var distDemoData;

	d3.json("/data/district-demographics.json", function(data) {
		distDemoData = data;
		console.log(data[0]);
	});

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
				districtDemographics 	= distDemoData[districtIndex];

			// Parks Data
			totParkAcres 	= (districtFeatures.TOT_PARK_ACRES).toFixed(2),
			totParksNum 	= districtFeatures.TOT_PARKS_NUM,
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
			rankPoverty		= districtDemographics.rankAgeUnderEighteen2010,
			percInsurance	= districtDemographics.percentWithoutHealthInsurance2013,
			rankInsurance	= districtDemographics.rankWithoutHealthInsurance2013,
			popUnder18 		= districtDemographics.ageUnderEighteen2010,
			rankUnder18 	= districtDemographics.rankAgeUnderEighteen2010;

		$('#tot-park-acres').text( totParkAcres );
		$('#tot-parks-num').text( totParksNum );
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

		applyInverseRankingColors( $("#perc-insurance-rank") );
		applyInverseRankingColors( $("#perc-poverty-rank") );
		applyRankingColors( $("#family-income-rank") );

	};

	function applyRankingColors($rankValue){
		var rankInt = parseInt($rankValue.text());
		$rankValue.parent().parent().removeClass();

		if ( rankInt <= 3 ) {
			$rankValue.parent().parent().addClass("positive-ranking");
		} else if ( rankInt > 3 && rankInt <= 7  ) {
			$rankValue.parent().parent().addClass("neutral-ranking");
		} else {
			$rankValue.parent().parent().addClass("negative-ranking");
		}
	};

	function applyInverseRankingColors($rankValue){
		var rankInt = parseInt($rankValue.text());
		$rankValue.parent().parent().removeClass();

		if ( rankInt <= 3 ) {
			$rankValue.parent().parent().addClass("negative-ranking");
		} else if ( rankInt > 3 && rankInt <= 7  ) {
			$rankValue.parent().parent().addClass("neutral-ranking");
		} else {
			$rankValue.parent().parent().addClass("positive-ranking");
		}
	};


})();
