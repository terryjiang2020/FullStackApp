#!/bin/bash

# Script to count the number of API endpoints in the repository
echo "Counting API endpoints..."

# Count API endpoints in PHP files by looking for common patterns
PHP_API_COUNT=$(grep -r "function\|GET\|POST\|PUT\|DELETE\|PATCH" ./api/ --include="*.php" | grep -v "//" | wc -l)

# Count API calls in JavaScript files by looking for common patterns like fetch, axios, etc.
JS_API_COUNT=$(grep -r "fetch\|axios\.\(get\|post\|put\|delete\|patch\)\|api" ./src/ --include="*.js" | grep -v "//" | wc -l)

echo "Estimated API endpoints in PHP files: $PHP_API_COUNT"
echo "Estimated API calls in JavaScript files: $JS_API_COUNT"
echo "Total estimated API-related code: $((PHP_API_COUNT + JS_API_COUNT))"

echo "Note: This is a rough estimation. Manual review may be needed for more accurate results."