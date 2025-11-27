#!/bin/bash

#######################################
# Quick Deploy Script for Quiz App
# Updates build files without reconfiguring Nginx
#######################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/var/www/quizz-app"
BACKUP_DIR="/var/backups/quizz-app"
DEPLOY_PACKAGE="/tmp/deploy.tar.gz"
VERSION=$(date +%Y%m%d-%H%M%S)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Quick Deployment - Version: $VERSION${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root or with sudo${NC}"
  exit 1
fi

# Verify deployment package exists
if [ ! -f "$DEPLOY_PACKAGE" ]; then
  echo -e "${RED}Deployment package not found: $DEPLOY_PACKAGE${NC}"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup current deployment with version name
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
  echo -e "${YELLOW}Creating backup of current deployment...${NC}"
  BACKUP_FILE="$BACKUP_DIR/backup-v$VERSION.tar.gz"
  tar -czf "$BACKUP_FILE" -C "$DEPLOY_DIR" . 2>/dev/null || true
  echo -e "${GREEN}Backup created: $BACKUP_FILE${NC}"
else
  echo -e "${YELLOW}No existing deployment to backup${NC}"
fi

# Create deployment directory if it doesn't exist
mkdir -p "$DEPLOY_DIR"

# Clear old files
echo -e "${YELLOW}Clearing old files...${NC}"
rm -rf "$DEPLOY_DIR"/*

# Extract new build
echo -e "${YELLOW}Extracting new build...${NC}"
tar -xzf "$DEPLOY_PACKAGE" -C "$DEPLOY_DIR"
echo -e "${GREEN}Build extracted successfully${NC}"

# Set proper permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chown -R www-data:www-data "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
if nginx -t 2>&1; then
  echo -e "${GREEN}Nginx configuration is valid${NC}"
else
  echo -e "${RED}Nginx configuration test failed${NC}"
  echo -e "${YELLOW}Restoring from backup...${NC}"
  if [ -f "$BACKUP_FILE" ]; then
    rm -rf "$DEPLOY_DIR"/*
    tar -xzf "$BACKUP_FILE" -C "$DEPLOY_DIR"
    echo -e "${GREEN}Restored from backup${NC}"
  fi
  exit 1
fi

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}Nginx reloaded successfully${NC}"

# Verify Nginx is running
if systemctl is-active --quiet nginx; then
  echo -e "${GREEN}Nginx is running${NC}"
else
  echo -e "${RED}Nginx is not running, attempting to start...${NC}"
  systemctl start nginx
fi

# Test local accessibility
echo -e "${YELLOW}Testing local accessibility...${NC}"
if curl -f -s -o /dev/null http://localhost; then
  echo -e "${GREEN}✓ App is accessible locally${NC}"
else
  echo -e "${RED}✗ Local accessibility test failed${NC}"
fi

# Test domain accessibility
echo -e "${YELLOW}Testing domain accessibility...${NC}"
if curl -f -s -o /dev/null -H "Host: triviaverse.site" http://localhost; then
  echo -e "${GREEN}✓ App is accessible via domain${NC}"
else
  echo -e "${YELLOW}⚠ Domain test failed (may be DNS/SSL issue)${NC}"
fi

# Cleanup old backups (keep last 10 versions)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t | grep "backup-v" | tail -n +11 | xargs -r rm --
BACKUP_COUNT=$(ls -1 | grep "backup-v" | wc -l)
echo -e "${GREEN}Keeping $BACKUP_COUNT recent backups${NC}"

# Display deployment info
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Completed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Version: ${GREEN}$VERSION${NC}"
echo -e "Deployed to: ${GREEN}$DEPLOY_DIR${NC}"
echo -e "Backup: ${GREEN}$BACKUP_FILE${NC}"
echo -e "Access URL: ${GREEN}https://triviaverse.site${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  View logs: ${GREEN}sudo tail -f /var/log/nginx/error.log${NC}"
echo -e "  Nginx status: ${GREEN}sudo systemctl status nginx${NC}"
echo -e "  Rollback to this version: ${GREEN}sudo tar -xzf $BACKUP_FILE -C $DEPLOY_DIR${NC}"
echo -e "  List backups: ${GREEN}ls -lh $BACKUP_DIR${NC}"
