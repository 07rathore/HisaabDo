you # 🏛️ HisaabDo (हिसाब दो) — AI-Powered MPLADS Audit & Transparency Engine

> **Smart India Hackathon (SIH)** • Intelligent Public Fund Monitoring, Spatial Locality Auditing, and Citizen Ground-Truth Verification

---

## 🌟 Executive Overview

**HisaabDo** is an enterprise-grade AI monitoring and transparency platform engineered for the **Members of Parliament Local Area Development Scheme (MPLADS)**. Ingesting over **34,001 official government records** spanning **₹867+ Crores**, HisaabDo replaces slow sample-based audits with real-time, multivariate Machine Learning surveillance.

The system combines **Scikit-Learn Isolation Forest (5-feature anomaly model)** with **NLP TF-IDF semantic duplicate clustering** and a **statutory rule engine**, outputting an explainable **0–100 Convergence Risk Score** for every sanctioned public work.

---

## 🚀 Key Modules & Architecture (10 Sections)

1. **Executive Dashboard & Surveillance Center**:
   - 6 macro KPI metrics (Total Projects, Disbursed Funds, Flagged at Risk, Critical Outliers, Cloned Clusters, Zero-Photo Rate).
   - Instant triage filters for **Ghost Works**, **Statutory Threshold Avoidance**, **Single-Day Batch Sign-offs**, and **Inflated Road Costs**.

2. **Projects Explorer & Locality Map (Spatial Intelligence)**:
   - Interactive GIS state and constituency map with risk-colored pinpoints.
   - Deep-dive project drawer with **Hon'ble MP profiles**, allocated limits, calamity fund contributions, and GPS coordinates.
   - Integrated **Gemini AI Audit Assistant** for automated forensic briefs.

3. **NLP Semantic Duplicate & Cloned Sanction Detection**:
   - Discovers cloned work descriptions across multiple sanctions using TF-IDF + Cosine Similarity.
   - Identified **226 duplicate clusters** in official government records (e.g. Sambit Patra pattern, identical CC roads).

4. **Citizen Ground-Truth & RTI Action Hub**:
   - Public constituency search allowing citizens to verify local projects.
   - **Community Ground Check**: Citizens report ghost works and upload geo-tagged photo evidence.
   - **1-Click RTI Form 'A' Generator**: Pre-filled formal application under Section 6(1) of the Right to Information Act, 2005.
   - **Locality Email Notification Signup**: Citizens subscribe to receive automatic alerts when new works are sanctioned.

5. **Parliamentarian (MP) Risk Profiling**:
   - Dynamic scorecards for all 543 Lok Sabha MPs.
   - Integrates official data from *Allocated Limit for Hon'ble MPs* (₹14Cr–₹19Cr) and *Calamity Fund Consents*.
   - Calculates MP utilization percentage vs. anomaly density.

6. **Geometric & Cost Comparative Analytics**:
   - Expenditure distribution by work category.
   - Sanction-to-completion turnaround time feasibility histograms.
   - PWD Schedule of Rates (SSR) benchmark comparison (₹2,200/meter baseline).
   - Single-day mass sign-off volume distributions.

7. **Citizen Action Center**:
   - Community whistleblower feed and recent citizen-submitted ground verifications.

8. **Government Officer Action Center**:
   - Secure simulated official login console (MoSPI Vigilance Directorate).
   - Triage queue for Critical & High risk cases.
   - Official actions: **Emergency Disbursal Freeze**, **Show-Cause Inquiry Notice**, and **Collectorate Ground Physical Inspection**.
   - Chronological digital audit compliance trail.

9. **Custom Report Builder & Audit Dossier Export**:
   - Multi-attribute filtering by MP, State, Risk Tier, Category, and Missing Photo status.
   - 1-Click **Export to CSV**.
   - **Printable Official Audit Dossier** formatted for formal tribunals and parliamentary inquiry.

10. **Dynamic Settings & Real-Time Risk Formula Tuning**:
    - Interactive sliders to calibrate statutory penalty weights (threshold evasion, missing photos, SSR deviation, mass sign-offs).
    - Slider to adjust **ML vs. Rule Engine ensemble blend ratio** (e.g., 55% ML / 45% Rules).
    - **"Recalculate All Scores"** button to dynamically re-index all 34,001 records in real-time.
    - Google Gemini API key configuration with automatic offline heuristic fallback.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI/UX** | React 18, Vite, Tailwind CSS, Lucide React Icons |
| **Design System** | Clean government/fintech developer aesthetic, Plus Jakarta Sans, JetBrains Mono |
| **Machine Learning** | Python, Scikit-Learn (`IsolationForest`), NumPy |
| **Natural Language Processing** | `TfidfVectorizer`, Cosine Similarity Clustering |
| **Generative AI** | Google Gemini API (1.5 Flash / 1.5 Pro) with offline deterministic fallback |
| **Backend API (Optional)** | FastAPI, Uvicorn, Python 3.12 |
| **Data Engine** | Official MoSPI CSVs (34,001 completed works, 23,001 sanctions, MP allocations) |

---

## ⚡ Quick Start & Local Run

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10+ with `scikit-learn`, `numpy`)

### 1. Launch the Frontend Web Platform
```bash
cd hisaabdo_web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. (Optional) Run the ML Pipeline / API Server
```bash
# Re-run ML Pipeline on raw CSV datasets
python engine/ml_engine.py

# Run FastAPI backend server (optional)
python engine/api_server.py
```

---

## 🌐 1-Click Deployment Guide (Vercel / GitHub)

### Step 1: Initialize Git Repository
```bash
git init
git add .
git commit -m "feat: complete HisaabDo MPLADS AI Monitoring Platform v2.0"
```

### Step 2: Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/hisaabdo-mplads-ai.git
git push -u origin main
```

### Step 3: Deploy to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Set **Root Directory** to `hisaabdo_web`.
4. Build command: `npm run build`, Output directory: `dist`.
5. Click **Deploy**. Your platform will be live on a fast global CDN in under 60 seconds!

---

## 📄 License
Open source under the MIT License. Developed for Smart India Hackathon (SIH).
