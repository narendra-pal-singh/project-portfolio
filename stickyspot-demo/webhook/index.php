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

$content = file_get_contents('php://input');
$content_array = json_decode($content, true);

if ($challenge != "") {
    echo $challenge;
    $finalName = date("d-m-y h:i:s") . "_challenge.txt";
    $file_data = json_encode(array("REQUEST" => $_REQUEST, 'content' => $content_array));
    //file_put_contents($finalName, $file_data);
} else {
    $finalName = date("d-m-y h:i:s") . "_nonchallenge.txt";
    $file_data = json_encode(array("REQUEST" => $_REQUEST, 'content' => $content_array));
    //file_put_contents($finalName, $file_data);
}

$finalName = date("d-m-y h:i:s") . "_input.txt";

if (isset($content_array['entry'][0]['id'])) {
    $page_id = $content_array['entry'][0]['id'];
}

//file_put_contents($finalName, $content);

if ($content_array && $page_id) {

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
    if ($object != "" && $content != "") {
        $servername = "localhost";
        $username = "#####";
        $password = "########";
        $dbname = "db###_stickyspot";

        // $username = "root";
        // $password = "";
        // $dbname = "stickyspot_dev";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            //die("Connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO webhook_fb (`object`,`type`,`content`) VALUES ('$object','$type','$content')";

        if ($conn->query($sql) === TRUE) {

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
                    $message = trim($msg_data[0]['message']['text']);
                    
                    $mid = '';
                    if(isset($msg_data[0]['message']['mid']))
                    $mid = trim($msg_data[0]['message']['mid']);

                    $sql = "SELECT * FROM leadmsg WHERE `page_id`='$page_id' AND `sender_id`='$sender_id' AND `recipient_id`='$recipient_id' AND `timestamp`='$timestamp' AND `message`='$message' AND `mid`='$mid'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                    } else {
                        $sql = "INSERT INTO leadmsg (`page_id`,`sender_id`,`recipient_id`,`timestamp`,`message`,`mid`) VALUES ('$page_id', '$sender_id', '$recipient_id', '$timestamp', '$message','$mid') ";
                        $conn->query($sql);
                        // if ($conn->query($sql) === TRUE) {
                        //     echo "New record created successfully";
                        // } else {
                        //     echo "Error: " . $sql . "<br>" . $conn->error;
                        // }
                    }
                }
            }
        } else {
            // echo "Error: " . $sql . "<br>" . $conn->error;
        }
        $conn->close();
    }

    runCronJob();
}
//Search key array into multi dimension array of any depth size
function arrayKeySearch(array $haystack, string $search_key, &$output_value, int $occurence = 1)
{
    if ($haystack) {
        foreach ($haystack as $key => $value) {
            if ($key === $search_key) {
                //echo "<br>=$key-$search_key=";print_r($value);
                //$output_value[] = $value; //for occurence result
                $output_value = $value; //single data
            }
            if (gettype($value) == 'array') arrayKeySearch($value, $search_key, $output_value);
        }
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
