# Use the official NGINX base image
FROM nginx:latest

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl && apt-get clean

# Create directories for SSL
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificates
RUN openssl genrsa -out /etc/nginx/ssl/server.key 2048 && \
    openssl req -new -key /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost" && \
    openssl x509 -req -days 365 -in /etc/nginx/ssl/server.csr -signkey /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt

# Copy the custom Nginx configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443