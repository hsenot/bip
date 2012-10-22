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
	
	if (isset($_REQUEST['pid'])) 
	{ $pid = $_REQUEST['pid'];}
	else 
	{ trigger_error("Caught Exception: the web service requires a parameter: pid", E_USER_ERROR);}
	
	if (isset($_REQUEST['tags'])) 
	{ $tags = $_REQUEST['tags'];}

} 
catch (Exception $e) {
    trigger_error("Caught Exception: " . $e->getMessage(), E_USER_ERROR);
}

# Performs the query and returns XML or JSON
try {

	$tagArray = explode(",", $tags);
	$pgconn = pgConnection();

	// Cleaning up existing tags for this project
	$sql = "DELETE from project_tag WHERE id_project=".$pid;
	$sql = sanitizeSQL($sql);
	//echo $sql;

	/*** fetch into an PDOStatement object ***/
	$recordSet = $pgconn->prepare($sql);
	$recordSet->execute();
	
	for($i = 0; $i < count($tagArray); $i++){

		// First we create the tag but only if it's not already in the table
		$sql = "INSERT INTO tag (label) SELECT '".$tagArray[$i]."' WHERE NOT EXISTS (SELECT 1 FROM tag t WHERE t.label='".$tagArray[$i]."')";
		$sql = sanitizeSQL($sql);
		//echo $sql;

		/*** fetch into an PDOStatement object ***/
		$recordSet = $pgconn->prepare($sql);
		$recordSet->execute();

		// We select the tag record - either it existed before the insert, either it exists because of this new insert!
		$sql = "SELECT id FROM tag WHERE label='".$tagArray[$i]."'";
		$sql = sanitizeSQL($sql);
		//echo $sql;

		/*** fetch into an PDOStatement object ***/
		$recordSet = $pgconn->prepare($sql);
		$recordSet->execute();
    
		$tag_id = '';
		while ($row  = $recordSet->fetch(PDO::FETCH_ASSOC))
		{
			foreach ($row as $key => $val)
			{
				if ($key == "id")
				{
					$tag_id = $val;
				}
			}
		}
	
		// Then we attach the projetc to the building
		$sql2 = "INSERT INTO project_tag (id_tag,id_project) VALUES (".$tag_id.",".$pid.")";
		$sql2 = sanitizeSQL($sql2);
		//echo $sql2;
		/*** fetch into an PDOStatement object ***/
    	$recordSet2 = $pgconn->prepare($sql2);
    	$recordSet2->execute();    
	}

	// Cleaning up existing tags for this project
	$sql = "DELETE from tag WHERE id NOT IN (SELECT id_tag FROM project_tag)";
	$sql = sanitizeSQL($sql);
	//echo $sql;

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
		echo "{\"total_rows\":\"1\",\"rows\":[{\"tags_updated\":\"".count($tagArray)."\"}]}";
	}
	else {
		trigger_error("Caught Exception: format must be xml or json.", E_USER_ERROR);
	}
}
catch (Exception $e) {
	trigger_error("Caught Exception: " . $e->getMessage(), E_USER_ERROR);
}

?>