var map, layer, geojson_layer, styleBuilding;
 
OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
 
function init(){
	map = new OpenLayers.Map( 'map');
	
	// OSM layer
	layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
	map.addLayer(layer);
	
	// GeoJSON building layer
	geojson_layer = new OpenLayers.Layer.Vector("GeoJSON", {
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
				url: "data/GeoJSON/building.json",
				format: new OpenLayers.Format.GeoJSON()
		})
	});
	map.addLayer(geojson_layer);

	// Function called on highlight
	var report = function(e) {
		OpenLayers.Console.log(e.type, e.feature.id);
	};

	// Highlight control            
	var highlightCtrl = new OpenLayers.Control.SelectFeature(geojson_layer, {
		hover: true,
		highlightOnly: true,
		renderIntent: "temporary",
		eventListeners: {
			beforefeaturehighlighted: report,
			featurehighlighted: report,
			featureunhighlighted: report
		}
	});
	
	// Select control
	var selectCtrl = new OpenLayers.Control.SelectFeature(geojson_layer,
		{clickout: true}
	);

	map.addControl(highlightCtrl);
	map.addControl(selectCtrl);

	highlightCtrl.activate();
	selectCtrl.activate();
	
	map.setCenter(
		// Melbourne Uni
		new OpenLayers.LonLat(144.96, -37.8).transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
		), 17
	);
}
