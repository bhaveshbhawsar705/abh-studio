# ABH Studio — Deployment Guide

This guide covers everything you need to deploy the ABH Studio website to **Netlify** or **Hostinger**.

---

## Project Structure

```
abh-studio-monorepo/
├── artifacts/
│   ├── abh-studio/       ← React + Vite frontend (the website)
│   └── api-server/       ← Node.js + Express backend (contact form emails)
├── lib/                  ← Shared TypeScript libraries
├── pnpm-workspace.yaml
└── package.json
```

**Runtime requirements:** Node.js 22+ · pnpm 10+

---

## Option A — Netlify (Recommended for simplicity)

Netlify hosts the frontend (React build) for free. The contact form needs a small extra step since Netlify can't run a Node.js server — use a Netlify Function instead.

### Step 1 — Build the frontend

```bash
npm install -g pnpm
pnpm install
pnpm --filter @workspace/abh-studio run build
```

The built files are output to: `artifacts/abh-studio/dist/`

### Step 2 — Deploy to Netlify

**Option A1 — Drag & Drop (fastest)**
1. Go to [netlify.com](https://netlify.com) and log in
2. Drag the `artifacts/abh-studio/dist/` folder into the Netlify dashboard
3. Done — your site is live on a `*.netlify.app` URL

**Option A2 — Connect GitHub (best for updates)**
1. Push this project to a GitHub repository
2. In Netlify: New site → Import from Git → select your repo
3. Set build settings:
   - **Base directory:** `artifacts/abh-studio`
   - **Build command:** `cd ../.. && pnpm install && pnpm --filter @workspace/abh-studio run build`
   - **Publish directory:** `artifacts/abh-studio/dist`
4. Deploy

### Step 3 — Contact Form on Netlify (Netlify Functions)

Since Netlify can't run the Express API server, create a serverless function:

1. Create `artifacts/abh-studio/netlify/functions/contact.mjs`:

```js
import nodemailer from "nodemailer";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, email, projectType, message } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"ABH Studio" <${process.env.GMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: email,
    subject: `New Inquiry: ${projectType} from ${name}`,
    html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Type:</b> ${projectType}</p><p><b>Message:</b><br/>${message}</p>`,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
```

2. Create `artifacts/abh-studio/netlify.toml`:

```toml
[build]
  command = "cd ../.. && pnpm install && pnpm --filter @workspace/abh-studio run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. In the frontend `Contact.tsx`, change the fetch URL from:
   ```
   `${import.meta.env.BASE_URL}api/contact`
   ```
   to:
   ```
   `/.netlify/functions/contact`
   ```

4. Add environment variables in Netlify dashboard:
   - Site settings → Environment variables → Add:
     - `GMAIL_USER` = your Gmail address
     - `GMAIL_APP_PASSWORD` = your Gmail App Password
     - `CONTACT_EMAIL` = contact@abhstudio.in

---

## Option B — Hostinger VPS (Full stack, most control)

Use this if you have a Hostinger VPS plan (KVM 1 or above). This runs both the frontend and API server together — identical to how it runs on Replit.

### Step 1 — Prepare your VPS

SSH into your Hostinger VPS:

```bash
# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 (keeps the server running)
npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt-get install -y nginx
```

### Step 2 — Upload and install the project

```bash
# On your local machine, zip the project (excluding node_modules):
zip -r abh-studio.zip . -x "*/node_modules/*" -x "*/.git/*" -x "*/dist/*"

# Upload to VPS (replace YOUR_VPS_IP)
scp abh-studio.zip root@YOUR_VPS_IP:/var/www/

# On the VPS:
cd /var/www/
unzip abh-studio.zip -d abh-studio
cd abh-studio
pnpm install
```

### Step 3 — Set environment variables

Create `/var/www/abh-studio/.env`:

```env
# API Server
PORT=8080
NODE_ENV=production
GMAIL_USER=your.gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
CONTACT_EMAIL=contact@abhstudio.in

# Frontend build
VITE_API_URL=https://abhstudio.in
```

### Step 4 — Build everything

```bash
cd /var/www/abh-studio

# Build the frontend
pnpm --filter @workspace/abh-studio run build

# Build the API server
pnpm --filter @workspace/api-server run build
```

### Step 5 — Start the API server with PM2

```bash
cd /var/www/abh-studio

# Start and save
pm2 start artifacts/api-server/dist/index.mjs \
  --name "abh-api" \
  --env production \
  -- --env-file .env

pm2 save
pm2 startup   # follow the printed command to auto-start on reboot
```

### Step 6 — Configure Nginx

Create `/etc/nginx/sites-available/abhstudio`:

```nginx
server {
    listen 80;
    server_name abhstudio.in www.abhstudio.in;

    # Serve the built React frontend
    root /var/www/abh-studio/artifacts/abh-studio/dist;
    index index.html;

    # React Router — always serve index.html for unknown routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy /api/* to the Node.js API server
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/abhstudio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7 — Add SSL (free HTTPS with Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d abhstudio.in -d www.abhstudio.in
# Follow the prompts — it auto-updates Nginx config and renews every 90 days
```

### Step 8 — Point your domain

In Hostinger's domain DNS settings, add:
- **A record** → `@` → your VPS IP address
- **A record** → `www` → your VPS IP address

---

## Option C — Hostinger Shared Hosting (Frontend only)

If you're on a shared hosting plan (not VPS), you can only host the static frontend:

1. Build: `pnpm --filter @workspace/abh-studio run build`
2. Upload the contents of `artifacts/abh-studio/dist/` to your Hostinger `public_html/` folder via FTP or File Manager
3. Create a `.htaccess` file in `public_html/`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

4. For the contact form — use [Formspree](https://formspree.io) (free, 50 submissions/month):
   - Create a free account → New Form → copy your form ID
   - In `Contact.tsx`, replace the fetch with:
     ```js
     const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(values),
     });
     ```

---

## Environment Variables Reference

| Variable | Where it's used | Example |
|---|---|---|
| `PORT` | API server port | `8080` |
| `GMAIL_USER` | Gmail account for sending | `you@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 chars) | `abcd efgh ijkl mnop` |
| `CONTACT_EMAIL` | Where you receive inquiries | `contact@abhstudio.in` |

### How to get a Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already on
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. App name: **ABH Studio** → click Create
5. Copy the 16-character password (you only see it once)

---

## Before Going Live — Checklist

- [ ] Replace all project showcase images with real client work
- [ ] Update social media links in `Footer.tsx` (Instagram, LinkedIn, Twitter)
- [ ] Add real client testimonials in `Testimonials.tsx`
- [ ] Replace the OG image (`public/og-image.png`) — 1200×630px, dark branded image
- [ ] Update `index.html` canonical URL to your real domain
- [ ] Test the contact form end-to-end
- [ ] Set up Google Analytics (add `gtag.js` to `index.html`)
- [ ] Check the site on mobile (it's responsive, but always verify)

---

## Local Development

To run the project locally after downloading:

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install

# Run the frontend (in one terminal)
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/abh-studio run dev

# Run the API server (in another terminal)
PORT=8080 pnpm --filter @workspace/api-server run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

*Built with React, Vite, Express, Framer Motion, Tailwind CSS, and a lot of craft.*
*ABH Studio — contact@abhstudio.in*
