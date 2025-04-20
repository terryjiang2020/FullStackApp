#!/bin/bash

# Path to PHP executable
PHP_PATH=$(which php)

# Path to the PHP script
SCRIPT_PATH="/Users/jiangjiahao/Documents/GitHub/FullStackApp/api/health_check.php"

# Directory for storing health check reports
LOG_DIR="/Users/jiangjiahao/Documents/GitHub/FullStackApp/api/health_logs"

# Create log directory if it doesn't exist
mkdir -p $LOG_DIR

# Timestamp for log filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/health_check_$TIMESTAMP.json"

# Execute the PHP script and save output to log file
$PHP_PATH $SCRIPT_PATH > $LOG_FILE

# Optional: Check if there's an error in the health check
grep -q '"status":"error"' $LOG_FILE
if [ $? -eq 0 ]; then
  echo "Critical error detected in health check. See $LOG_FILE for details."
  # You could add notification commands here (e.g., send email)
fi