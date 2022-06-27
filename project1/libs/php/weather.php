<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
	$url='https://api.openweathermap.org/data/2.5/weather?lat=' . $_REQUEST['latt'] . '&lon=' .$_REQUEST['long'] . '&units=metric&appid=3e831d7a9538b6393bed8bf9c5132cce';

	$ch = curl_init();

    curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt( $ch, CURLOPT_USERAGENT, $userAgent );
	

	$result=curl_exec($ch);
	
    $decode = json_decode($result, true);

    echo json_encode($decode);
	
	

    curl_close($ch);
    
?>