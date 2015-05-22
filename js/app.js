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

	// DROPDOWN
	$(".dropdown .title").click(function () {
	  $(this).parent().toggleClass("closed");
	  $('.district-facts').toggleClass("no-show");
	});

	$(".dropdown li").click(function () {
	  $this = $(this);
	  $this.parent().parent().toggleClass("closed").find(".title").text($this.text());
	  $('.district-facts').toggleClass("no-show");

	  // capture district num/index
	  var districtNum = parseInt($this.data('district'));
	  var districtIndex = districtNum - 1;

	  // add district polygon to map
	  if (districtLayer){ map.removeLayer(districtLayer); };
	  addSingleDistrictLayer(districtIndex);
	  populateDistrictFacts(districtIndex);

	});

	function populateDistrictFacts(districtIndex){
		var districtFeatures = districts.features[districtIndex].properties;

		var totParkAcres = (districtFeatures.TOT_PARK_ACRES).toFixed(2);
		var totParksNum = districtFeatures.TOT_PARKS_NUM;
		var totParksCost = districtFeatures.TOT_PARKS_COST;
		var popUnder18 = districtFeatures.POP_UNDER_18;
		var avgIncome = districtFeatures.AVG_INCOME;
		var percRenter = districtFeatures.PERC_RENTERS;
		var councilperson = districtFeatures.COUNCILPERSON;
		var councilpersonEmail = districtFeatures.COUNCILPERSON_EMAIL;
		var pocketParks = districtFeatures.POCKET_PARKS;
		var neighborhoodParks = districtFeatures.NEIGHBORHOOD_PARKS;
		var districtParks = districtFeatures.DISTRICT_PARKS ;
		var metroParks = districtFeatures.METRO_PARKS;

		$('#tot-park-acres').text( totParkAcres );
		$('#tot-parks-num').text( totParksNum );
		$('#tot-parks-cost').text( totParksCost );
		$('#pop-under-18').text( popUnder18 );
		$('#avg-income').text( avgIncome );
		$('#perc-renters').text( percRenter );
		$('#councilperson').text( councilperson );
		$('#councilperson').parent().attr('href', "mailto:" + councilpersonEmail);
	}


})();