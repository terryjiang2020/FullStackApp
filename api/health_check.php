<?php
/**
 * Backend Health Check API
 * Provides information about the server status and system health
 */

// Set headers to prevent caching
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-Type: application/json');

// Function to check database connection
function checkDatabase() {
    try {
        include 'DBConnect.php';
        $objectDB = new DbConnect;
        $conn = $objectDB->connect();
        
        // Simple query to test connection
        $stmt = $conn->query("SELECT 1");
        return [
            'status' => 'ok',
            'message' => 'Database connection successful'
        ];
    } catch (Exception $e) {
        return [
            'status' => 'error',
            'message' => 'Database connection failed: ' . $e->getMessage()
        ];
    }
}

// Function to check disk space
function checkDiskSpace() {
    $freeSpace = disk_free_space('/');
    $totalSpace = disk_total_space('/');
    $usedSpace = $totalSpace - $freeSpace;
    $percentUsed = round(($usedSpace / $totalSpace) * 100, 2);
    
    return [
        'status' => ($percentUsed < 90) ? 'ok' : 'warning',
        'total_space_mb' => round($totalSpace / 1024 / 1024, 2),
        'free_space_mb' => round($freeSpace / 1024 / 1024, 2),
        'used_percent' => $percentUsed,
        'message' => "Disk usage: {$percentUsed}%"
    ];
}

// Function to check system load
function checkSystemLoad() {
    if (function_exists('sys_getloadavg')) {
        $load = sys_getloadavg();
        $status = ($load[0] < 1.0) ? 'ok' : (($load[0] < 2.0) ? 'warning' : 'critical');
        
        return [
            'status' => $status,
            'load_1min' => $load[0],
            'load_5min' => $load[1],
            'load_15min' => $load[2],
            'message' => "System load (1/5/15 min): {$load[0]}/{$load[1]}/{$load[2]}"
        ];
    }
    
    return [
        'status' => 'unknown',
        'message' => 'System load information not available'
    ];
}

// Function to check internet connectivity (reusing code from check_internet.php)
function checkInternetConnection() {
    $connected = @fsockopen("8.8.8.8", 53, $errno, $errstr, 10);
    if ($connected) {
        fclose($connected);
        return [
            'status' => 'ok',
            'message' => 'Internet connection is working'
        ];
    }
    
    return [
        'status' => 'error',
        'message' => 'Internet connection is down'
    ];
}

// Function to check PHP version and memory usage
function checkPHPInfo() {
    return [
        'status' => 'info',
        'php_version' => phpversion(),
        'memory_limit' => ini_get('memory_limit'),
        'max_execution_time' => ini_get('max_execution_time') . 's',
        'memory_usage_mb' => round(memory_get_usage() / 1024 / 1024, 2),
        'message' => 'PHP ' . phpversion() . ' running'
    ];
}

// Check if this is being accessed via CLI or web
$isCLI = (php_sapi_name() === 'cli');

// Collect all health data
$healthData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server_name' => $_SERVER['SERVER_NAME'] ?? gethostname(),
    'php_interface' => $isCLI ? 'CLI' : 'Web',
    'checks' => [
        'database' => checkDatabase(),
        'disk' => checkDiskSpace(),
        'system_load' => checkSystemLoad(),
        'internet' => checkInternetConnection(),
        'php' => checkPHPInfo()
    ]
];

// Determine overall status
$overallStatus = 'ok';
foreach ($healthData['checks'] as $check) {
    if (isset($check['status']) && $check['status'] === 'error') {
        $overallStatus = 'error';
        break;
    } elseif (isset($check['status']) && $check['status'] === 'warning' && $overallStatus !== 'error') {
        $overallStatus = 'warning';
    }
}
$healthData['status'] = $overallStatus;

// Create log entry if there are issues
if ($overallStatus !== 'ok') {
    $logFile = __DIR__ . '/health_check_log.txt';
    $logMessage = json_encode($healthData, JSON_PRETTY_PRINT);
    file_put_contents($logFile, "[{$healthData['timestamp']}] Health check status: {$overallStatus}\n{$logMessage}\n\n", FILE_APPEND);
}

// Output the result
echo json_encode($healthData, JSON_PRETTY_PRINT);