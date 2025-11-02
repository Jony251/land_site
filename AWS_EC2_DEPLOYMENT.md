# AWS EC2 Deployment Guide

Complete guide for deploying the AI Chatbot Backend on AWS EC2.

## Prerequisites

- AWS account with EC2 access
- Basic knowledge of Linux commands
- Domain name (optional, for production)

## Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose an instance type:
   - **Development/Testing**: `t2.micro` or `t2.small` (free tier eligible)
   - **Production**: `t3.medium` or larger (recommended)
3. Choose Amazon Linux 2023 or Ubuntu 22.04 LTS
4. Configure security group:
   - **SSH (22)**: Your IP only
   - **HTTP (80)**: 0.0.0.0/0 (or specific IPs)
   - **HTTPS (443)**: 0.0.0.0/0 (or specific IPs)
   - **Custom (8234)**: Your frontend IPs (or 0.0.0.0/0 for testing)
5. Create or select a key pair
6. Launch instance

## Step 2: Connect to Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
# For Ubuntu, use: ubuntu@your-ec2-ip
```

## Step 3: Update System

**Amazon Linux:**
```bash
sudo yum update -y
sudo yum install -y python3 python3-pip python3-devel gcc git postgresql15
```

**Ubuntu:**
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv postgresql-client git build-essential
```

## Step 4: Set Up Project

```bash
# Clone your repository
git clone https://github.com/yourusername/eugeny_be.git
cd eugeny_be

# Or upload files using scp
# scp -r -i your-key.pem ./eugeny_be ec2-user@your-ec2-ip:/home/ec2-user/
```

## Step 5: Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Step 6: Install Production Dependencies

```bash
# Install Gunicorn and other production tools
pip install gunicorn psycopg2-binary
```

Update `requirements.txt` to include:
```
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

## Step 7: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add all your production environment variables:
```env
SECRET_KEY=your-production-secret-key-generate-strong-one
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-ec2-ip,localhost

# Database (we'll set up PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Google Docs
GOOGLE_DOCS_SYSTEM_PROMPT_ID=your-document-id
GOOGLE_CREDENTIALS_FILE=credentials.json

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHANNEL_ID=@your-channel

# CORS (add your frontend domain)
FRONTEND_URL=https://your-frontend-domain.com
```

## Step 8: Set Up PostgreSQL

**Amazon Linux:**
```bash
sudo yum install -y postgresql15-server
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Ubuntu:**
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Create database:
```bash
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE chatbot_db;
CREATE USER chatbot_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE chatbot_db TO chatbot_user;
\q
```

Update `.env`:
```env
DATABASE_URL=postgresql://chatbot_user:your-secure-password@localhost:5432/chatbot_db
```

Update `config/settings.py`:
```python
import os
from urllib.parse import urlparse

# Database configuration
if os.getenv('DATABASE_URL'):
    db_url = urlparse(os.getenv('DATABASE_URL'))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_url.path[1:],
            'USER': db_url.username,
            'PASSWORD': db_url.password,
            'HOST': db_url.hostname,
            'PORT': db_url.port,
        }
    }
```

Or install `dj-database-url`:
```bash
pip install dj-database-url
```

Then in `settings.py`:
```python
import dj_database_url

if os.getenv('DATABASE_URL'):
    DATABASES['default'] = dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600
    )
```

## Step 9: Configure Django Settings

Update `config/settings.py`:

```python
import os
from dotenv import load_dotenv

load_dotenv()

# Security settings for production
DEBUG = os.getenv('DEBUG', 'False') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

# CORS settings
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
    # Add more origins as needed
]

# Add security middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # ... rest of middleware
]

# Security settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

## Step 10: Run Migrations

```bash
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

## Step 11: Test Gunicorn

```bash
source venv/bin/activate
gunicorn --bind 0.0.0.0:8234 config.wsgi:application
```

Test it:
```bash
curl http://your-ec2-ip:8234/api/health/
```

Press `Ctrl+C` to stop.

## Step 12: Create Systemd Service

Create a service file:
```bash
sudo nano /etc/systemd/system/chatbot.service
```

Add:
```ini
[Unit]
Description=AI Chatbot Django Application
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/eugeny_be
Environment="PATH=/home/ec2-user/eugeny_be/venv/bin"
ExecStart=/home/ec2-user/eugeny_be/venv/bin/gunicorn \
    --workers 3 \
    --bind 0.0.0.0:8234 \
    --access-logfile /var/log/chatbot/access.log \
    --error-logfile /var/log/chatbot/error.log \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

Create log directory:
```bash
sudo mkdir -p /var/log/chatbot
sudo chown ec2-user:ec2-user /var/log/chatbot
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable chatbot
sudo systemctl start chatbot
sudo systemctl status chatbot
```

## Step 13: Set Up Nginx (Recommended)

Install Nginx:
```bash
# Amazon Linux
sudo yum install -y nginx

# Ubuntu
sudo apt install -y nginx
```

Configure Nginx:
```bash
sudo nano /etc/nginx/conf.d/chatbot.conf
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com your-ec2-ip;

    # Redirect HTTP to HTTPS (if using SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://127.0.0.1:8234;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /static/ {
        alias /home/ec2-user/eugeny_be/staticfiles/;
    }

    location /media/ {
        alias /home/ec2-user/eugeny_be/media/;
    }
}
```

Test and restart:
```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

## Step 14: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Amazon Linux
sudo yum install -y certbot python3-certbot-nginx

# Ubuntu
sudo apt install -y certbot python3-certbot-nginx
```

Get certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

Auto-renewal:
```bash
sudo certbot renew --dry-run
```

## Step 15: Configure Firewall

```bash
# For Amazon Linux / CentOS
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload

# For Ubuntu
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## Step 16: Set Up Auto-restart on Reboot

The systemd service will auto-start, but also set up log rotation:

```bash
sudo nano /etc/logrotate.d/chatbot
```

Add:
```
/var/log/chatbot/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ec2-user ec2-user
    sharedscripts
}
```

## Monitoring and Maintenance

### View Logs

```bash
# Application logs
sudo journalctl -u chatbot -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application error logs
tail -f /var/log/chatbot/error.log
```

### Restart Service

```bash
sudo systemctl restart chatbot
```

### Update Code

```bash
cd /home/ec2-user/eugeny_be
git pull  # or upload new files
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart chatbot
```

## Security Checklist

- [ ] `DEBUG=False` in production
- [ ] Strong `SECRET_KEY`
- [ ] `ALLOWED_HOSTS` configured
- [ ] CORS origins restricted
- [ ] PostgreSQL password secure
- [ ] SSL/TLS enabled
- [ ] Firewall configured
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Environment variables secured

## Troubleshooting

### Service won't start
```bash
sudo journalctl -u chatbot -n 50
```

### Permission errors
```bash
sudo chown -R ec2-user:ec2-user /home/ec2-user/eugeny_be
```

### Database connection issues
```bash
sudo -u postgres psql -c "\l"  # List databases
```

### Port already in use
```bash
sudo netstat -tlnp | grep 8234
```

## Performance Optimization

1. **Increase Gunicorn workers**:
   ```bash
   # In /etc/systemd/system/chatbot.service
   --workers 4
   ```

2. **Add Redis for caching** (optional):
   ```bash
   sudo yum install -y redis
   sudo systemctl enable redis
   sudo systemctl start redis
   ```

3. **Use CDN** for static files

## Backup Strategy

```bash
# Create backup script
nano /home/ec2-user/backup_chatbot.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ec2-user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U chatbot_user chatbot_db > $BACKUP_DIR/db_$DATE.sql

# Backup media files
tar -czf $BACKUP_DIR/media_$DATE.tar.gz /home/ec2-user/eugeny_be/media/

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable:
```bash
chmod +x /home/ec2-user/backup_chatbot.sh
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /home/ec2-user/backup_chatbot.sh
```

## Estimated Costs

- **t2.micro**: ~$8-10/month (free tier eligible)
- **t3.small**: ~$15-20/month
- **t3.medium**: ~$30-35/month
- **Storage**: ~$0.10/GB/month
- **Data Transfer**: First 100GB free, then ~$0.09/GB

## Next Steps

1. Set up CloudWatch for monitoring
2. Configure auto-scaling if needed
3. Set up AWS RDS for managed database
4. Configure AWS S3 for media storage
5. Set up CI/CD pipeline

Your backend is now deployed and ready for production! 🚀

