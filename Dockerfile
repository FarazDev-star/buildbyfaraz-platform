# ========================================================
# BUILDBYFARAZ All-in-One Production Container
# Supports: Node.js 20 + Python 3 + FFmpeg + Vite + Edge-TTS
# Compatible with: Render, Koyeb, Hugging Face Docker Spaces, Railway, Fly.io
# ========================================================

FROM node:20-bookworm-slim

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies: Python 3, pip, venv, ffmpeg, curl, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup isolated Python virtual environment (PEP 668 compliant)
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Python backend dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Node dependencies (including devDependencies required for Vite build)
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build production frontend bundle into dist/
RUN npm run build

# Remove development dependencies to keep container slim and fast
RUN npm prune --omit=dev

# Create downloads directory and configure permissions for node user (UID 1000)
# Ensures seamless compatibility with Hugging Face Spaces (UID 1000) and non-root security best practices
RUN mkdir -p /app/.temp_downloads && \
    chown -R node:node /app /opt/venv

USER node

# Set production environment variables
# Port 7860 is default for Hugging Face Spaces; Render/Koyeb override via runtime env
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=7860
ENV PYTHON_BIN=/opt/venv/bin/python

# Expose ports for HF Spaces (7860), Render (10000), and local/standard (3000)
EXPOSE 7860 10000 3000

# Docker health check for automated container monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-7860}/health || exit 1

# Start unified Node.js + Python web server
CMD ["node", "server.js"]
