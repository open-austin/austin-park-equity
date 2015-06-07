(function(){

	var grayscale = L.tileLayer.provider('CartoDB.Positron');

	var map = L.map('map', {
		center: [30.26618, -97.74467], //Austin!
		zoom: 12,
		scrollWheelZoom: false,
		layers: [grayscale]
	});

	var baseMaps = {
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
		onEachFeature: onEachParkFeature
	}).addTo(map);

	window.scores = [];
	// higher value = more need
	for (var i = 0; i <= censusTract.length - 1; i++) {
		current = censusTract[i].demographics;

		// Age Under 19
		censusTract[i].demographics.ageRatioUnder19 < 0.10 ? current.needScore = 0 :
		censusTract[i].demographics.ageRatioUnder19 < 0.15 ? current.needScore = 1 :
		censusTract[i].demographics.ageRatioUnder19 < 0.20 ? current.needScore = 2 :
		censusTract[i].demographics.ageRatioUnder19 < 0.25 ? current.needScore = 3 :
		censusTract[i].demographics.ageRatioUnder19 < 0.30 ? current.needScore = 4 :
		censusTract[i].demographics.ageRatioUnder19 < 0.35 ? current.needScore = 5 :
		censusTract[i].demographics.ageRatioUnder19 < 0.40 ? current.needScore = 6 :
															 current.needScore = 7; 

		// Health Insurance Coverage 
		censusTract[i].demographics.healthInsuranceCoverage > 40 ? current.needScore += 0 :
		censusTract[i].demographics.healthInsuranceCoverage > 35 ? current.needScore += 1 :
		censusTract[i].demographics.healthInsuranceCoverage > 30 ? current.needScore += 2 :
		censusTract[i].demographics.healthInsuranceCoverage > 25 ? current.needScore += 3 :
		censusTract[i].demographics.healthInsuranceCoverage > 20 ? current.needScore += 4 :
		censusTract[i].demographics.healthInsuranceCoverage > 15 ? current.needScore += 5 :
		censusTract[i].demographics.healthInsuranceCoverage > 10 ? current.needScore += 6 :
															 	   current.needScore += 7; 

		// Muilthousing Units
		current.multihousingRatio = (parseFloat(current.unitsSingleAttached) + parseFloat(current.unitsSingleDetached))/ parseFloat(current.unitsTotal);
		censusTract[i].demographics.multihousingRatio > 0.80 ? current.needScore += 0 :
		censusTract[i].demographics.multihousingRatio > 0.70 ? current.needScore += 1 :
		censusTract[i].demographics.multihousingRatio > 0.60 ? current.needScore += 2 :
		censusTract[i].demographics.multihousingRatio > 0.50 ? current.needScore += 3 :
		censusTract[i].demographics.multihousingRatio > 0.40 ? current.needScore += 4 :
		censusTract[i].demographics.multihousingRatio > 0.30 ? current.needScore += 5 :
		censusTract[i].demographics.multihousingRatio > 0.20 ? current.needScore += 6 :
															   current.needScore += 7; 
		scores.push(current.needScore); 
	};

	console.log(scores);
	// Adding Census Tract Shapefiles to Map
	var censusLayer = L.geoJson(censusTract, { 
		style: function style(feature){
			return {
				// fillColor: getAgeColor(feature.demographics.ageRatioUnder19),
				fillColor: getColor(feature.demographics.needScore),
				weight: 1,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.5
			};
		},
		onEachFeature: onEachCensusFeature
	}).addTo(map);
	censusLayer.bringToBack();

	function getAgeColor(d) {
        return d < 0.10  ? '#FFEDA0' :
	           d < 0.15  ? '#FED976' :
	           d < 0.20  ? '#FEB24C' :
	           d < 0.25  ? '#FD8D3C' :
	           d < 0.30  ? '#FC4E2A' :
	           d < 0.35  ? '#E31A1C' :
	           d < 0.40  ? '#BD0026' :
	     	   			   '#800026';
	}	

	function getColor(d) {
        return d < 14 ? '#FFEDA0' :
	           d < 15 ? '#FED976' :
	           d < 16 ? '#FEB24C' :
	           d < 17  ? '#FD8D3C' :
	           d < 18  ? '#FC4E2A' :
	           d < 19  ? '#E31A1C' :
	           d < 20  ? '#BD0026' :
	     	   			   '#800026';
	}

	function onEachCensusFeature(feature, layer) {
		var score = feature.demographics.needScore,
			children = feature.demographics.ageRatioUnder19,
			health = feature.demographics.healthInsuranceCoverage,
			apartment = feature.demographics.multihousingRatio;

		popupContent = "<p><span class='park-title'>Need Score: "+score+"</span> \
					<br>Pop Under 19: "+children+" \
					<br>Health Insurance Coverage : "+health+" \
					<br>Ratio Single Unit Housing : "+apartment+"</p>";

	    if (feature.properties) {
	        layer.bindPopup( popupContent );
	    }
	}

	function onEachParkFeature(feature, layer) {
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




})();
