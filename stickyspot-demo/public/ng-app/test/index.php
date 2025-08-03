<?php
// 
//echo "<pre>";print_r($_REQUEST);die;
//{"hub_mode":"subscribe","hub_challenge":"175747546","hub_verify_token":"stickyspotcrm"}
$page_id = "";
$object = "";
$type = "";
$challenge = "";
$verify_token = "";
if (isset($_REQUEST['hub_challenge']) && isset($_REQUEST['hub_verify_token'])) {
    $challenge = $_REQUEST['hub_challenge'];
    $verify_token = $_REQUEST['hub_verify_token'];
}
//$ip = $_SERVER['SERVER_ADDR'];
//$port = $_SERVER['SERVER_PORT'];
//$finalName = $ip."(".$port.").txt";
if ($challenge != "") {
    echo $challenge;
} else {
    $object = "error";
    //$finalName = date("d-m-y h:i:s")."_error.txt";
    //$content = json_encode(array("error"=>"not data found") );
    //file_put_contents($finalName, $content);
}

$finalName = date("d-m-y h:i:s") . "_input.txt";
$content = file_get_contents('php://input');

//lead content
//$content = '{"object": "page", "entry": [{"id": "521661014691560", "time": 1657198808, "changes": [{"value": {"adgroup_id": "6303148372050", "ad_id": "6303148372050", "created_time": 1657198802, "leadgen_id": "775324273492217", "page_id": "521661014691560", "form_id": "303770588554590"}, "field": "leadgen"}]}]}';

//mesage content
//$content = '{"object":"page","entry":[{"id":"521661014691560","time":1661838940578,"messaging":[{"sender":{"id":"5503065669778522"},"recipient":{"id":"521661014691560"},"timestamp":1661838940988,"read":{"watermark":1661838940372}}]}]}';
//$content = '{"object":"page","entry":[{"id":"521661014691560","time":1661838959348,"messaging":[{"sender":{"id":"5503065669778522"},"recipient":{"id":"521661014691560"},"timestamp":1661838938095,"message":{"mid":"m_ZRdo0XK0pJjtLo91PUQ6PDLiatXN8Vvtyk9-zbfIvWFq_tQSUgNyc_D0wtCgEnco1gjjXehcPaJDMVkJU--zOw","text":"Where are you located?"}}]}]}';

$content_array = json_decode($content, true);
if(isset($content_array['entry'][0]['id']))
    $page_id = $content_array['entry'][0]['id'];

//echo "<pre>";print_r($content_array);die;

file_put_contents($finalName, $content);
//$finalName = date("d-m-y h:i:s")."_request.txt";
//$content = json_encode($_REQUEST);
//file_put_contents($finalName, $content);


if (isset($content_array['object']))
    $object = $content_array['object'];

$output_value = [];
$lead_data = arrayKeySearch($content_array, 'changes', $output_value);
if ($lead_data) {
    $type = 'changes';
}
$output_value = [];
$msg_data = arrayKeySearch($content_array, 'messaging', $output_value);
if ($msg_data) {
    $type = 'messaging';
}
// echo $type;
// echo "<pre>";print_r($lead_data);
// echo "<pre>";print_r($msg_data);
// die('test');
///Insert Into Database
$servername = "localhost";
$username = "halwapk7_narendra";
$password = "H(CpPWS7kS9k";
$dbname = "halwapk7_stickyspot";

// $username = "root";
// $password = "";
// $dbname = "stickyspot_dev";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO webhook_fb (`object`,`type`,`content`) VALUES ('$object','$type','$content')";


if ($conn->query($sql) === TRUE) {
    // echo "New record created successfully";
} else {
    // echo "Error: " . $sql . "<br>" . $conn->error;
}

//Insert leadgen table
if ($lead_data) {
    //echo "<pre>";print_r($lead_data);die;
    $sql = "INSERT INTO leadgen ( " . implode(', ', array_keys($lead_data[0]['value'])) . ") VALUES (" . implode(', ', array_values($lead_data[0]['value'])) . ")";
    $conn->query($sql);
}

//insert message table
if ($msg_data) {
    if (isset($msg_data[0]['message']['text'])) {
        $sender_id = $msg_data[0]['sender']['id'];
        $recipient_id = $msg_data[0]['recipient']['id'];
        $timestamp = $msg_data[0]['timestamp'];
        $message = $msg_data[0]['message']['text'];

        $sql = "INSERT INTO leadmsg (`page_id`,`sender_id`,`recipient_id`,`timestamp`,`message`) VALUES ('$page_id', '$sender_id', '$recipient_id', '$timestamp', '$message ') ";
        $conn->query($sql);
        // if ($conn->query($sql) === TRUE) {
        //     echo "New record created successfully";
        // } else {
        //     echo "Error: " . $sql . "<br>" . $conn->error;
        // }
    }
}
$conn->close();

runCronJob();

//Search key array into multi dimension array of any depth size
function arrayKeySearch(array $haystack, string $search_key, &$output_value, int $occurence = 1)
{
    foreach ($haystack as $key => $value) {
        if ($key === $search_key) {
            //echo "<br>=$key-$search_key=";print_r($value);
            //$output_value[] = $value; //for occurence result
            $output_value = $value; //single data
        }
        if (gettype($value) == 'array') arrayKeySearch($value, $search_key, $output_value);
    }
    return $output_value;
}

function runCronJob()
{
    $ch = curl_init();
    // set URL and other appropriate options
    curl_setopt($ch, CURLOPT_URL, "https://stickyspot.com/cronJob");
    curl_setopt($ch, CURLOPT_HEADER, 0);
    // grab URL and pass it to the browser
    curl_exec($ch);
    // close cURL resource, and free up system resources
    curl_close($ch);
}
