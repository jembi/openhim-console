#!/bin/bash
# Extract REACT_APP_OPENHIM_API_BASE_URL from environment variables
REACT_APP_OPENHIM_API_BASE_URL=$(env | grep OPENHIM_CORE_MEDIATOR_HOSTNAME | cut -d'=' -f2)
OPENHIM_MEDIATOR_API_PORT=$(env | grep OPENHIM_MEDIATOR_API_PORT | cut -d'=' -f2)
# Extract host from the REACT_APP_OPENHIM_API_BASE_URL and strip out 'https://' if present
extracted_host=$(echo "$REACT_APP_OPENHIM_API_BASE_URL":"$OPENHIM_MEDIATOR_API_PORT" | sed -E 's/^https?:\/\/([^\/]+).*$/\1/')
# Define the default host
DEFAULT_HOST="localhost:8080"
# Use the extracted host or the default host if not provided
REPLACEMENT_HOST=${extracted_host:-$DEFAULT_HOST}
# Replace occurrences in index.html
sed -i "s|src=\"https\?:\/\/[^\/]*\/importmaps\"|src=\"https:\/\/$REPLACEMENT_HOST\/importmaps\"|g" /usr/share/nginx/html/index.html
# Replace occurrences in jembi-openhim-core-api.js
sed -i 's|baseURL:"https\?://[^/]*"|baseURL:"https://'$REPLACEMENT_HOST'"|g' /usr/share/nginx/html/libs/@jembi/openhim-core-api/dist/jembi-openhim-core-api.js
