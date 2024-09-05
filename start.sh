#!/bin/bash

export AWS_DEFAULT_REGION=us-east-1

export STOCKZRS_RELAY_SERVICE_WS_URL=$(aws secretsmanager get-secret-value --secret-id stockzrs-frontend-secrets1 --query SecretString --output text | grep -o '"STOCKZRS_RELAY_SERVICE_WS_URL":"[^"]*' | grep -o '[^"]*$')

nginx -g 'daemon off;'