<?php
//two lines below will initiate error reporting so I can errors directly in the browser 
ini_set('display_errors', 'on');
error_reporting(E_ALL);

$url = "http://api.geonames.org/earthquakesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&username=danny";

// Initialize Curl 
$ch = curl_init();


curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
//print_r($result);    success 

// close the session.
curl_close($ch);

$decode = json_decode($result, true);
//print_r($decode); 

//print(json_encode($decode));

echo json_encode($decode);