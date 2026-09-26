import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

function videoDownloaderPlugin() {
  return {
    name: 'video-downloader-plugin',
    configureServer(server) {
      server.middlewares.use('/api/videodl', async (req, res, next) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const action = urlObj.searchParams.get('action');
          const targetUrl = urlObj.searchParams.get('url');

          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: 'No URL provided' }));
            return;
          }

          // 1. STREAM PROXY FOR PREVIEW & PLAYBACK (Full Range support, CORS bypass, zero referrer blockage)
          if (action === 'stream') {
            const streamUrl = urlObj.searchParams.get('stream_url') || targetUrl;
            try {
              const fetchHeaders = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': '*/*'
              };
              if (req.headers['range']) {
                fetchHeaders['Range'] = req.headers['range'];
              }

              const remoteRes = await fetch(streamUrl, {
                headers: fetchHeaders
              });

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

          // 2. INSTANT DOWNLOAD (Direct Remote Stream, Video with Merged Audio, or Audio MP3)
          if (action === 'download') {
            const type = urlObj.searchParams.get('type') || 'direct';
            const rawFilename = urlObj.searchParams.get('filename') || 'media_download';
            const cleanFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
            const streamUrl = urlObj.searchParams.get('stream_url');
            const scriptPath = path.resolve('server/ytdlp_helper.py');

            // 2A. INSTANT DIRECT STREAMING (For TikTok, Instagram, Facebook, Twitter, Pinterest, & Progressive Streams)
            // Immediately starts Chrome download bar with speed, progress %, and ETA without waiting for server disk buffer!
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

            // 2B. VIDEO DOWNLOAD WITH MERGED AUDIO (When separate high-res video + audio streams require FFmpeg)
            if (type === 'video') {
              const height = urlObj.searchParams.get('height') || '1080';
              const py = spawn('python', [scriptPath, 'download_video', targetUrl, height]);
              let stdout = '';
              let stderr = '';

              py.stdout.on('data', (d) => stdout += d.toString());
              py.stderr.on('data', (d) => stderr += d.toString());

              py.on('close', (code) => {
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
                    try {
                      if (fs.existsSync(data.file_path)) {
                        fs.unlinkSync(data.file_path);
                      }
                    } catch (err) {}
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
                  res.end(JSON.stringify({ success: false, error: data?.error || stderr || 'Failed to download and merge video with audio' }));
                }
              });
              return;
            }

            // 2C. AUDIO DOWNLOAD (High-Bitrate MP3 with FFmpeg)
            if (type === 'audio') {
              const abr = urlObj.searchParams.get('abr') || '192';
              const py = spawn('python', [scriptPath, 'download_audio', targetUrl, abr]);
              let stdout = '';
              let stderr = '';

              py.stdout.on('data', (d) => stdout += d.toString());
              py.stderr.on('data', (d) => stderr += d.toString());

              py.on('close', (code) => {
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
                    try {
                      if (fs.existsSync(data.file_path)) {
                        fs.unlinkSync(data.file_path);
                      }
                    } catch (err) {}
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
          const scriptPath = path.resolve('server/ytdlp_helper.py');
          const py = spawn('python', [scriptPath, 'extract', targetUrl]);
          let stdout = '';
          let stderr = '';

          py.stdout.on('data', (d) => stdout += d.toString());
          py.stderr.on('data', (d) => stderr += d.toString());

          py.on('close', (code) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
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
      });
    }
  };
}

function ttsPlugin() {
  return {
    name: 'tts-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', (req, res, next) => {
        const handleTtsRequest = (text, voice, rate, pitch) => {
          const formattedRate = rate != null ? (typeof rate === 'number' ? (rate >= 0 ? `+${rate}%` : `${rate}%`) : rate) : '+0%';
          const formattedPitch = pitch != null ? (typeof pitch === 'number' ? (pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`) : pitch) : '+0Hz';
          const volume = '+0%';

          const scriptPath = path.resolve('server/tts_helper.py');
          const py = spawn('python', [scriptPath, text, voice, formattedRate, formattedPitch, volume]);
          let stdout = '';
          let stderr = '';

          py.stdout.on('data', d => stdout += d.toString());
          py.stderr.on('data', d => stderr += d.toString());

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
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: parsed.error || stderr }));
              }
            } catch (e) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: stderr || stdout || e.message }));
            }
          });
        };

        if (req.method === 'GET') {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const text = urlObj.searchParams.get('text') || 'Hello from BUILDBYFARAZ';
          const voice = urlObj.searchParams.get('voice') || urlObj.searchParams.get('voiceName') || urlObj.searchParams.get('voiceIndex') || 'en-US-AndrewMultilingualNeural';
          const rate = urlObj.searchParams.get('rate') || '+0%';
          const pitch = urlObj.searchParams.get('pitch') || '+0Hz';
          return handleTtsRequest(text, voice, rate, pitch);
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const text = data.text || 'Hello from BUILDBYFARAZ';
              const voice = data.voice || data.voiceName || (data.voiceIndex ? String(data.voiceIndex) : 'en-US-AndrewMultilingualNeural');
              return handleTtsRequest(text, voice, data.rate, data.pitch);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), videoDownloaderPlugin(), ttsPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    proxy: {
      '/api/websnap': {
        target: 'https://ahm7xmakki.com',
        changeOrigin: true,
        secure: false,
      },
      '/fish-api': {
        target: 'https://api.fish.audio',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/fish-api/, '')
      },
      '/audio-proxy': {
        target: 'https://platform.r2.fish.audio',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/audio-proxy/, '')
      },
      '/fish-cdn': {
        target: 'https://public-platform.r2.fish.audio',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/fish-cdn/, '')
      }
    }
  }
});
