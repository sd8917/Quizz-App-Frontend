#!/bin/bash

#######################################
# Manual Deployment Script for Local to EC2
# Run this script locally to deploy to EC2
#######################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Quiz App Manual Deployment to EC2${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if required commands exist
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v ssh >/dev/null 2>&1 || { echo -e "${RED}ssh is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v scp >/dev/null 2>&1 || { echo -e "${RED}scp is required but not installed. Aborting.${NC}" >&2; exit 1; }

# Get EC2 details from user if not set as environment variables
if [ -z "$EC2_HOST" ]; then
  read -p "Enter EC2 host/IP: " EC2_HOST
fi

if [ -z "$EC2_USER" ]; then
  read -p "Enter EC2 username (default: ubuntu): " EC2_USER
  EC2_USER=${EC2_USER:-ubuntu}
fi

if [ -z "$EC2_KEY" ]; then
  read -p "Enter path to SSH key file (default: ~/.ssh/id_rsa): " EC2_KEY
  EC2_KEY=${EC2_KEY:-~/.ssh/id_rsa}
fi

echo ""
echo -e "${YELLOW}Deployment Configuration:${NC}"
echo -e "  Host: ${GREEN}$EC2_HOST${NC}"
echo -e "  User: ${GREEN}$EC2_USER${NC}"
echo -e "  Key:  ${GREEN}$EC2_KEY${NC}"
echo ""

read -p "Continue with deployment? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Deployment cancelled${NC}"
  exit 1
fi

# Test SSH connection
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ssh -i "$EC2_KEY" -o ConnectTimeout=10 "$EC2_USER@$EC2_HOST" "echo 'Connection successful'" 2>/dev/null; then
  echo -e "${GREEN}SSH connection successful${NC}"
else
  echo -e "${RED}Failed to connect to EC2 instance${NC}"
  exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Create deployment package
echo -e "${YELLOW}Creating deployment package...${NC}"
cd build
tar -czf ../deploy.tar.gz .
cd ..

echo -e "${GREEN}Deployment package created: deploy.tar.gz${NC}"

# Upload files to EC2
echo -e "${YELLOW}Uploading files to EC2...${NC}"
scp -i "$EC2_KEY" deploy.tar.gz "$EC2_USER@$EC2_HOST:/tmp/" || {
  echo -e "${RED}Failed to upload deployment package${NC}"
  exit 1
}

scp -i "$EC2_KEY" deploy-ec2.sh "$EC2_USER@$EC2_HOST:/tmp/" || {
  echo -e "${RED}Failed to upload deployment script${NC}"
  exit 1
}

echo -e "${GREEN}Files uploaded successfully${NC}"

# Execute deployment on EC2
echo -e "${YELLOW}Executing deployment on EC2...${NC}"
ssh -i "$EC2_KEY" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
cd /tmp
chmod +x deploy-ec2.sh
sudo ./deploy-ec2.sh
rm -f deploy.tar.gz deploy-ec2.sh
ENDSSH

# Cleanup local files
echo -e "${YELLOW}Cleaning up local files...${NC}"
rm -f deploy.tar.gz

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Access your app at: ${GREEN}https://triviaverse.site${NC}"
echo ""
echo -e "${YELLOW}Useful SSH commands:${NC}"
echo -e "  Connect to EC2: ${GREEN}ssh -i $EC2_KEY $EC2_USER@$EC2_HOST${NC}"
echo -e "  View Nginx logs: ${GREEN}ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'sudo tail -f /var/log/nginx/error.log'${NC}"
echo -e "  Check app status: ${GREEN}ssh -i $EC2_KEY $EC2_USER@$EC2_HOST 'sudo systemctl status nginx'${NC}"
