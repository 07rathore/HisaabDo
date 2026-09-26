# HisaabDo — Complete Deployment & Cloud Architecture Guide

This comprehensive guide covers deploying **HisaabDo** (Frontend UI, Python ML Backend, and Dataset Pipeline) across free and production-grade cloud services.

---

## 1. System Architecture Overview

```
                      +-----------------------------------+
                      |       Vercel / Netlify CDN        |
                      |  HisaabDo Web Frontend (React 19) |
                      |    Interactive Leaflet GIS Map    |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+-----------------------------------+      +-----------------------------------+
|      Static Compiled Data         |      |    Render / Railway Backend       |
|  audited_projects.json (~900KB gz)|      |   FastAPI + Isolation Forest ML   |
|   (34,001 Records / Offline Fast) |      |    (engine/api_server.py)         |
+-----------------------------------+      +-----------------+-----------------+
                                                             |
                                           +-----------------+-----------------+
                                           |      Official MoSPI Datasets      |
                                           |    Works Completed (34,001 rows)  |
                                           |    Works Sanctioned (23,001 rows) |
                                           |    MP Allocations (544 MPs)       |
                                           |    Calamity Funds (13 records)    |
                                           +-----------------------------------+
```

---

## 2. Deploying the Frontend (React + Vite + Leaflet)

### Option A: Vercel (Recommended — Free, Fast Global Edge CDN)
1. Push your repository to GitHub (see Section 5 below).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository `HisaabDo`.
4. Configure Project Settings:
   - **Root Directory**: `hisaabdo_web`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Vercel will build the frontend and provide a live URL (e.g., `https://hisaabdo.vercel.app`) with automatic HTTPS and global CDN caching.

### Option B: Netlify
1. Log in to [netlify.com](https://www.netlify.com/).
2. Select **"Import from Git"** and choose your repo.
3. Set **Base directory** to `hisaabdo_web`.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `hisaabdo_web/dist`.
6. Click **"Deploy site"**.

---

## 3. Deploying the Backend & ML Pipeline (FastAPI)

The backend provides real-time audit scoring, CSV ingestion, and duplicate cluster queries via `engine/api_server.py`.

### Option A: Render (Free Tier Web Service)
1. Sign up at [render.com](https://render.com).
2. Click **"New +"** ➔ **"Web Service"**.
3. Connect your GitHub repository.
4. Configure service parameters:
   - **Name**: `hisaabdo-ml-engine`
   - **Environment**: `Python 3`
   - **Root Directory**: `.` (or leave blank)
   - **Build Command**: `pip install -r engine/requirements.txt`
   - **Start Command**: `uvicorn engine.api_server:app --host 0.0.0.0 --port $PORT`
5. Click **"Create Web Service"**. Render will deploy your FastAPI service with a live HTTPS endpoint.

### Option B: Railway
1. Go to [railway.app](https://railway.app) and select **"New Project"** ➔ **"Deploy from GitHub repo"**.
2. Add a Start Command under Settings: `uvicorn engine.api_server:app --host 0.0.0.0 --port $PORT`.
3. Add environment variable `PORT=8000`.

---

## 4. How Datasets Are Handled

### 1. Static Ingestion (Included in Frontend)
- When you run `python engine/ml_engine.py`, the ML pipeline processes all 34,001 completed works and cross-references MP allocations and calamity funds.
- It automatically creates `hisaabdo_web/src/data/audited_projects.json`.
- When Vite builds the project, this JSON is bundled and gzipped (~900KB).
- **Benefit**: The web application loads in under 1 second with 0 backend dependencies, perfect for high-concurrency hackathon judging and live demonstrations.

### 2. Live Large Datasets on Cloud (If scaling beyond 100,000+ records)
- **Supabase / PostgreSQL**: Run a migration script to upload `Works Completed.csv` and `Allocated Limit for Honble MPs.csv` into a managed PostgreSQL database on Supabase.
- **AWS S3 / Cloudflare R2**: Store raw CSV dumps in an S3 bucket and have `api_server.py` stream chunks during audit re-runs.

---

## 5. Step-by-Step GitHub Setup Guide

Follow these terminal commands from the project root (`f:\PROGRAMMING\Projects\SIH 2026`):

```bash
# 1. Initialize Git repository
git init

# 2. Add all project files (ignoring node_modules and cache via .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: HisaabDo v2.0 - Complete professional overhaul with Leaflet GIS and official portal"

# 4. Rename default branch to main
git branch -M main

# 5. Create a new repository on github.com named 'HisaabDo'
# Then link your local repository:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/HisaabDo.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 6. Verifying the Build Locally Before Pushing

```bash
# 1. Test ML Engine
python engine/ml_engine.py

# 2. Test Frontend Build
cd hisaabdo_web
npm run build
npm run preview
```
