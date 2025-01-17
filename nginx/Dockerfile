FROM nginx:latest

# Set working directory
WORKDIR /app

# Copy the SSL generation script into the container
COPY generate_ssl.sh /generate_ssl.sh

# Copy the custom Nginx configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure the script is executable
RUN chmod +x /generate_ssl.sh

# Set the entrypoint to run the SSL generation script
ENTRYPOINT ["/generate_ssl.sh"]

# Expose HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443
