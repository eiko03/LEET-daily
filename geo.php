<?php
header('Content-type: text/plain;charset=UTF-8');
// URL of the GeoJSON file
$url = 'https://www.spc.noaa.gov/products/outlook/archive/2023/day1otlk_20230331_1630_cat.lyr.geojson';
//$url = "https://www.spc.noaa.gov/products/outlook/day1otlk_cat.nolyr.geojson";
// Get the GeoJSON data
$data = file_get_contents($url);

// Decode the JSON data
$json_data = json_decode($data, true);

$label="";
$colors="";

$today = date("D M j Y G:i:s T");
// Create the header information with hard returns
$headerInfo = [
    "Title: Day 1 Outlook - ".$today." - PlacefileNation",
    "Refresh: 2",
    "Color: 200 200 255",
    'Font: 1, 11, 1, \'Arial\'',
    "Threshold: 999",
];

// Print the header information with hard returns
$string = (implode(PHP_EOL, $headerInfo) . PHP_EOL . PHP_EOL);

foreach ($json_data['features'] as $feature) {

    $valid = substr($feature['properties']['VALID'], 8);


    $colors = str_replace(
        ['General Thunderstorms Risk','Marginal Risk','Slight Risk','Enhanced Risk','Moderate Risk','High Risk'],
        ["Color: 183 233 193","Color: 0 176 80","Color: 255 255 0","Color: 255 163 41","Color: 255 0 0", "Color: 255 0 255"],
        $feature['properties']['LABEL2']
    );

    $label2 = str_replace(
        ['General Thunderstorms Risk','Marginal Risk','Slight Risk','Enhanced Risk','Moderate Risk','High Risk'],
        ['Line: 2, 0, "Day 1 General Thunderstorm Risk - ','Line: 4, 0, "Day 1 Marginal Risk - ','Line: 5, 0, "Day 1 Slight Risk - ','Line: 6, 0, "Day 1 Enhanced Risk - ','Line: 7, 0, "Day 1 Moderate Risk - ', 'Line: 8, 0, "Day 1 High Risk - '],
        $feature['properties']['LABEL2']
    );


    $string.=$colors. "\n".$label2.$valid. "\n";

    $argument = $feature['geometry']['coordinates'][0];

    if(count($argument) == 1){
        $argument = $argument[0];
    }

    get_data($argument);


    // Convert coordinates array to string and remove brackets
    $string.= "End:"."\n\n";

}
echo $string;
//file_put_contents('data.txt', $string);


function get_data($coordinates){
    global $string;
    foreach ( $coordinates as $coordinate) {
        $string.=$coordinate[1] .",".$coordinate[0]. "\n";
    }
}




?>