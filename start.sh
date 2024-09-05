#!/bin/bash
echo "$(date) - Starting NGINX"

sed -i "s|\$STOCKZRS_RELAY_SERVICE_WS_URL|$STOCKZRS_RELAY_SERVICE_WS_URL|g" /etc/nginx/nginx.conf

nginx -g 'daemon off;'