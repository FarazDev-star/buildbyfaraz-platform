import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');
const PYTHON_CMD = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
const TEMP_DIR = path.resolve(__dirname, '.temp_downloads');

if (!fs.existsSync(TEMP_DIR)) {
  try { fs.mkdirSync(TEMP_DIR, { recursive: true }); } catch (e) {}
}

function cleanupTempFiles() {
  try {
    if (!fs.existsSync(TEMP_DIR)) return;
    const now = Date.now();
    const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour
    const files = fs.readdirSync(TEMP_DIR);
    for (const file of files) {
      const fp = path.join(TEMP_DIR, file);
      try {
        const stat = fs.statSync(fp);
        if (now - stat.mtimeMs > MAX_AGE_MS) {
          fs.unlinkSync(fp);
        }
      } catch (e) {}
    }
  } catch (e) {}
}

cleanupTempFiles();
setInterval(cleanupTempFiles, 30 * 60 * 1000).unref();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm'
};

// Generic proxy helper for upstream APIs
async function proxyUpstream(req, res, targetBase, stripPrefix = '') {
  try {
    let subPath = req.url;
    if (stripPrefix && subPath.startsWith(stripPrefix)) {
      subPath = subPath.slice(stripPrefix.length);
      if (!subPath.startsWith('/')) subPath = '/' + subPath;
    }

    const targetUrl = new URL(subPath, targetBase).toString();
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;
    delete headers.referer;

    let bodyData = null;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      bodyData = Buffer.concat(chunks);
    }

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...headers,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      body: bodyData
    });

    res.statusCode = upstreamRes.status;
    upstreamRes.headers.forEach((val, key) => {
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, val);
      }
    });
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (upstreamRes.body) {
      Readable.fromWeb(upstreamRes.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: `Proxy upstream error: ${err.message}` }));
  }
}

// Video Downloader API Handler
async function handleVideoDl(req, res, urlObj) {
  try {
    const action = urlObj.searchParams.get('action');
    const streamUrlParam = urlObj.searchParams.get('stream_url');
    const targetUrl = urlObj.searchParams.get('url') || streamUrlParam;

    if (!targetUrl && !streamUrlParam) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ success: false, error: 'No URL provided' }));
      return;
    }

    // 1. STREAM PROXY FOR PREVIEW & PLAYBACK
    if (action === 'stream') {
      const streamUrl = streamUrlParam || targetUrl;
      try {
        const fetchHeaders = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': '*/*'
        };
        if (req.headers['range']) {
          fetchHeaders['Range'] = req.headers['range'];
        }

        const remoteRes = await fetch(streamUrl, { headers: fetchHeaders });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Accept-Ranges', 'bytes');

        const contentType = remoteRes.headers.get('content-type') || 'video/mp4';
        res.setHeader('Content-Type', contentType);

        const contentLength = remoteRes.headers.get('content-length');
        if (contentLength) res.setHeader('Content-Length', contentLength);

        const contentRange = remoteRes.headers.get('content-range');
        if (contentRange) {
          res.setHeader('Content-Range', contentRange);
          res.statusCode = 206;
        } else {
          res.statusCode = remoteRes.status || 200;
        }

        if (remoteRes.body) {
          Readable.fromWeb(remoteRes.body).pipe(res);
        } else {
          res.end();
        }
      } catch (streamErr) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ success: false, error: streamErr.message }));
      }
      return;
    }

    // 2. INSTANT DOWNLOAD
    if (action === 'download') {
      const type = urlObj.searchParams.get('type') || 'direct';
      const rawFilename = urlObj.searchParams.get('filename') || 'media_download';
      const cleanFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const streamUrl = streamUrlParam;
      const scriptPath = path.resolve(__dirname, 'server', 'ytdlp_helper.py');

      // 2A. Instant direct stream
      if (type === 'direct' || streamUrl) {
        const downloadSource = streamUrl || targetUrl;
        try {
          const remoteRes = await fetch(downloadSource, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': '*/*'
            }
          });

          if (!remoteRes.ok) {
            res.statusCode = remoteRes.status;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: `Upstream source returned status ${remoteRes.status}` }));
            return;
          }

          const contentType = remoteRes.headers.get('content-type') || (cleanFilename.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4');
          const contentLength = remoteRes.headers.get('content-length');

          res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${cleanFilename}"`,
            'Content-Type': contentType,
            ...(contentLength ? { 'Content-Length': contentLength } : {}),
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*'
          });

          if (remoteRes.body) {
            Readable.fromWeb(remoteRes.body).pipe(res);
          } else {
            res.end();
          }
        } catch (dlErr) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ success: false, error: dlErr.message }));
        }
        return;
      }

      // 2B. Video with merged audio (via FFmpeg)
      if (type === 'video') {
        const height = urlObj.searchParams.get('height') || '1080';
        const py = spawn(PYTHON_CMD, [scriptPath, 'download_video', targetUrl, height], { cwd: __dirname });
        let stdout = '';
        let stderr = '';

        py.on('error', (spawnErr) => {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: `Python execution error: ${spawnErr.message}` }));
          }
        });

        py.stdout.on('data', (d) => stdout += d.toString());
        py.stderr.on('data', (d) => stderr += d.toString());

        py.on('close', () => {
          const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
          let data = null;
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              data = JSON.parse(lines[i]);
              if (data && typeof data === 'object') break;
            } catch (e) {}
          }

          if (data && data.success && data.file_path && fs.existsSync(data.file_path)) {
            const stat = fs.statSync(data.file_path);
            const downloadName = cleanFilename.endsWith('.mp4') ? cleanFilename : `${cleanFilename}.mp4`;
            res.writeHead(200, {
              'Content-Type': 'video/mp4',
              'Content-Length': stat.size,
              'Content-Disposition': `attachment; filename="${downloadName}"`,
              'Access-Control-Allow-Origin': '*'
            });
            const stream = fs.createReadStream(data.file_path);
            stream.pipe(res);

            const cleanup = () => {
              try { if (fs.existsSync(data.file_path)) fs.unlinkSync(data.file_path); } catch (e) {}
            };
            res.on('finish', cleanup);
            res.on('close', cleanup);
            stream.on('error', (err) => {
              cleanup();
              if (!res.headersSent) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: data?.error || stderr || 'Failed to download and merge video' }));
          }
        });
        return;
      }

      // 2C. Audio extraction (High-Bitrate MP3)
      if (type === 'audio') {
        const abr = urlObj.searchParams.get('abr') || '192';
        const py = spawn(PYTHON_CMD, [scriptPath, 'download_audio', targetUrl, abr], { cwd: __dirname });
        let stdout = '';
        let stderr = '';

        py.on('error', (spawnErr) => {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: `Python execution error: ${spawnErr.message}` }));
          }
        });

        py.stdout.on('data', (d) => stdout += d.toString());
        py.stderr.on('data', (d) => stderr += d.toString());

        py.on('close', () => {
          const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
          let data = null;
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              data = JSON.parse(lines[i]);
              if (data && typeof data === 'object') break;
            } catch (e) {}
          }

          if (data && data.success && data.file_path && fs.existsSync(data.file_path)) {
            const stat = fs.statSync(data.file_path);
            const downloadName = cleanFilename.endsWith('.mp3') ? cleanFilename : `${cleanFilename}.mp3`;
            res.writeHead(200, {
              'Content-Type': 'audio/mpeg',
              'Content-Length': stat.size,
              'Content-Disposition': `attachment; filename="${downloadName}"`,
              'Access-Control-Allow-Origin': '*'
            });
            const stream = fs.createReadStream(data.file_path);
            stream.pipe(res);

            const cleanup = () => {
              try { if (fs.existsSync(data.file_path)) fs.unlinkSync(data.file_path); } catch (e) {}
            };
            res.on('finish', cleanup);
            res.on('close', cleanup);
            stream.on('error', (err) => {
              cleanup();
              if (!res.headersSent) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: data?.error || stderr || 'Failed to extract MP3 audio' }));
          }
        });
        return;
      }
    }

    // 3. MEDIA EXTRACTION ENGINE (yt-dlp)
    const scriptPath = path.resolve(__dirname, 'server', 'ytdlp_helper.py');
    const py = spawn(PYTHON_CMD, [scriptPath, 'extract', targetUrl], { cwd: __dirname });
    let stdout = '';
    let stderr = '';

    py.on('error', (spawnErr) => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ success: false, error: `Python execution error: ${spawnErr.message}` }));
      }
    });

    py.stdout.on('data', (d) => stdout += d.toString());
    py.stderr.on('data', (d) => stderr += d.toString());

    py.on('close', () => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
      let data = null;
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          data = JSON.parse(lines[i]);
          if (data && typeof data === 'object') break;
        } catch (e) {}
      }

      if (data) {
        res.statusCode = data.success ? 200 : 400;
        res.end(JSON.stringify(data));
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: stderr || stdout || 'Failed to extract media information' }));
      }
    });
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
}

// Text-to-Speech API Handler
function handleTts(req, res, urlObj) {
  const runTts = (text, voice, rate, pitch) => {
    const formattedRate = rate != null ? (typeof rate === 'number' ? (rate >= 0 ? `+${rate}%` : `${rate}%`) : rate) : '+0%';
    const formattedPitch = pitch != null ? (typeof pitch === 'number' ? (pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`) : pitch) : '+0Hz';
    const volume = '+0%';

    const scriptPath = path.resolve(__dirname, 'server', 'tts_helper.py');
    const py = spawn(PYTHON_CMD, [scriptPath, '--json'], { cwd: __dirname });
    let stdout = '';
    let stderr = '';

    py.on('error', (spawnErr) => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ success: false, error: `Python execution error: ${spawnErr.message}` }));
      }
    });

    py.stdin.write(JSON.stringify({
      text,
      voice,
      rate: formattedRate,
      pitch: formattedPitch,
      volume
    }));
    py.stdin.end();

    py.stdout.on('data', (d) => stdout += d.toString());
    py.stderr.on('data', (d) => stderr += d.toString());

    py.on('close', () => {
      try {
        const parsed = JSON.parse(stdout.trim());
        if (parsed.success && parsed.audio_base64) {
          const buf = Buffer.from(parsed.audio_base64, 'base64');
          res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': buf.length,
            'Access-Control-Allow-Origin': '*'
          });
          res.end(buf);
        } else {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ success: false, error: parsed.error || stderr }));
        }
      } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ success: false, error: stderr || stdout || e.message }));
      }
    });
  };

  if (req.method === 'GET') {
    const text = urlObj.searchParams.get('text') || 'Hello from BUILDBYFARAZ';
    const voice = urlObj.searchParams.get('voice') || urlObj.searchParams.get('voiceName') || urlObj.searchParams.get('voiceIndex') || 'en-US-AndrewMultilingualNeural';
    const rate = urlObj.searchParams.get('rate') || '+0%';
    const pitch = urlObj.searchParams.get('pitch') || '+0Hz';
    return runTts(text, voice, rate, pitch);
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const text = data.text || 'Hello from BUILDBYFARAZ';
        const voice = data.voice || data.voiceName || (data.voiceIndex ? String(data.voiceIndex) : 'en-US-AndrewMultilingualNeural');
        return runTts(text, voice, data.rate, data.pitch);
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
  }
}

// Main HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': '*'
    });
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // Health check endpoint for uptime bots (UptimeRobot, cron-job.org, Render, Koyeb)
  if (pathname === '/health' || pathname === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({
      status: 'ok',
      service: 'buildbyfaraz-platform',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // API Route: Video Downloader
  if (pathname.startsWith('/api/videodl')) {
    return handleVideoDl(req, res, urlObj);
  }

  // API Route: Text to Speech
  if (pathname.startsWith('/api/tts')) {
    return handleTts(req, res, urlObj);
  }

  // Proxy: AllDL fallback video extraction
  if (pathname.startsWith('/api/alldl')) {
    return proxyUpstream(req, res, 'https://ahm7xmakki.com');
  }

  // Proxy: WebSnap screenshot engine
  if (pathname.startsWith('/api/websnap')) {
    return proxyUpstream(req, res, 'https://ahm7xmakki.com');
  }

  // Proxy: Fish Audio API
  if (pathname.startsWith('/fish-api')) {
    return proxyUpstream(req, res, 'https://api.fish.audio', '/fish-api');
  }

  // Proxy: Audio proxy R2
  if (pathname.startsWith('/audio-proxy')) {
    return proxyUpstream(req, res, 'https://platform.r2.fish.audio', '/audio-proxy');
  }

  // Proxy: Fish CDN
  if (pathname.startsWith('/fish-cdn')) {
    return proxyUpstream(req, res, 'https://public-platform.r2.fish.audio', '/fish-cdn');
  }

  // Unhandled API routes return JSON 404
  if (pathname.startsWith('/api/')) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ success: false, error: 'API endpoint not found' }));
    return;
  }

  // Static files & SPA Fallback (Safe directory traversal prevention)
  const resolvedPath = path.resolve(DIST_DIR, '.' + path.normalize(pathname));
  if (!resolvedPath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('403 Forbidden');
    return;
  }

  let filePath = resolvedPath;

  // If path points to an existing directory, check if it has index.html (e.g., /typingfast/)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const dirIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
      filePath = dirIndex;
    }
  }

  // If file exists and is a file, serve it directly
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // If request has a file extension (e.g. missing .js, .css, .png, .wasm), return 404 Not Found
  if (path.extname(pathname)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('404 Not Found');
    return;
  }

  // SPA navigation fallback to dist/index.html
  const rootIndex = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(rootIndex) && fs.statSync(rootIndex).isFile()) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(rootIndex).pipe(res);
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`\n========================================`);
  console.log(`🚀 BUILDBYFARAZ Production Server Online`);
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log(`🐍 Python Engine: ${PYTHON_CMD}`);
  console.log(`📁 Static Assets: ${DIST_DIR}`);
  console.log(`========================================\n`);
});

// Graceful shutdown on container stop signals
function gracefulShutdown(signal) {
  console.log(`\n🛑 ${signal} received. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed cleanly. Exiting.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced exit after 5s timeout.');
    process.exit(1);
  }, 5000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

