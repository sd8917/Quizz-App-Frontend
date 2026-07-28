#!/bin/bash

#######################################
# EC2 Deployment Script for Quiz App
# This script deploys the React app to EC2 with Nginx
#######################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="quizz-app-frontend"
DOMAIN="triviaverse.site"
DEPLOY_DIR="/var/www/quizz-app"
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$APP_NAME"
BACKUP_DIR="/var/backups/quizz-app"
DEPLOY_PACKAGE="/tmp/deploy.tar.gz"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting deployment of Quiz App${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root or with sudo${NC}"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup existing deployment if it exists
if [ -d "$DEPLOY_DIR" ]; then
  echo -e "${YELLOW}Creating backup of existing deployment...${NC}"
  BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
  tar -czf "$BACKUP_FILE" -C "$DEPLOY_DIR" . 2>/dev/null || true
  echo -e "${GREEN}Backup created: $BACKUP_FILE${NC}"
fi

# Create deployment directory
echo -e "${YELLOW}Creating deployment directory...${NC}"
mkdir -p "$DEPLOY_DIR"

# Extract new build
echo -e "${YELLOW}Extracting new build...${NC}"
if [ -f "$DEPLOY_PACKAGE" ]; then
  tar -xzf "$DEPLOY_PACKAGE" -C "$DEPLOY_DIR"
  echo -e "${GREEN}Build extracted successfully${NC}"
else
  echo -e "${RED}Deployment package not found: $DEPLOY_PACKAGE${NC}"
  exit 1
fi

# Set proper permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chown -R www-data:www-data "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
  echo -e "${YELLOW}Installing Nginx...${NC}"
  apt-get update
  apt-get install -y nginx
fi

# Create Nginx configuration
echo -e "${YELLOW}Configuring Nginx...${NC}"
cat > "$NGINX_CONFIG" << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/quizz-app;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Handle React Router - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache manifest and service worker with shorter duration
    location ~* \.(json|xml)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Disable access to hidden files
    location ~ /\. {
        deny all;
    }

    # Custom error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Enable site
ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
if nginx -t; then
  echo -e "${GREEN}Nginx configuration is valid${NC}"
else
  echo -e "${RED}Nginx configuration test failed${NC}"
  exit 1
fi

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
systemctl reload nginx

# Enable Nginx to start on boot
systemctl enable nginx

# Check Nginx status
if systemctl is-active --quiet nginx; then
  echo -e "${GREEN}Nginx is running${NC}"
else
  echo -e "${RED}Nginx is not running${NC}"
  systemctl start nginx
fi

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
  echo -e "${YELLOW}Installing Certbot...${NC}"
  apt-get update
  apt-get install -y certbot python3-certbot-nginx
fi

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate for $DOMAIN...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN --redirect || echo -e "${RED}Certbot failed. You may need to run it manually later.${NC}"

# Cleanup old backups (keep last 5)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t | tail -n +6 | xargs -r rm --

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "App deployed to: ${GREEN}$DEPLOY_DIR${NC}"
echo -e "Nginx config: ${GREEN}$NGINX_CONFIG${NC}"
echo -e "Access the app at: ${GREEN}https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  Check Nginx status: ${GREEN}sudo systemctl status nginx${NC}"
echo -e "  View Nginx logs: ${GREEN}sudo tail -f /var/log/nginx/error.log${NC}"
echo -e "  Restart Nginx: ${GREEN}sudo systemctl restart nginx${NC}"
echo -e "  Test SSL certificate renewal: ${GREEN}sudo certbot renew --dry-run${NC}"
echo -e "  Rollback: ${GREEN}cd $BACKUP_DIR && sudo tar -xzf backup-*.tar.gz -C $DEPLOY_DIR${NC}"
