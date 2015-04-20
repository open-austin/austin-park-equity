var map = new AustinMap('map');

function AustinMap(attributes){
	var map = L.map('map', {
		center: [30.304539565829106, -97.73300170898438], //Austin!
		zoom: 10,
		scrollWheelZoom: false
	});

	//  add tile Layer from Mapquest
	L.tileLayer(
	    // Mapbox Streets-Satellite
	    'http://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF0ZW9jb2RlcyIsImEiOiJUZVVZSVBvIn0.PkZleldXk_6KCuoGhx6-CA'

		// Satelite Tile
		// 'http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg'

		// Plain (ugly) Mapquest Tiles
		// 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg'

		// Open Street Map Tile
	    // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	).addTo(map);
}