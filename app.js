var map, layer;
 
function init(){
	map = new OpenLayers.Map( 'map');
	layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
	map.addLayer(layer);
	map.setCenter(
		// Melbourne
		new OpenLayers.LonLat(144.97, -37.85).transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
		), 11
	);
}
