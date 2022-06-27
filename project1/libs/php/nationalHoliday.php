<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
	$url='https://calendarific.com/api/v2/holidays?&api_key=fe71c1c5965c49baa6c608e99082148f2fff2562&country=' . $_REQUEST['countryCode'] .'&year=2022';

	$ch = curl_init();

    curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt( $ch, CURLOPT_USERAGENT, $userAgent );
	

	$result=curl_exec($ch);
	
    $decode = json_decode($result, true);

    echo json_encode($decode);


    curl_close($ch);
    
?>