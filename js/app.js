(function(){
	

	$('.parks').click( toggleParksLayer );

	$('.districts-toggles button').on( 'click', function(){
		$this = $(this);
		var districtNum = parseInt($this.data('district'));
		var districtIndex = districtNum - 1;
		if (districtLayer){ map.removeLayer(districtLayer); };
		addSingleDistrictLayer(districtIndex);
		console.log("Clicked District " + districtNum + " button."); 
	});

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
		center: [30.304539565829106, -97.73300170898438], //Austin!
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
					fillOpacity: 0.4
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




	// info controls on map
	var info = L.control();

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	    this.update();
	    return this._div;
	};

		// method that we will use to update the control based on feature properties passed
	info.update = function (property) {
	    this._div.innerHTML =  (property ?
	        '<b>District ' + property.DISTRICT_N + '</b><br />'
	        : 'Click on a district');
	};

	info.addTo(map);



})();