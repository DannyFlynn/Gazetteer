<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
	$url='https://newsapi.org/v2/top-headlines?en=gb&country=' . $_REQUEST['country'] . '&apiKey=37d98a24abd341b89c6b1baddebf9d64';

	$ch = curl_init();
	
    curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt( $ch, CURLOPT_USERAGENT, $userAgent );
	

	$result=curl_exec($ch);
	
    $decode = json_decode($result, true);

    echo json_encode($decode);
	

    curl_close($ch);
?>