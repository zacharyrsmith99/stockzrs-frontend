#!/bin/bash

LOG_FILE="/var/log/stockzrs_relay_service.log"
exec > >(tee -a "$LOG_FILE") 2>&1
echo "$(date) - Starting script execution"

export AWS_DEFAULT_REGION=us-east-1
echo "$(date) - Set AWS_DEFAULT_REGION to us-east-1"

echo "$(date) - Fetching STOCKZRS_RELAY_SERVICE_WS_URL from Secrets Manager"
export STOCKZRS_RELAY_SERVICE_WS_URL=$(aws secretsmanager get-secret-value --secret-id stockzrs-frontend-secrets1 --query SecretString --output text | grep -o '"STOCKZRS_RELAY_SERVICE_WS_URL":"[^"]*' | grep -o '[^"]*$')

if [ -z "$STOCKZRS_RELAY_SERVICE_WS_URL" ]; then
    echo "$(date) - ERROR: Failed to retrieve STOCKZRS_RELAY_SERVICE_WS_URL"
    exit 1
else
    echo "$(date) - Successfully retrieved STOCKZRS_RELAY_SERVICE_WS_URL"
fi

echo "$(date) - Starting NGINX"
nginx -g 'daemon off;'