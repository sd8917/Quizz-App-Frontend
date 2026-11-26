# EC2 Deployment Guide for Quiz App Frontend

This guide covers automated and manual deployment options for deploying the Quiz App to AWS EC2.

## Prerequisites

1. **AWS EC2 Instance**
   - Ubuntu 20.04 or later recommended
   - Security group allowing inbound traffic on ports 22 (SSH) and 80 (HTTP)
   - At least 1GB RAM and 8GB storage
   - Public IP address or domain name

2. **Local Requirements**
   - Node.js 18 or later
   - SSH client
   - Git (for automated deployment)

## Deployment Options

### Option 1: Automated Deployment with GitHub Actions

#### Setup Steps

1. **Configure GitHub Secrets**
   
   Go to your repository → Settings → Secrets and variables → Actions, and add:

   - `EC2_HOST`: Your EC2 public IP or domain
   - `EC2_USERNAME`: SSH username (usually `ubuntu` or `ec2-user`)
   - `EC2_SSH_KEY`: Your private SSH key content

2. **Trigger Deployment**

   The workflow automatically deploys when you:
   - Push to `main` or `master` branch
   - Manually trigger via Actions tab → Deploy to EC2 → Run workflow

#### What It Does

- Checks out code
- Installs dependencies
- Builds the React app
- Creates deployment package
- Uploads to EC2
- Executes deployment script
- Configures Nginx
- Verifies deployment

### Option 2: Manual Deployment

#### Quick Deploy

```bash
# Set environment variables (optional)
export EC2_HOST="your-ec2-ip"
export EC2_USER="ubuntu"
export EC2_KEY="~/.ssh/your-key.pem"

# Make script executable
chmod +x deploy-manual.sh

# Run deployment
./deploy-manual.sh
```

The script will:
1. Prompt for EC2 details if not set
2. Test SSH connection
3. Build the application
4. Upload files to EC2
5. Execute deployment
6. Configure Nginx

#### Step-by-Step Manual Deployment

If you prefer more control:

```bash
# 1. Build the application locally
npm install
npm run build

# 2. Create deployment package
cd build
tar -czf ../deploy.tar.gz .
cd ..

# 3. Upload to EC2
scp -i ~/.ssh/your-key.pem deploy.tar.gz ubuntu@your-ec2-ip:/tmp/
scp -i ~/.ssh/your-key.pem deploy-ec2.sh ubuntu@your-ec2-ip:/tmp/

# 4. SSH into EC2 and deploy
ssh -i ~/.ssh/your-key.pem ubuntu@your-ec2-ip
cd /tmp
chmod +x deploy-ec2.sh
sudo ./deploy-ec2.sh
```

## Initial EC2 Setup

If this is your first deployment, ensure your EC2 instance is prepared:

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Nginx (if not already installed)
sudo apt-get install -y nginx

# Configure firewall (if using UFW)
sudo ufw allow 'Nginx HTTP'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Nginx Configuration

The deployment script automatically configures Nginx with:

- React Router support (all routes redirect to index.html)
- Gzip compression for better performance
- Static asset caching (1 year for images, fonts, etc.)
- Security headers
- Custom error pages

Configuration file location: `/etc/nginx/sites-available/quizz-app-frontend`

## Post-Deployment

### Verify Deployment

```bash
# Check Nginx status
sudo systemctl status nginx

# Test application
curl http://localhost
curl http://your-ec2-ip
```

### View Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Useful Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (zero downtime)
sudo systemctl reload nginx

# Test Nginx configuration
sudo nginx -t

# View deployed files
ls -la /var/www/quizz-app

# View backups
ls -la /var/backups/quizz-app
```

## Rollback

If something goes wrong, you can rollback to a previous version:

```bash
# List available backups
ls -la /var/backups/quizz-app

# Restore from backup (replace timestamp)
cd /var/backups/quizz-app
sudo tar -xzf backup-20250126-123456.tar.gz -C /var/www/quizz-app

# Restart Nginx
sudo systemctl restart nginx
```

## Custom Domain Setup

To use a custom domain:

1. **Point DNS to EC2**
   - Create an A record pointing to your EC2 public IP

2. **Update Nginx Configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/quizz-app-frontend
   ```
   
   Replace `server_name _;` with:
   ```nginx
   server_name yourdomain.com www.yourdomain.com;
   ```

3. **Add SSL Certificate (Recommended)**
   ```bash
   # Install Certbot
   sudo apt-get install -y certbot python3-certbot-nginx
   
   # Obtain SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   
   # Auto-renewal is configured automatically
   ```

## Environment Variables

To configure API endpoint or other environment variables:

1. **Create `.env.production` file before building:**
   ```bash
   REACT_APP_API_URL=https://api.triviaverse.shop/api
   ```

2. **Or update after deployment:**
   ```bash
   # SSH to EC2
   ssh -i ~/.ssh/your-key.pem ubuntu@your-ec2-ip
   
   # Edit index.html or inject via build process
   ```

## Troubleshooting

### Deployment Fails

- Verify SSH key permissions: `chmod 600 ~/.ssh/your-key.pem`
- Check EC2 security group allows port 22
- Ensure enough disk space on EC2: `df -h`

### Nginx Won't Start

```bash
# Check configuration syntax
sudo nginx -t

# View detailed error
sudo systemctl status nginx
sudo journalctl -xeu nginx
```

### App Not Loading

- Check Nginx is running: `sudo systemctl status nginx`
- Verify files exist: `ls -la /var/www/quizz-app`
- Check browser console for errors
- Verify API endpoint is accessible

### 404 on React Routes

If direct navigation to routes like `/dashboard` gives 404:
- Ensure Nginx has `try_files $uri $uri/ /index.html;` in location block
- The deployment script includes this by default

## Performance Optimization

The deployment includes:
- ✅ Gzip compression
- ✅ Asset caching headers
- ✅ Security headers
- ✅ Optimized build

For additional optimization:
- Consider using CloudFront CDN
- Enable HTTP/2 in Nginx
- Use smaller EC2 instance with auto-scaling

## Monitoring

Set up monitoring with:

```bash
# Install monitoring tools
sudo apt-get install -y htop

# Monitor resources
htop

# Check disk usage
df -h

# Monitor Nginx connections
sudo netstat -tlnp | grep nginx
```

## Security Best Practices

1. **Keep system updated**
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

2. **Use SSH keys only** (disable password authentication)
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

3. **Configure firewall**
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   ```

4. **Regular backups**
   - Backups are automatically created in `/var/backups/quizz-app`
   - Consider backing up to S3 for redundancy

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/EC2.deploy.yml`) provides:

- ✅ Automatic builds on push to main/master
- ✅ Manual deployment trigger
- ✅ Build artifact creation
- ✅ Secure file transfer
- ✅ Automated deployment
- ✅ Health check verification

## Support

For issues or questions:
- Check Nginx logs: `/var/log/nginx/error.log`
- Review deployment logs in GitHub Actions
- Verify EC2 instance health in AWS Console

## File Structure After Deployment

```
/var/www/quizz-app/          # Application files
/etc/nginx/sites-available/   # Nginx config
/var/backups/quizz-app/       # Backup archives
/var/log/nginx/               # Nginx logs
```
