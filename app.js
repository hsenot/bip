var map,layer, geojson_layer,building_layer;
 
OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
 
function init(){

	// Some options are required to display a WMS on top of OSM
	// https://github.com/openlayers/openlayers/issues/350
	
	map = new OpenLayers.Map('map',{
    	projection: new OpenLayers.Projection("EPSG:900913"),
    	units: "m",
    	maxResolution: 156543.0339,
    	maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		controls: [
                        new OpenLayers.Control.Navigation(),
                        new OpenLayers.Control.Zoom(),
                        new OpenLayers.Control.LayerSwitcher({'ascending':false}),
                        new OpenLayers.Control.ScaleLine()
                    ]
	});
	
	// OSM layer
	layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
	map.addLayer(layer);

/*
	// GeoJSON building layer
	geojson_layer = new OpenLayers.Layer.Vector("GeoJSON", {
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
				url: "data/GeoJSON/building.json",
				format: new OpenLayers.Format.GeoJSON()
		})
	});
	map.addLayer(geojson_layer);
*/

	building_layer = new OpenLayers.Layer.WMS("Buildings", 
		"http://basemap.pozi.com/geoserver/BUILDING/ows",
		{layers: 'BUILDINGS',format:'image/png8',transparent:true},
		{isBaseLayer: false,singleTile:true}
	);
	map.addLayer(building_layer);

/*
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
*/

	map.setCenter(
		// Melbourne Uni
		new OpenLayers.LonLat(144.96, -37.8).transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
		), 17
	);
}
