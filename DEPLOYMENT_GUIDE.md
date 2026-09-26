# 🚀 BUILDBYFARAZ Platform - Complete Deployment & Domain Guide (اردو / Roman Urdu)

Yeh guide aapko aapki full-stack website (`Node.js + Python + FFmpeg + Vite`) ko **100% Free** online host karne aur **Custom Domain** connect karne ka mukammal A-Z tariqa samjhati hai.

---

## 📑 Fehris (Table of Contents)
1. [Khas Baat: Static Hosting (Vercel/Netlify) kyn kafi nahi?](#1-khas-baat)
2. [Behtareen Free Cloud Platforms](#2-behtareen-free-cloud-platforms)
3. [Marhala 1: Code ko GitHub par Upload Karna](#marhala-1-code-ko-github-par-upload-karna)
4. [Marhala 2: Render.com par 100% Free Deploy Karna](#marhala-2-rendercom-par-100-free-deploy-karna)
5. [Marhala 3: Website ko 24/7 Zinda (Always Online) Rakhna](#marhala-3-website-ko-247-zinda-always-online-rakhna)
6. [Marhala 4: Custom Domain Kharidna aur Free Connect Karna](#marhala-4-custom-domain-kharidna-aur-free-connect-karna)
7. [Alternative Options (Hugging Face Docker & Koyeb)](#7-alternative-options)

---

## 1. Khas Baat: Static Hosting (Vercel/Netlify) kyn kafi nahi?
Aapki website aam HTML/React site nahi hai. Isme:
- **Universal Video & Audio Downloader** (`yt-dlp` + `ffmpeg`)
- **Neural Voice AI / Speechster** (`edge-tts` + Python)
- **TypingFast, Drive Cloner & WebSnap Proxies**

In sab ko chalane ke liye ek **Linux Server** chahiye jisme **Node.js, Python 3, aur FFmpeg** teeno mojood hon. Humne aapke liye ek production-grade `Dockerfile`, `render.yaml`, aur optimized `server.js` banaya hai jo teeno ko ek hi container me chalata hai.

---

## 2. Behtareen Free Cloud Platforms

| Platform | Free Tier | Specs | Best For |
| :--- | :--- | :--- | :--- |
| **Render.com** (Recommended) | Free Web Service (Docker) | 512MB RAM, Auto SSL, Custom Domain | Sab se aasan setup, zero friction |
| **Hugging Face Spaces** | 100% Free Lifetime | 16GB RAM, 2 vCPUs, No sleep | High performance video processing |
| **Koyeb** | Free Nano instance | 512MB RAM, Global Edge | Fast container deployment |

---

## Marhala 1: Code ko GitHub par Upload Karna

Agar aapka project abhi tak GitHub par nahi hai, toh command prompt / terminal me yeh steps follow karein:

1. **GitHub par new repository banayein**:
   - [github.com/new](https://github.com/new) par jayein.
   - Repository name rakhein: `buildbyfaraz-platform`
   - Public ya Private select karein aur **Create repository** par click karein.

2. **Apne computer ke project folder me Git initialize karein**:
   Terminal / PowerShell open karein (`d:\buildbyfaraz\Main website` me):
   ```bash
   git init
   git add .
   git commit -m "feat: complete production ready build with docker & python helpers"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/buildbyfaraz-platform.git
   git push -u origin main
   ```
   *(Note: `YOUR_GITHUB_USERNAME` ki jagah apna GitHub username likhein).*

---

## Marhala 2: Render.com par 100% Free Deploy Karna

1. **Render par account banayein**:
   - [render.com](https://render.com) par jayein aur **Sign In with GitHub** karein.
2. **New Web Service banayein**:
   - Dashboard par **New +** button daba kar **Web Service** select karein.
   - **Build and deploy from a Git repository** choose karein.
   - Apni GitHub repository `buildbyfaraz-platform` ko **Connect** karein.
3. **Settings configure karein**:
   - **Name**: `buildbyfaraz` (ya jo aap chahein)
   - **Region**: Oregon (US West) ya Frankfurt (Europe)
   - **Branch**: `main`
   - **Runtime**: **Docker** (Render khud `Dockerfile` detect kar lega)
   - **Instance Type**: **Free** ($0/month)
4. **Deploy**:
   - **Create Web Service** par click karein.
   - Render aapke liye container build karega (Node.js + Python + FFmpeg install karega, Vite build karega).
   - 2 se 3 minute me aapki website live ho jayegi aur aapko ek free URL mil jayega, jaise:
     `https://buildbyfaraz.onrender.com`

---

## Marhala 3: Website ko 24/7 Zinda (Always Online) Rakhna

Render ka Free tier 15 minute baad sleep mode me chala jata hai agar koi traffic na aaye. Isko **hamesha 24/7 jaagta rakhne** ke liye humne `server.js` me `/health` endpoint bana diya hai.

1. [cron-job.org](https://cron-job.org) ya [uptimerobot.com](https://uptimerobot.com) par free account banayein.
2. **Add New Monitor / Cronjob**:
   - **URL to monitor**: `https://your-app-name.onrender.com/health`
   - **Interval**: Har **5 ya 10 minute** baad.
3. **Fayda**: Yeh bot har 5 minute baad aapki site ko ping karega, jis se Render ka server **kabhi bhi sleep mode me nahi jayega** aur hamesha 24/7 fast open hoga!

---

## Marhala 4: Custom Domain Kharidna aur Free Connect Karna

Agar aap apni marzi ka domain (e.g. `buildbyfaraz.com` ya `buildbyfaraz.site`) lagana chahte hain:

### 1. Sasta aur Acha Domain Kahan se lein?
- **Porkbun.com** ya **Namecheap.com**: `.com` domain ~$9–$10/year me mil jata hai. `.xyz`, `.top`, `.online` aksar **$1 se $3** me mil jate hain.
- Agar bilkul free test karna ho toh Freenom ya Cloudflare ke free subdomains use kiye ja sakte hain.

### 2. Free Cloudflare DNS Setup (Recommended):
1. [cloudflare.com](https://cloudflare.com) par free account banayein aur apna domain add karein.
2. Cloudflare ke diye gaye 2 NameServers apne domain registrar (jahan se domain kharida) me paste kar dein.
3. **Fayda**: Cloudflare se aapko **Free Lifetime SSL (HTTPS)**, **DDoS Protection**, aur **Fast Global CDN** milta hai.

### 3. Render me Domain Connect Karna:
1. Render Dashboard me apni Web Service par jayein.
2. **Settings** -> **Custom Domains** par click karein.
3. **Add Custom Domain** daba kar apna domain enter karein (e.g. `www.yourdomain.com` ya `yourdomain.com`).
4. Render aapko ek **CNAME** target dega (jaise `buildbyfaraz.onrender.com`).
5. Cloudflare DNS me ja kar ek naya record add karein:
   - **Type**: `CNAME`
   - **Name**: `@` (root domain) ya `www`
   - **Target**: `buildbyfaraz.onrender.com`
   - **Proxy status**: Proxied (Orange cloud) ya DNS only.
6. 5–10 minute me SSL automatically activate ho jayega aur aapki site aapke custom domain par secure chalegi!

---

## 7. Alternative Options (Hugging Face Docker & Koyeb)

### Option B: Hugging Face Spaces (100% Free Lifetime, 16GB RAM)
Agar aapko bohot heavy video downloading karni hai:
1. [huggingface.co](https://huggingface.co) par account banayein.
2. **New Space** -> Space SDK: **Docker** -> Blank select karein.
3. Apni files push karein ya GitHub se connect karein.
4. Hugging Face me yeh 24/7 bina soye chalta hai aur 16GB RAM milti hai!

---

## ✅ Tamam Functions ki Verification
Aapki site par sab kuch ready hai:
- `/health` -> Monitoring status check
- `/api/videodl` -> Video & Audio downloader
- `/api/tts` -> Speechster Edge-TTS
- `/api/websnap` -> Website screenshot generator
- `/typingfast/` -> Typing practice app
- Root SPA -> Full UI, animations, Three.js 3D canvas
