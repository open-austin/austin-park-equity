;(function(){

	$('.parks').click( toggleParksLayer );
	$('.districts').click( toogleDistrictsLayer );

	var map = L.map('map', {
		center: [30.304539565829106, -97.73300170898438], //Austin!
		zoom: 10,
		scrollWheelZoom: false
	});

	//  add tile Layer from Mapquest
	L.tileLayer(
	    // Mapbox Streets-Satellite
	    // 'http://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF0ZW9jb2RlcyIsImEiOiJUZVVZSVBvIn0.PkZleldXk_6KCuoGhx6-CA'

		// Satelite Tile
		// 'http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg'

		// Plain (ugly) Mapquest Tiles
		// 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg'

		// Open Street Map Tile
	    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	).addTo(map);

	// adding parks shapefiles to Map
	var parkLayer = L.geoJson(parks, {}).addTo(map);
	var parksOn = true;
	function toggleParksLayer(){
		if (parksOn === true){
			map.removeLayer(parkLayer);
		} else {
			map.addLayer(parkLayer);
		}
		parksOn = !parksOn;
	}

	// adding district shapefiles to Map
	var districtLayer = L.geoJson(districts, {
		style: function style(feature) {
			return {
				fillColor: getColor(feature.properties.DISTRICT_N),
				weight: 1,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.4,
			};
		},
		onEachFeature: function onEachFeature(feature, layer) {
			// layer.bindPopup('District ' + feature.properties.DISTRICT_N);
			layer.on({
			        click: highlightFeature
			    });
		}
	}).addTo(map);

	var districtOn = true;
	function toogleDistrictsLayer(){
		console.log("test");
		if (districtOn === true){
			map.removeLayer(districtLayer);
		} else {
			map.addLayer(districtLayer);
		}
		districtOn = !districtOn;
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

	// Hover highlight feature
	function highlightFeature(e) {
		districtLayer.eachLayer( function resetHighlight(layer) {
		    districtLayer.resetStyle(layer);
		    info.update();
	});

    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
	    info.update(layer.feature.properties);
	    map.fitBounds(e.target.getBounds());
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