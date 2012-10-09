<?php
/**
 * Database Include
 * Handles all database functions required by the REST web services.
 */



#Use this to work arround lack of document_root variable under PHP CGI.
//if( empty($_SERVER['DOCUMENT_ROOT']) )
//{
//	$_SERVER['DOCUMENT_ROOT'] = dirname("c:/inetpub/wwwroot/rest");
//}
	

/**
 * Return postgres data connection
 * @return 		object		- adodb data connection
 */
function pgConnection() {
	include 'settings.php';
	$conn = new PDO ($conn_str,$conn_user,$conn_pwd, array(PDO::ATTR_PERSISTENT => true));
    return $conn;
}
	
?>