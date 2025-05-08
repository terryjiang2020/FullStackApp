<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
//echo "Testing";

// Check if script is being run on server startup and setup cron job
$setupCron = isset($_GET['setup_cron']) && $_GET['setup_cron'] === 'true';
if ($setupCron || (php_sapi_name() === 'cli' && isset($argv) && in_array('--setup-cron', $argv))) {
    setupConnectivityCronJob();
}

include 'DBConnect.php';
$objectDB = new DbConnect;
$conn = $objectDB->connect();
//var_dump($connection);
//print_r($_POST);
//print_r(file_get_contents('php://input'));

$user = file_get_contents('php://input');
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  // Handle GET request
  case "GET":
    print_r('GET is triggered');
    Handle special parameter for connectivity check
    if (isset($_GET['check_connectivity']) && $_GET['check_connectivity'] === 'true') {
        checkConnectivity();
        exit;
    }
    
    $sql = "SELECT * FROM users";
    $path = explode('/', $_SERVER['REQUEST_URI']);
    if (isset($path[3]) && is_numeric($path[3])) {
      $sql .= " WHERE id = :id";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':id', $path[3]);
      $stmt->execute();
      $users = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
      $stmt = $conn->prepare($sql);
      $stmt->execute();
      $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode($users);
    break;

  case "POST":
    print_r('POST is triggered');
    $user = json_decode(file_get_contents('php://input'));
    $sql = "INSERT INTO users(id, name, email, mobile, created_at, updated_at) VALUES(null, :name, :email, :mobile, :created_at, :updated_at)";
    $stmt = $conn->prepare($sql);
    $created_at = date('Y-m-d');
    $updated_at = date('Y-m-d');
    $stmt->bindParam(':name', $user->name);
    $stmt->bindParam(':email', $user->email);
    $stmt->bindParam(':mobile', $user->mobile);
    $stmt->bindParam(':created_at', $created_at);
    $stmt->bindParam(':updated_at', $updated_at);

    if ($stmt->execute()) {
      $response = ['status' => 1, 'message' => 'Record created successfully.'];
    } else {
      $response = ['status' => 0, 'message' => 'Failed to create record.'];
    }
    echo json_encode($response);
    break;
}

/**
 * Function to check both internet and database connectivity
 * This will be called by the cron job
 */
function checkConnectivity() {
    // Check internet connectivity (reusing existing functionality)
    include_once 'check_internet.php';
    
    // Check database connectivity
    try {
        $dbConnect = new DbConnect;
        $conn = $dbConnect->connect();
        $timestamp = date('Y-m-d H:i:s');
        $dbStatus = "Connected";
    } catch (Exception $e) {
        $timestamp = date('Y-m-d H:i:s');
        $dbStatus = "Disconnected: " . $e->getMessage();
    }
    
    // Log database connectivity
    $logFile = __DIR__ . '/connectivity_log.txt';
    $logMessage = "[{$timestamp}] Database connection status: {$dbStatus}\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
    
    // Return statuses as JSON
    $response = [
        'timestamp' => $timestamp,
        'internet' => $isConnected ?? false,
        'database' => ($dbStatus === "Connected")
    ];
    
    echo json_encode($response);
}

/**
 * Sets up a cron job to check connectivity every hour
 */
// function setupConnectivityCronJob() {
//     $scriptPath = realpath(__DIR__);
//     $phpPath = shell_exec('which php');
//     $phpPath = trim($phpPath);
    
//     // Create a cron entry that will run every hour
//     $cronCommand = "0 * * * * $phpPath $scriptPath/index.php?check_connectivity=true > /dev/null 2>&1";
    
//     // Get current crontab
//     $output = [];
//     exec('crontab -l 2>/dev/null', $output);
    
//     // Check if our command is already in crontab
//     $alreadyExists = false;
//     foreach ($output as $line) {
//         if (strpos($line, 'index.php?check_connectivity=true') !== false) {
//             $alreadyExists = true;
//             break;
//         }
//     }
    
//     if (!$alreadyExists) {
//         // Add our command
//         $output[] = $cronCommand;
        
//         // Write to a temporary file
//         $tempFile = tempnam(sys_get_temp_dir(), 'cron');
//         file_put_contents($tempFile, implode(PHP_EOL, $output) . PHP_EOL);
        
//         // Install new crontab
//         exec('crontab ' . $tempFile);
//         unlink($tempFile);
        
//         echo "Connectivity check cron job has been setup successfully. Will run every hour.\n";
//     } else {
//         echo "Connectivity check cron job already exists.\n";
//     }
    
//     // Execute a check immediately
//     checkConnectivity();
// }