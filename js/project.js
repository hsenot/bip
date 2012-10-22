 var showProjectDetails = function(pid){
	// Mask other tabs and show details tab
	$("#dashboardTabLabel").removeClass('active');
	$("#dashboardTab").removeClass('active');
	$("#searchTabLabel").removeClass('active');
	$("#searchTab").removeClass('active');
	$("#detailsTabLabel").show();
	$("#detailsTabLabel").addClass('active');
	$("#detailsTab").addClass('active');
	
	// We could probably add a loading indicator
	$('#projectDetailsForm').html('Loading details ...');

	// AJAX call to the different APIs to retrieve the related data
	// Direct building data
	$.getJSON(   
		'ws/project/read_by_id.php',  
		{id: pid,config:'bip'},  
		function(json) {  
			var s = "No detail found for project id "+fid;
			// If the response JSON contains some details (attributes), make an HTML table out of them
			if (json.rows.length>0)
			{
				// Decoding the path to the different variables
				var a=[];
					
				// Id as title
				var bn = json.rows[0].row.id;
				a.push('<legend><h2>'+bn+'</h2></legend>');

				// Then a table of attributes
				a.push('<table class="table table-striped table-hover">');

				var fid = json.rows[0].row.osm_id;		
				// Permalink as OSM_ID
				a.push('<tr>');
				a.push('<td>' + 'Building' + '</td>');
				a.push('<td>' + '<a href="buildings.html?osm_id='+fid+'">'+fid+'</a>' + '</td>');
				a.push('</tr>');					
				
				$.each(json.rows[0].row, function (key, val) {
					if ((key !=="osm_id")&&(key !== "id"))
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
			$('#projectDetailsForm').html(s);
		}  
	);				
		
	// TODO: multiple buildings for a project API

	var loadTags = function(){
		$.getJSON(   
			'ws/project/tag_read.php',  
			{pid: pid,config:'bip'},  
			function(json) {
				var tag_array=[];
			
				// Build an array of tags, which we use to initialise the component
				$.each(json.rows, function (r) {
					tag_array.push(json.rows[r].row.label);
				});

				// Initialise the tag manager			
				$(".tagManager").tagsManager({
					prefilled: tag_array,
					// blink options used to detect and signal duplicate tags
					blinkBGColor_1: '#FFFF9C',
					blinkBGColor_2: '#CDE69C',
					preventSubmitOnEnter: true,
					// can use comma or enter to type in a new tag
					delimeters:[188,13],
					hiddenTagListName:'projectTagList'
				});		
		});
	}

	loadTags();	
	
	
	$('#tagSaveButton').click(function(){
		// Saving the tags associated to this project
		var postUrl =  "ws/project/tag_write.php?callback=?";
		$.post(
				postUrl,
				{
					pid: pid,
					config: 'bip',		
					tags: $('input[name=projectTagList]').val()
				},  
				function(responseText){  
					alert("Submitted");
				},  
				"json"
		);		
	});
	
	// TODO: data API

	// TODO: people API
		
};

