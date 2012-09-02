var olmap,layer,wfs_layer,building_layer,thresholdWFS=16;


// Adding a proxy to use WFS features from another server
OpenLayers.ProxyHost = "/geoexplorer/proxy?url=";

OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
 
function init(){

	// Some options are required to display a WMS on top of OSM
	// https://github.com/openlayers/openlayers/issues/350
	
	olmap = new OpenLayers.Map('map',{
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
	layer = new OpenLayers.Layer.OSM("Open Street Map");
	olmap.addLayer(layer);

	// Vector building layer
	wfs_layer = new OpenLayers.Layer.Vector("Buildings (clickable)", {
		strategies: [new OpenLayers.Strategy.BBOX()],
		protocol: new OpenLayers.Protocol.WFS({
			version: "1.1.0",
			url: "http://basemap.pozi.com/geoserver/wfs",
			featureType: "BUILDINGS",
			featureNS: "http://www.pozi.com/building",
			srsName: "EPSG:900913"
		})
	});

	// Image building layer
	building_layer = new OpenLayers.Layer.WMS("Buildings", 
		"http://basemap.pozi.com/geoserver/BUILDING/ows",
		{layers: 'BUILDINGS',format:'image/png8',transparent:true},
		{isBaseLayer: false,singleTile:true}
	);

	// Managing switch between WFS and WMS, depending on zoom level
	olmap.events.register("zoomend", this, function (e) {
    	if (olmap.getZoom() >= thresholdWFS) {
			// Close-up: we need WFS
        	if (olmap.getLayerIndex(wfs_layer)==-1)
			{olmap.addLayer(wfs_layer);wfs_layer.refresh({force:true});}

			// Buildings are clickable! Inform the user
			$("#current_building").html("Click on a building for more detail");

			// And we can get rid of the WMS layer
        	if (olmap.getLayerIndex(building_layer)>-1)
 			{olmap.removeLayer(building_layer);}
			
    	}
    	else
    	{
    		// Removing the WFS layer
        	if (olmap.getLayerIndex(wfs_layer)>-1)
			{olmap.removeLayer(wfs_layer);}

			// Display a message to say the buildings are not clickable
			$("#current_building").html("Zoom in to be able to click on buildings");

			// Bringing the WMS layer into play
        	if (olmap.getLayerIndex(building_layer)==-1)
			{olmap.addLayer(building_layer);}
			
    	}
	});


	// Function called on highlight
	var report = function(e) {
		var display_message;
		OpenLayers.Console.log(e.type, e.feature.id);
		if (e.feature.data.name)
		{
			display_message = "This is the '"+e.feature.data.name+"' building";
		}
		else
		{
			display_message = "This building has no name";
		}
		$("#current_building").html(display_message);
		
	};

	// Function called when hovering outside a building
	var reportOut = function(){
		$("#current_building").html("&nbsp;");
	};

	// Highlight control            
	var highlightCtrl = new OpenLayers.Control.SelectFeature(wfs_layer, {
		hover: true,
		highlightOnly: true,
		renderIntent: "temporary",
		eventListeners: {
			beforefeaturehighlighted: report,
			featurehighlighted: report,
			featureunhighlighted: reportOut
		}
	});
	
	// Select control
	var selectCtrl = new OpenLayers.Control.SelectFeature(wfs_layer,
		{clickout: true}
	);

	olmap.addControl(highlightCtrl);
	olmap.addControl(selectCtrl);

	highlightCtrl.activate();
	selectCtrl.activate();

	// Set map center on Melbourne Uni
	olmap.setCenter(
		new OpenLayers.LonLat(144.96, -37.8).transform(
			new OpenLayers.Projection("EPSG:4326"),
			olmap.getProjectionObject()
		), 17
	);
}