<?php
/**
 * Retrieves the details of a specific building given its OSM ID
 */

# Includes
require_once("../inc/error.inc.php");
require_once("../inc/database.inc.php");
require_once("../inc/security.inc.php");

# Set arguments for error email 
$err_user_name = "Herve";
$err_email = "hsenot@gmail.com";

# Retrive URL arguments
try {

	if (isset($_REQUEST['format'])) 
	{ $format = $_REQUEST['format'];}
	else
	{ $format = 'json'; }
	
	if (isset($_REQUEST['osm_id'])) 
	{ $osm_id = $_REQUEST['osm_id'];}
	else 
	{ trigger_error("Caught Exception: the web service requires a parameter: osm_id", E_USER_ERROR);}

	if (isset($_REQUEST['desc'])) 
	{ $project_desc = $_REQUEST['desc'];}
	if (isset($_REQUEST['fund'])) 
	{ $project_fund = $_REQUEST['fund'];}
	if (isset($_REQUEST['cost'])) 
	{ $project_cost = $_REQUEST['cost'];}
	if (isset($_REQUEST['payback'])) 
	{ $project_payback = $_REQUEST['payback'];
		if ($project_payback =='')
		{
			$project_payback = 'null';
		}
	}
	
	if (isset($_REQUEST['emission'])) 
	{ $project_emission = $_REQUEST['emission'];
		if ($project_emission =='')
		{
			$project_emission = 'null';
		}	
	}


} 
catch (Exception $e) {
    trigger_error("Caught Exception: " . $e->getMessage(), E_USER_ERROR);
}

# Performs the query and returns XML or JSON
try {
	// First we create the project
	$sql = "INSERT INTO project (description,funding,cost,payback_period,yearly_emission_reduction_t) VALUES ('".addslashes(urldecode($project_desc))."',".$project_fund.",".$project_cost.",".$project_payback.",".$project_emission.") returning id";
	$sql = sanitizeSQL($sql);
	//echo $sql;
	$pgconn = pgConnection();

	/*** fetch into an PDOStatement object ***/
    $recordSet = $pgconn->prepare($sql);
    $recordSet->execute();
    
    $project_id = '';
    
	while ($row  = $recordSet->fetch(PDO::FETCH_ASSOC))
	{
		foreach ($row as $key => $val)
		{
			if ($key == "id")
			{
				$project_id = $val;
			}
		}
	}
	
	// Then we attach the projetc to the building
	$sql2 = "INSERT INTO building_project (id_building,id_project) VALUES (".$osm_id.",".$project_id.")";
	$sql2 = sanitizeSQL($sql2);
	//echo $sql2;
	/*** fetch into an PDOStatement object ***/
    $recordSet2 = $pgconn->prepare($sql2);
    $recordSet2->execute();    

	if ($format == 'xml') {
		require_once("../inc/xml.pdo.inc.php");
		header("Content-Type: text/xml");
		echo rs2xml($recordSet);
	}
	elseif ($format == 'json') {
		//require_once("../inc/json.pdo.inc.php");
		header("Content-Type: application/json");
		$output='{"total_rows":"1","rows":[{"project_id":"'.$project_id.'"}]}';
		//For jsonp
		if (isset($_REQUEST['callback'])) {
			$output = $_REQUEST['callback'] . '(' . $output . ')';
		}		
		echo $output;
	}
	else {
		trigger_error("Caught Exception: format must be xml or json.", E_USER_ERROR);
	}
}
catch (Exception $e) {
	trigger_error("Caught Exception: " . $e->getMessage(), E_USER_ERROR);
}

?>