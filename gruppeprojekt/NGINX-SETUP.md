# NGINX Load Balancer Setup på DigitalOcean

## Trin 1: Forbind til din droplet

```bash
ssh root@din-droplet-ip
```

## Trin 2: Installer NGINX

```bash
# Opdater systemet
sudo apt update

# Installer NGINX
sudo apt install nginx -y

# Start NGINX
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Trin 3: Upload din applikation

```bash
# Opret mappe til din app
sudo mkdir -p /var/www/your-app
cd /var/www/your-app

# Upload din applikation (brug scp eller git)
# Eksempel med git:
git clone dit-repo-url .

# Installer dependencies
npm install

# Start din applikation med PM2 (anbefalet)
npm install -g pm2
pm2 start bin/www --name "app-server1" -- 4000
pm2 start bin/www --name "app-server2" -- 4001
pm2 start bin/www --name "app-server3" -- 4002

# Gem PM2 konfiguration
pm2 save
pm2 startup
```

## Trin 4: Konfigurer NGINX

```bash
# Kopier nginx konfigurationsfilen
sudo cp nginx-loadbalancer.conf /etc/nginx/sites-available/your-domain

# Rediger filen og ændr domænet
sudo nano /etc/nginx/sites-available/your-domain

# Aktivér konfigurationen
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/

# Test NGINX konfiguration
sudo nginx -t

# Genstart NGINX
sudo systemctl restart nginx
```

## Trin 5: Firewall konfiguration

```bash
# Tillad HTTP og HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Trin 6: SSL/HTTPS (anbefalet)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Få SSL certifikat
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Test

```bash
# Test fra din computer
curl http://din-droplet-ip
curl http://din-droplet-ip/services/events
```

## PM2 Kommandoer

```bash
# Se status
pm2 list

# Se logs
pm2 logs

# Genstart alle
pm2 restart all

# Stop alle
pm2 stop all
```

