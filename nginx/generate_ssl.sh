#!/bin/bash

# Define paths for the SSL certificate files
SSL_DIR="/etc/nginx/ssl"
KEY_FILE="${SSL_DIR}/nginx-selfsigned.key"
CRT_FILE="${SSL_DIR}/nginx-selfsigned.crt"

# Check if SSL files already exist
if [ ! -f "$KEY_FILE" ] || [ ! -f "$CRT_FILE" ]; then
  echo "Generating SSL certificate and key..."
  
  # Generate a 2048-bit RSA private key
  openssl genrsa -out "$KEY_FILE" 2048
  
  # Create a self-signed certificate valid for 365 days
  openssl req -new -x509 -key "$KEY_FILE" -out "$CRT_FILE" -days 365 \
    -subj "/C=US/ST=California/L=San Francisco/O=MyCompany/OU=Dev/CN=example.com"
  
  echo "SSL key and certificate have been generated."
else
  echo "SSL certificate and key already exist. Skipping generation."
fi

# Start Nginx
nginx -g "daemon off;"
