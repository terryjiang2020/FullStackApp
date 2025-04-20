<?php
/**
 * Script to check internet connectivity
 * This will be called by a cron job every hour
 */

// Log file to store connectivity status
$logFile = __DIR__ . '/connectivity_log.txt';

// Function to check internet connection by pinging Google's DNS
function checkInternetConnection() {
    $connected = @fsockopen("8.8.8.8", 53, $errno, $errstr, 10);
    if ($connected) {
        fclose($connected);
        return true;
    }
    return false;
}

// Check connection and log the result
$isConnected = checkInternetConnection();
$timestamp = date('Y-m-d H:i:s');
$status = $isConnected ? "Connected" : "Disconnected";
$logMessage = "[{$timestamp}] Internet connection status: {$status}\n";

// Append to log file
file_put_contents($logFile, $logMessage, FILE_APPEND);

// Output result (useful for manual testing)
echo $logMessage;

// Optional: Send notification if connection is down
if (!$isConnected) {
    // You can implement email/SMS notification here if needed
    // Example: mail('admin@example.com', 'Internet Connection Down', 'Internet connection is down as of ' . $timestamp);
}
?>