# 🚀 BUILDBYFARAZ Platform - Complete Deployment & Domain Guide (اردو / Roman Urdu)

Yeh guide aapko aapki full-stack website (`Node.js 20 + Python 3 + FFmpeg + React Vite`) ko **100% Free** online host karne, **24/7 hamesha zinda** rakhne, aur **Custom Domain** connect karne ka mukammal A to Z tariqa asaan zubaan me samjhati hai.

---

## 📑 Fehris (Table of Contents)
1. [Khas Baat: Normal Static Hosting (Vercel/Netlify) kyn fail hoti hai?](#1-khas-baat)
2. [Do Behtareen Free Platforms (Render vs Hugging Face)](#2-do-behtareen-free-platforms)
3. [Marhala 1: Code ko GitHub par Upload Karna (Step-by-Step)](#marhala-1-code-ko-github-par-upload-karna)
4. [Marhala 2 (Option A): Render.com par 100% Free Deploy Karna](#marhala-2-option-a-rendercom-par-free-deploy)
5. [Marhala 2 (Option B): Hugging Face Spaces (16GB RAM, Never Sleeps, 100% Lifetime Free)](#marhala-2-option-b-hugging-face-spaces)
6. [Marhala 3: Render ko 24/7 Zinda (No Sleep) Rakhna](#marhala-3-render-ko-247-zinda-rakhna)
7. [Marhala 4: Sasta Domain Kharidna aur Free Cloudflare + SSL Connect Karna](#marhala-4-sasta-domain-aur-cloudflare-setup)
8. [API Endpoints aur Verification Status](#api-endpoints-aur-verification)

---

## 1. Khas Baat: Normal Static Hosting kyn fail hoti hai?

Aam websites sirf HTML, CSS, aur JS hoti hain jo Vercel ya GitHub Pages par chal jati hain. Lekin aapki website par:
1. **Universal Video & Audio Downloader** (`yt-dlp` + `FFmpeg`) jo YouTube, TikTok, Instagram se video aur audio merge karta hai.
2. **Neural Voice AI / Speechster** (`edge-tts` + Python) jo 100+ natural AI voices generate karta hai.
3. **WebSnap Engine** (Website screenshot proxy)
4. **TypingFast 3D Speed Test** (Three.js models, textures, aur audio effects)
5. **Google Drive Cloner** (Streaming zip engine)

In sab ke liye ek **Linux Server (Docker Container)** chahiye jisme **Node.js, Python 3, aur FFmpeg** teeno ek sath chalein. Humne aapke liye ek turnkey `Dockerfile`, `render.yaml`, aur optimized `server.js` banaya hai jo teeno ko automatically run karta hai.

---

## 2. Do Behtareen Free Platforms

| Feature | Render.com (Option A) | Hugging Face Spaces (Option B) |
| :--- | :--- | :--- |
| **Cost** | 100% Free | 100% Free (Lifetime) |
| **RAM / CPU** | 512MB RAM, 0.5 CPU | **16GB RAM, 2 vCPUs** (Super Fast!) |
| **Sleep Mode** | 15 min baad sota hai (UptimeRobot se 24/7 jaagta hai) | **KABHI NAHI SOTA (Always Online)** |
| **Custom Domain** | Yes (Free Custom Domain + SSL) | Yes (Embed / Direct CNAME) |
| **Docker Support** | Direct GitHub integration | Direct Git / Spaces integration |

---

## Marhala 1: Code ko GitHub par Upload Karna

Agar aapka project abhi tak GitHub par nahi hai, toh yeh simple steps follow karein:

### Step 1: GitHub par New Repository Banayein
1. [github.com](https://github.com) par login karein aur [github.com/new](https://github.com/new) open karein.
2. **Repository Name** likhein: `buildbyfaraz-platform`
3. Isko **Public** ya **Private** rakhein (dono chalenge).
4. Kisi bhi checkbox (README, .gitignore) ko tick **NA** karein (kyunke project me pehle se bani hui hain).
5. **Create repository** par click karein.

### Step 2: Apne Computer se Code Push Karein
Apne computer me terminal / PowerShell open karein (`d:\buildbyfaraz\Main website` me) aur yeh commands chalayein:

```bash
git init
git add .
git commit -m "feat: production ready docker, python helpers and server setup"
git branch -M main
git remote add origin https://github.com/APNA_GITHUB_USERNAME/buildbyfaraz-platform.git
git push -u origin main
```
*(Tip: `APNA_GITHUB_USERNAME` ki jagah apna asali GitHub username likhein).*

Agar kabhi `remote origin already exists` ka error aaye, toh yeh command dein:
```bash
git remote set-url origin https://github.com/APNA_GITHUB_USERNAME/buildbyfaraz-platform.git
git push -u origin main
```

---

## Marhala 2 (Option A): Render.com par Free Deploy

Render sab se asaan aur mashhoor free cloud platform hai:

1. [render.com](https://render.com) par jayein aur **Sign In with GitHub** karein.
2. Dashboard par upar **New +** button daba kar **Web Service** choose karein.
3. **Build and deploy from a Git repository** par click karein aur apni repo `buildbyfaraz-platform` ke samne **Connect** dabayein.
4. Settings page par:
   - **Name**: `buildbyfaraz-platform` (ya jo aapko pasand ho)
   - **Region**: `Oregon (US West)` ya `Frankfurt (EU)`
   - **Branch**: `main`
   - **Runtime**: **Docker** (Render khud `Dockerfile` ko utha lega)
   - **Instance Type**: **Free** ($0/month)
5. **Create Web Service** button par click kar dein!
6. Render aapke container ko build karega (Node.js, Python, FFmpeg sab automatically install honge). 2 se 3 minute me aapki website live ho jayegi:
   👉 `https://buildbyfaraz-platform.onrender.com`

---

## Marhala 2 (Option B): Hugging Face Spaces (16GB RAM, Never Sleeps!)

Agar aapko bohot zyada heavy video downloading aur high-speed speech synthesis karni hai, toh Hugging Face Spaces dunya ka sab se taqatwar free option hai:

1. [huggingface.co](https://huggingface.co) par jayein aur free account banayein.
2. Upar profile icon par click karke **New Space** choose karein.
3. Space details:
   - **Space Name**: `buildbyfaraz`
   - **License**: `mit` ya `apache-2.0`
   - **Select the Space SDK**: **Docker** (Blank select karein)
   - **Space Hardware**: **Free - 2 vCPU, 16GB RAM, 50GB Disk** ($0/mo)
   - **Visibility**: Public
4. **Create Space** par click karein.
5. Hugging Face aapko ek Git remote dega. Apne terminal me commands chalayein:
   ```bash
   git remote add space https://huggingface.co/spaces/APNA_HF_USERNAME/buildbyfaraz
   git push space main
   ```
6. Hugging Face khud Dockerfile run karega (port `7860` automatically configured hai).
7. Aapki site hamesha ke liye 24/7 **bina kisi sleep ke** 16GB RAM par live ho jayegi!

---

## Marhala 3: Render ko 24/7 Zinda (No Sleep) Rakhna

Render ka free plan agar 15 minute koi user na aaye toh sleep mode me chala jata hai. Isko **hamesha 24 ghante jagane** ke liye humne `server.js` me `/health` endpoint bana diya hai:

1. [cron-job.org](https://cron-job.org) ya [uptimerobot.com](https://uptimerobot.com) par free account banayein.
2. **Add New Monitor / Cronjob**:
   - **Name**: `Faraz Platform Pinger`
   - **URL**: `https://buildbyfaraz-platform.onrender.com/health`
   - **Monitoring Interval**: Har **5 Minute** baad.
3. Save kar dein!
4. **Result**: Yeh bot har 5 minute baad aapki site ke `/health` par halki si ping bhejega. Render samjhega traffic aa raha hai aur aapki website **kabhi bhi sleep mode me nahi jayegi**!

---

## Marhala 4: Sasta Domain Kharidna aur Free Cloudflare + SSL Connect Karna

### 1. Acha aur Sasta Domain Kahan se lein?
- **Porkbun.com** ya **Namecheap.com**:
  - Agar `.com` lena hai: Taqreeban **$9 se $10/year** me milta hai.
  - Agar bilkul sasta chahiye: `.xyz`, `.site`, `.online`, `.top`, `.me` aksar **$1 se $3 (sirf 300 se 800 PKR)** me poore saal ke liye mil jate hain!

### 2. Free Cloudflare Setup (Must-Have for Speed & Security):
1. [cloudflare.com](https://cloudflare.com) par free account banayein.
2. **Add a Domain** par click karke apna kharida hua domain likhein (e.g. `buildbyfaraz.com`).
3. Free Plan select karein.
4. Cloudflare aapko **2 Nameservers** dega (jaise `amy.ns.cloudflare.com` aur `bob.ns.cloudflare.com`).
5. Jahan se domain kharida (Namecheap ya Porkbun), wahan **Domain Management -> Nameservers** me ja kar Cloudflare ke 2 Nameservers paste kar dein.

### 3. Render me Domain Connect Karna:
1. Render Dashboard me apni Web Service (`buildbyfaraz-platform`) open karein.
2. Left menu me **Settings** par click karein aur scroll karke **Custom Domains** section me jayein.
3. **Add Custom Domain** par click karein aur apna domain likhein:
   - Example: `buildbyfaraz.com` aur `www.buildbyfaraz.com`
4. Render aapko target URL dega (jaise `buildbyfaraz-platform.onrender.com`).
5. Ab [cloudflare.com](https://cloudflare.com) ke **DNS** tab me jayein aur yeh records add karein:
   - **Record 1**:
     - Type: `CNAME`
     - Name: `@` (Root)
     - Target: `buildbyfaraz-platform.onrender.com`
     - Proxy status: `Proxied` (Orange cloud)
   - **Record 2**:
     - Type: `CNAME`
     - Name: `www`
     - Target: `buildbyfaraz-platform.onrender.com`
     - Proxy status: `Proxied` (Orange cloud)
6. ⚠️ **Zaroori Setting (Redirect Loop Se Bachne Ke Liye)**:
   - Cloudflare me left menu se **SSL/TLS** par click karein.
   - Encryption mode ko **Full** (ya **Full (Strict)**) par set karein. (Agar `Flexible` par rahega toh `ERR_TOO_MANY_REDIRECTS` ka error aa sakta hai).
7. 5 se 10 minute me Cloudflare aur Render ka handshake mukammal ho jayega aur aapka custom domain green tick ke sath live ho jayega!

---

## API Endpoints aur Verification Status

Aapke production server (`server.js`) me darj zail tamam features verified hain:

| Route / Feature | Purpose | Verification Status |
| :--- | :--- | :--- |
| `GET /health` & `/api/health` | Uptime bot & Docker container health monitoring | ✅ 200 OK JSON (`status: "ok"`) |
| `GET /api/videodl?action=extract` | Video/Audio extraction (yt-dlp + Smart sniffer) | ✅ 200 OK JSON with formats |
| `GET /api/videodl?action=stream` | Video player preview & proxy stream | ✅ 200/206 Audio/Video stream |
| `GET /api/videodl?action=download` | Instant direct download or FFmpeg 1080p merge | ✅ Stream attachment download |
| `GET /api/alldl` | Fallback video extraction proxy | ✅ Upstream proxied |
| `POST /api/tts` & `GET /api/tts` | Edge-TTS neural speech synthesis (100+ voices) | ✅ MP3 audio binary returned |
| `GET /api/websnap` | Real-time website screenshot capture proxy | ✅ Upstream proxied |
| `GET /typingfast/` | Minion 3D Typing Speed Test | ✅ 200 OK standalone app |
| `GET /` & SPA routes | React 18 + Vite + Tailwind + Three.js | ✅ High performance SPA |
