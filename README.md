# Nursing & Paramedical Admission Portal
### Institutional Admission, Examination & Student Verification System

A secure, centralized admission and institutional management portal for Nursing (ANM, GNM, B.Sc Nursing, Post Basic B.Sc, M.Sc) and Paramedical courses (DMLT, BMLT, Operation Theatre Technology, Dialysis, Radiology, etc.). Features public course catalogs, affiliated college directories, inquiry workflows, examination calendars, admit cards, results, student document upload and verification, and an administrative control panel with automated rolling backups.

---

## 🔒 Security & Privacy First

This repository is pre-configured with strict security practices:
- **No secrets in Git**: Passwords, JWT secrets, and environment tokens are excluded via `.gitignore`.
- **No confidential student documents**: Uploaded marksheets, certificates, and identity documents are stored in `data/secure_documents/` and are strictly ignored by Git.
- **No live database in Git**: The runtime database (`portal_database.json`) and automated snapshots (`data/backups/`) are excluded from version control to prevent data leaks.

---

## 🚀 Key Features

1. **Public Portal**:
   - Zero-barrier public browsing with category filters, dynamic search, and fee/eligibility details.
   - Comprehensive affiliated colleges directory with state and district filters.
   - Examination notices, admit card download links, and answer key releases.
   - Direct online admission inquiry and application submission.

2. **Student Self-Service Portal (`/#student`)**:
   - Secure login via Mobile Number & Application Number with JWT authentication.
   - Application status tracking (Pending, Verified, Admitted).
   - Secure document uploader (10th/12th marksheets, certificates) with MIME type and extension validation.

3. **Administrative Control Console**:
   - Discreet access via the public header (3-dot navigation menu).
   - Full CRUD over courses, notices, colleges, banners, exam calendars, results, and sitemaps.
   - Real-time student inquiry management and document review.
   - Automated rolling database backups every 6 hours with 1-click restore.

---

## ⚙️ Environment Configuration

Before running the application in production or locally, copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and supply your production values:

| Variable | Description | Example / Default |
|---|---|---|
| `NODE_ENV` | Environment mode (`development` or `production`) | `production` |
| `PORT` | Local or container server port | `3000` |
| `JWT_SECRET` | 64+ char random string for signing JWT session tokens | `openssl rand -hex 32` |
| `ADMIN_INITIAL_PASSWORD` | Initial password used when bootstrapping the admin account | `Admin@Nursing2026!` |
| `APP_URL` | Canonical URL of your deployed website | `https://admission.yourinstitution.edu.in` |

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js version 20.x or 22.x LTS
- npm version 9.x or higher

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/<your-username>/nursing-paramedical-portal.git
cd nursing-paramedical-portal

# 2. Install dependencies
npm install

# 3. Create .env from template
cp .env.example .env

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 📦 Production Build & Run

```bash
# Compile frontend production bundle
npm run build

# Start production server
npm start
```

The production server will listen on `http://0.0.0.0:3000` (or the port defined in `$PORT`).

---

## 🌐 Production Deployment Guide

### Option 1: Deploying to Render.com (Recommended)

1. Create a **New Web Service** connected to your GitHub repository.
2. Configure settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Starter` ($7/month)
3. **Attach Persistent Disk** (to preserve database and student documents across restarts):
   - Go to the **Disks** section in Render.
   - Add a Disk: Name = `data-disk`, Mount Path = `/opt/render/project/src/data`, Size = `1 GB`.
4. **Set Environment Variables**:
   - Add `NODE_ENV=production`, `PORT=3000`, `JWT_SECRET`, `ADMIN_INITIAL_PASSWORD`, and `APP_URL`.
5. **Connect Custom Domain**:
   - Add your domain under **Custom Domains**. Render will automatically provision an SSL certificate via Let's Encrypt.

### Option 2: Deploying to Ubuntu VPS (DigitalOcean / AWS / Hetzner)

1. Install Node.js 22, Nginx, and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs nginx git
   sudo npm install -g pm2
   ```
2. Clone repository to `/var/www/portal` and set up `.env`.
3. Build and launch with PM2:
   ```bash
   npm install
   npm run build
   pm2 start server.ts --name "admission-portal" --interpreter ./node_modules/.bin/tsx
   pm2 save
   pm2 startup
   ```
4. Configure Nginx reverse proxy to `http://127.0.0.1:3000` and issue SSL with Certbot:
   ```bash
   sudo certbot --nginx -d yourdomain.in -d www.yourdomain.in
   ```

---

## 🗄️ Database & Document Storage Architecture

- **Primary Database**: Serialized atomic JSON file located at `data/portal_database.json`.
- **Automated Snapshots**: Automated rolling backups saved to `data/backups/` every 6 hours (retains the latest 20 snapshots).
- **Student Uploads**: Confidential marksheets and identity documents are stored in `data/secure_documents/` and accessed only by authenticated administrators.
- **Public Assets**: Website banners and public institution seals are stored in `public/uploads/`.

---

## 📜 License
Proprietary / Institutional Educational License. All rights reserved.
