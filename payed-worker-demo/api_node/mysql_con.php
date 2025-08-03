 <?php
//Testing Database connection

$host = 'DB_HOST';
$username = 'DB_USER';
$password = 'DB_PASSWORD'; 
$database = 'DB_NAME';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?> 