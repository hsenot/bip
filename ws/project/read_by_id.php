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
	
	if (isset($_REQUEST['id'])) 
	{ $id = $_REQUEST['id'];}
	else 
	{ trigger_error("Caught Exception: the web service requires a parameter: osm_id", E_USER_ERROR);}

} 
catch (Exception $e) {
    trigger_error("Caught Exception: " . $e->getMessage(), E_USER_ERROR);
}

# Performs the query and returns XML or JSON
try {
	// First we create the project
	$sql = "select b.osm_id,p.id as id,p.description as \"Description\", p.cost as \"Cost ($)\",p.payback_period as \"Payback Period (years)\", yearly_emission_reduction_t as \"Estimated CO2-e reduction (t/yr)\",(select pft.label from project_funding_type pft where pft.code=p.funding) as \"Funding source\" from project p,building_project bp,building b where p.id=bp.id_project and b.osm_id=bp.id_building and p.id=".$id;
	$sql = sanitizeSQL($sql);
	//echo $sql;
	$pgconn = pgConnection();

	/*** fetch into an PDOStatement object ***/
    $recordSet = $pgconn->prepare($sql);
    $recordSet->execute();
    
	if ($format == 'xml') {
		require_once("../inc/xml.pdo.inc.php");
		header("Content-Type: text/xml");
		echo rs2xml($recordSet);
	}
	elseif ($format == 'json') {
		require_once("../inc/json.pdo.inc.php");
		header("Content-Type: application/json");
		echo rs2json($recordSet);
	}
	else {
		trigger_error("Caught Exception: format must be xml or json.", E_USER_ERROR);
	}
}
catch (Exception $e) {
	trigger_error("Caught Exception: " . $e->getMessage(), E_USER_ERROR);
}

?>