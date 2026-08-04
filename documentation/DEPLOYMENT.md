# CFN Kurties — Deployment Guide

## 1. Local development

```bash
cd /path/to/cfn-kurties
cp .env.example .env.local
# Edit .env.local — placeholders work out of the box
npm install
npm run dev
# → http://localhost:3005
```

### WooCommerce connection

1. WP Admin → WooCommerce → Settings → Advanced → REST API → Add key (Read/Write)
2. Set in `.env.local`:

```env
WOOCOMMERCE_URL=https://your-wp-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
WOOCOMMERCE_USE_PLACEHOLDERS=false
```

3. Restart `npm run dev`
4. Ensure CORS is not required (server-side fetch only)
5. Product images: allow your WP domain in `next.config.ts` `images.remotePatterns` (wildcard `**` is already set for flexibility)

### Razorpay setup

1. Create Razorpay account → API Keys (test then live)
2. Set:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_MOCK=false
```

3. Enable payment methods in Razorpay Dashboard
4. Webhooks optional (verify endpoint already used from client handler)

### Hero media

- **Image:** edit `heroContent.image` in `src/constants/placeholders.ts` or serve from `/public/images/hero/`
- **Video:** put file in `public/videos/hero.mp4`, set:

```env
NEXT_PUBLIC_HERO_VIDEO_ENABLED=true
NEXT_PUBLIC_HERO_VIDEO_SRC=/videos/hero.mp4
```

### Replacing placeholder products

Once WooCommerce is live with published products, disable placeholders. Images come from Woo media library automatically via REST `images[].src`.

---

## 2. Production build

```bash
npm ci
npm run build
npm start   # port 3005
# or PM2 (below)
```

Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` and `NODE_ENV=production`.

---

## 3. Oracle Cloud Ubuntu

### Server prep

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx git
sudo npm i -g pm2
```

### App deploy

```bash
sudo mkdir -p /var/www/cfn-kurties
sudo chown $USER:$USER /var/www/cfn-kurties
cd /var/www/cfn-kurties
git clone <YOUR_REPO_URL> .
cp .env.example .env.production
nano .env.production   # fill secrets
npm ci
npm run build
```

### PM2

```bash
# ecosystem file example
pm2 start npm --name cfn-kurties -- start
pm2 save
pm2 startup
```

Or `ecosystem.config.cjs`:

```js
module.exports = {
  apps: [{
    name: 'cfn-kurties',
    cwd: '/var/www/cfn-kurties',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3005',
    env: { NODE_ENV: 'production', PORT: 3005 },
    instances: 1,
    exec_mode: 'fork',
  }],
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

### Nginx

`/etc/nginx/sites-available/cfn-kurties`:

```nginx
server {
    listen 80;
    server_name cfnkurties.com www.cfnkurties.com;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cfn-kurties /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL

```bash
sudo certbot --nginx -d cfnkurties.com -d www.cfnkurties.com
```

### Domain

Point A records for `@` and `www` to your Oracle instance public IP. Open ports 80/443 in Oracle Security List / iptables.

---

## 4. Updating from Android (Termux)

```bash
pkg update && pkg install git openssh
ssh ubuntu@YOUR_SERVER_IP
cd /var/www/cfn-kurties
git pull origin main
npm ci
npm run build
pm2 restart cfn-kurties
```

Use SSH keys; avoid storing secrets in Termux notes.

---

## 5. Security checklist

- [ ] Secrets only in server env (not git)
- [ ] HTTPS enforced (HSTS header already in Next config)
- [ ] WooCommerce keys Read/Write limited to server IP if possible
- [ ] Razorpay live keys only on production
- [ ] Firewall: 22 (restricted), 80, 443 only
- [ ] Regular `npm audit` / dependency updates

---

## 6. Rollback

```bash
git log --oneline -5
git checkout <previous-commit>
npm ci && npm run build && pm2 restart cfn-kurties
```
