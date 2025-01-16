FROM nginx:latest

# Copy the custom Nginx configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates into the container (make sure these paths are correct)
COPY ./ssl /etc/nginx/ssl

# Expose HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443