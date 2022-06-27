<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
	$url='https://restcountries.com/v3.1/name/' . $_REQUEST['country'] . '?fullText=true';

	$ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt( $ch, CURLOPT_USERAGENT, $userAgent );
	

	$result=curl_exec($ch);
	
    $decode = json_decode($result, true);

    echo json_encode($decode);

    curl_close($ch);
    
?>