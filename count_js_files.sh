#!/bin/bash

# Script to count the number of JavaScript files in the repository
echo "Counting JavaScript files..."

# Find all .js files and count them
JS_COUNT=$(find . -type f -name "*.js" | wc -l)

echo "Total JavaScript files found: $JS_COUNT"