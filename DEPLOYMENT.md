# Production Deployment Guide

This guide covers deploying the **NexusAuth** full-stack authentication system across various cloud platforms and container environments.

---

## Architecture Overview

```text
               +-------------------------------------------+
               |            Internet / Clients             |
               +-------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  Nginx Reverse Proxy & Static Host                      |
|                           (Port 80 / 443)                               |
|  - Serves React SPA with immutable asset caching                        |
|  - Injects Security Headers (X-Frame-Options, X-Content-Type-Options)    |
|  - Proxies /auth/*, /sessions/*, /api/* to FastAPI backend              |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                       FastAPI Backend Service                           |
|                             (Port 8000)                                 |
|  - Direct Bcrypt salting                                                |
|  - JWT token generation & refresh rotation                              |
|  - SlowAPI rate limiting & lockout                                      |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                     PostgreSQL Database (Remote/Cloud)                  |
|                    (e.g., Supabase, Neon, AWS RDS)                      |
+-------------------------------------------------------------------------+
```

---

## Pre-Deployment Checklist

1. **Generate a Strong Production Secret Key**:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
2. **Google OAuth Production Redirect URIs**:
   In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Add your production domain to **Authorized JavaScript origins** (e.g., `https://auth.yourdomain.com`).
3. **Database Connection**:
   - Obtain a PostgreSQL connection URI with SSL mode enabled (e.g. from Supabase, Neon, or Railway).

---

## Option 1: Docker Compose (Recommended for VPS / EC2 / Droplets)

Both the frontend and backend are pre-configured with production Dockerfiles.

### 1. Clone repository on the server
```bash
git clone https://github.com/your-username/Authentication-System.git
cd Authentication-System
```

### 2. Configure Environment Variables
Create a root `.env` file (or export variables in your shell):
```env
DATABASE_URL=postgresql://user:password@db-host:5432/dbname
SECRET_KEY=your-64-character-hex-secret-key-here
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
CORS_ORIGINS=https://yourdomain.com
```

### 3. Build & Launch Containers
```bash
docker compose up -d --build
```

### 4. Verify Services
```bash
# Check container status
docker compose ps

# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost/healthz
```

---

## Option 2: Render.com (Blueprint Deployment)

The project includes a ready-to-use [`render.yaml`](file:///c:/Users/DBU/Desktop/projects/Authentication-System/render.yaml) blueprint.

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [Render.com](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your repository. Render automatically reads `render.yaml` and provisions:
   - `nexusauth-backend`: Python Web Service with auto-generated `SECRET_KEY` and Uvicorn.
   - `nexusauth-frontend`: Static Site with SPA routing rewrites.
5. In the Render dashboard, set `DATABASE_URL` and `GOOGLE_CLIENT_ID` under the backend environment variables.
6. Set `VITE_API_URL` under the frontend environment variables to point to your backend Render URL.

---

## Option 3: Decoupled Cloud Deployment (Vercel + Render/Railway)

### A. Deploy Backend to Render or Railway
1. **Root Directory**: `backend`
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers`
4. Set environment variables:
   - `SECRET_KEY`: (Secure random hex)
   - `DATABASE_URL`: (Postgres connection string)
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
   - `GOOGLE_CLIENT_ID`: (Your Google Client ID)

### B. Deploy Frontend to Vercel
1. **Root Directory**: `frontend`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Set environment variables:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID`: `your-google-client-id`
6. Add `vercel.json` rewrite rule for SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## Production Security Best Practices

- **Enforce HTTPS**: Always terminate SSL/TLS via Let's Encrypt / Certbot or Cloudflare.
- **Strict Secrets**: Never commit real production `.env` files into Git.
- **Reverse Proxy**: Keep the backend port `8000` internal and expose only port `80`/`443` through Nginx or a cloud load balancer.
- **Database Backups**: Enable automated daily backups on your PostgreSQL provider.
