var olmap,layer,wfs_layer,building_layer,thresholdWFS=16;


// Adding a proxy to use WFS features from another server
if (window.location.host.substring(0,9) == "localhost")
{
	OpenLayers.ProxyHost = "/geoexplorer/proxy?url=";
}
else
{
	OpenLayers.ProxyHost = "/bip/proxy.php?url=";
}

OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
 
var showBuildingDetails = function(fid){
	// Mask other tabs and show details tab
	$("#dashboardTabLabel").removeClass('active');
	$("#dashboardTab").removeClass('active');
	$("#mapTabLabel").removeClass('active');
	$("#mapTab").removeClass('active');
	$("#detailsTabLabel").show();
	$("#detailsTabLabel").addClass('active');
	$("#detailsTab").addClass('active');
	
	// We could probably add a loading indicator
	$('#buildingDetailsForm').html('Loading details ...');

	// AJAX call to the different APIs to retrieve the related data
	// Direct building data
	$.getJSON(   
		'ws/building/read.php',  
		{osm_id: fid,config:'bip'},  
		function(json) {  
			var s = "No detail found for building id "+fid;
			// If the response JSON contains some details (attributes), make an HTML table out of them
			if (json.rows.length>0)
			{
				// Decoding the path to the different variables
				var a=[];
					
				// Name as title - comes from OSM
				var bn = json.rows[0].row.name;
				if (!(bn))
				{
					bn = 'This building has no name';
					a.push('<legend>'+bn+'</legend>');
				}
				else
				{
					a.push('<legend><h2>'+bn+'</h2></legend>');
				}

				// Then a table of attributes
				a.push('<table class="table table-striped table-hover">');
					
				// Permalink as OSM_ID - comes from OSM
				a.push('<tr>');
				a.push('<td>' + 'Permalink (OSM ID)' + '</td>');
				a.push('<td>' + '<a href="buildings.html?osm_id='+fid+'">'+fid+'</a>' + '</td>');
				a.push('</tr>');					
				
				$.each(json.rows[0].row, function (key, val) {
					if (key !=="name")
					{
						a.push('<tr>');
						if (key.match(/_url$/))
						{
							a.push('<td>' + key.replace(/_url/,"")+ '</td>');
							if (val.match(/\.jpg/))
							{
								a.push('<td><img src="'+ val+'" class="img-polaroid" width=200 /></td>');
							}
							else
							{
								a.push('<td><a href="'+val+'">'+val+'</a></td>');
							}
						}
						else
						{
							a.push('<td>' + key+ '</td>');
							a.push('<td>' + val+ '</td>');
						}
						a.push('</tr>');
					}
				});
				a.push('</table>');
				s = a.join('');
			}
				
			// Injecting the details retrieved, if any
			$('#buildingDetailsForm').html(s);
		}  
	);				
		
	// TODO: project API
	
	// Call to the project API to retrieve existing projects 
	$.getJSON(   
		'ws/project/read_by_osm_id.php',  
		{osm_id: fid,config:'bip'},  
		function(json) {  
			var s = "<legend>No energy efficiency project found</legend>";
			if (json.rows.length>0)
			{
				var a=[];
				a.push("<legend><h2>Energy efficiency projects</h2></legend>");
				// Can we build the form in the JS and inject it entirely?
				// What's the best way to present records in a grid / table with bootstrap?
				a.push("<table class='table'>");

				// Adding the column headers, but only once
				a.push('<thead><tr>');						
				$.each(json.rows[0].row, function (k,v) {
					if (k !=="id")
					{
						a.push('<th>');
						a.push(k);
						a.push('</th>');						
					}
				});	
				// Details column
				a.push('<th>');
				a.push('Details');
				a.push('</th>');					
				a.push('</tr></thead>');						
					
				// On each row add an edit button with <a class="btn btn-small" href="#"><i class="icon-pencil"></i></a>
				$.each(json.rows, function (r) {
					a.push('<tr>');

					var current_project_id;						
					$.each(json.rows[r].row, function (k,v) {
						if (k =="id")
						{
							current_project_id = v;
						}
						else
						{
							a.push('<td>');
							a.push(v);
							a.push('</td>');
						}
					});

					a.push('<td><a class="btn btn-small" href="projects.html?pid='+current_project_id+'"><i class="icon-search"></i></a></td>');					
					a.push('</tr>');						
				});

				a.push("</table>");
				s = a.join('');
			}

			// Injecting the details retrieved, if any
			$('#buildingProjectsTable').html(s);
		}
	);
		
	// Showing / hiding form for new project input
	$('#addProjectShowButton').click(function(){
		var f = $('#addProjectForm');
		if (f.hasClass('hide'))
		{
			f.show();
			f.removeClass('hide');
		}
		else
		{
			f.hide();
			f.addClass('hide');
		}
	});
		
	// Value necessary for the form submission
	$('#addProjectFormButton').click(function(){
		// Format and control values
			
			
		// Send a POST request 
		var postUrl = "ws/project/write.php?callback=?";  

		$.post(
				postUrl,
				{
					osm_id: fid,
					config: 'bip',		
					desc: 		encodeURI($('#addProjectDesc').val()),
					fund: 		$('#addProjectFund').val(),
					cost: 		$('#addProjectCost').val(),
					payback: 		$('#addProjectPayback').val(),
					emission: 		$('#addProjectEmission').val()
				},  
				function(responseText){  
					//alert("Submitted");
					// Reload the page to get a better presentation of the projects
					window.location.href="buildings.html?osm_id="+fid;
					
				},  
				"json"
		);
			
	});
		
		
	// TODO: data API

	// TODO: people API
		
		
};

 
 
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

	var showDetails = function(e){
		// Clicked feature ID comes from event
		var fid = e.feature.fid.replace(/BUILDINGS\./,"");
		// Showing the clicked building details
		showBuildingDetails(fid);
	};
	
	var hideDetails = function(){
		// Hide details tab
		$("#detailsTabLabel").hide();
	};

	// Highlight control            
	var highlightCtrl = new OpenLayers.Control.SelectFeature(wfs_layer, {
		hover: true,
		highlightOnly: true,
		renderIntent: "temporary",
		eventListeners: {
			featurehighlighted: report,
			featureunhighlighted: reportOut
		}
	});
	
	// Select control
	var selectCtrl = new OpenLayers.Control.SelectFeature(wfs_layer,{
		clickout: true,
		eventListeners: {
			featurehighlighted: showDetails,
			featureunhighlighted: hideDetails
		}
	});

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
