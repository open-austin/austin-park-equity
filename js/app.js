(function(){
	

	$('.parks').click( toggleParksLayer );

	// $('.districts-toggles li').on( 'click', function(){
	// 	$this = $(this);
	// 	var districtNum = parseInt($this.data('district'));
	// 	var districtIndex = districtNum - 1;
	// 	if (districtLayer){ map.removeLayer(districtLayer); };
	// 	addSingleDistrictLayer(districtIndex);
	// });

	var grayscale = L.tileLayer.provider('CartoDB.Positron'),
		terrain = L.tileLayer.provider('Stamen.Terrain');
		// 'OpenStreetMap.BlackAndWhite'
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
		layers: [terrain, grayscale]
	});

	var baseMaps = {
	    "Terrain": terrain,
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
		}
	}).addTo(map);

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

	  // populate data fields
	  var fullDistrict = districts.features[districtNum].properties;

	  var totParkAcres = fullDistrict.TOT_PARK_ACRES;
	  var totParksNum = fullDistrict.TOT_PARKS_NUM;
	  var totParksCost = fullDistrict.TOT_PARKS_COST;
	  var popUnder18 = fullDistrict.POP_UNDER_18;
	  var avgIncome = fullDistrict.AVG_INCOME;
	  var percRenter = fullDistrict.PERC_RENTERS;
	  var councilperson = fullDistrict.COUNCILPERSON;
	  var councilpersonEmail = fullDistrict.COUNCILPERSON_EMAIL;
	  var pocketParks = fullDistrict.POCKET_PARKS;
	  var neighborhoodParks = fullDistrict.NEIGHBORHOOD_PARKS;
	  var districtParks = fullDistrict.DISTRICT_PARKS ;
	  var metroParks = fullDistrict.METRO_PARKS;

	  $('#tot-park-acres').text( totParkAcres );
	  $('#tot-parks-num').text( totParksNum );
	  $('#tot-parks-cost').text( totParksCost );
	  $('#pop-under-18').text( popUnder18 );
	  $('#avg-income').text( avgIncome );
	  $('#perc-renters').text( percRenter );
	  $('#councilperson').text( councilperson );
	  $('#councilperson').parent().attr('href', "mailto:" + councilpersonEmail);

	});


})();