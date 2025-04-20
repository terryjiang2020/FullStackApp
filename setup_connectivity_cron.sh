#!/bin/bash

# Script to set up connectivity check cron job
# This will be used to ensure the connectivity check runs every hour

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PHP_PATH=$(which php)

# Run the setup
echo "Setting up hourly connectivity check..."
$PHP_PATH "$SCRIPT_DIR/api/index.php" --setup-cron

echo "Setup complete. You can manually trigger a check by visiting:"
echo "http://localhost:8005/api/index.php?check_connectivity=true"