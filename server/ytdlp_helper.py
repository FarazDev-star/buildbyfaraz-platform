import sys
import os
import json
import uuid
import yt_dlp

import shutil

try:
    import imageio_ffmpeg
    FFMPEG_PATH = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FFMPEG_PATH = None

# If imageio_ffmpeg is not available or path does not exist, fallback to system ffmpeg binary
if not FFMPEG_PATH or not os.path.exists(FFMPEG_PATH):
    FFMPEG_PATH = shutil.which("ffmpeg")

def format_duration(seconds):
    if not seconds:
        return "N/A"
    seconds = int(seconds)
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"

def format_filesize(bytes_val):
    if not bytes_val:
        return "~"
    mb = bytes_val / (1024 * 1024)
    if mb >= 1000:
        return f"{mb / 1024:.2f} GB"
    return f"{mb:.1f} MB"

import urllib.request
import urllib.parse
import re

def resolve_redirects(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            return resp.geturl()
    except Exception:
        return url

def sniff_webpage_videos(page_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
    try:
        req = urllib.request.Request(page_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            final_url = resp.geturl()
    except Exception:
        return None

    # Title & Image
    title_m = re.search(r'<meta\s+(?:property|name)=["\'](?:og:title|twitter:title)["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    title = title_m.group(1) if title_m else None
    if not title:
        t_m = re.search(r'<title>([^<]+)</title>', html, re.I)
        title = t_m.group(1).strip() if t_m else "Webpage Video"

    img_m = re.search(r'<meta\s+(?:property|name)=["\'](?:og:image|twitter:image)["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    thumb = img_m.group(1) if img_m else None

    # Candidates list
    candidates = []
    # 1. OpenGraph video
    candidates.extend(re.findall(r'<meta\s+(?:property|name)=["\'](?:og:video|og:video:secure_url|og:video:url)["\']\s+content=["\']([^"\']+)["\']', html, re.I))
    # 2. Twitter stream
    candidates.extend(re.findall(r'<meta\s+(?:property|name)=["\'](?:twitter:player:stream|twitter:player)["\']\s+content=["\']([^"\']+)["\']', html, re.I))
    # 3. HTML5 video & source
    candidates.extend(re.findall(r'<(?:video|source)\s+[^>]*src=["\']([^"\']+\.(?:mp4|webm|m3u8|mov)[^"\']*)["\']', html, re.I))
    # 4. JSON-LD VideoObject
    for j_str in re.findall(r'<script\s+type=["\']application/ld\+json["\']>([^<]+)</script>', html, re.I):
        try:
            p = json.loads(j_str.strip())
            items = p if isinstance(p, list) else [p]
            for item in items:
                if item.get('@type') == 'VideoObject':
                    if item.get('contentUrl'): candidates.append(item.get('contentUrl'))
                    if item.get('embedUrl'): candidates.append(item.get('embedUrl'))
        except:
            pass
    # 5. Embedded iframes (YouTube, Vimeo, Dailymotion, TikTok, etc.)
    for src in re.findall(r'<iframe\s+[^>]*src=["\']([^"\']+)["\']', html, re.I):
        if any(d in src.lower() for d in ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'tiktok.com', 'streamable.com']):
            candidates.append(src)
    # 6. Direct .mp4 URLs in inline scripts
    candidates.extend(re.findall(r'(https?://[^\s"\'<>]+\.mp4(?:\?[^\s"\'<>]*)?)', html))

    # Clean and resolve
    cleaned = []
    seen = set()
    for c in candidates:
        c = c.replace('&amp;', '&').strip()
        if not c.startswith('http'):
            c = urllib.parse.urljoin(final_url, c)
        if c.startswith('http') and c not in seen:
            seen.add(c)
            cleaned.append(c)

    if not cleaned:
        return None

    return {
        'title': title,
        'thumbnail': thumb,
        'candidates': cleaned,
        'final_url': final_url
    }

def format_ytdlp_info(info, current_url, original_url):
    video_id = info.get('id')
    title = info.get('title', 'Video Download')
    uploader = info.get('uploader') or info.get('channel') or info.get('creator') or 'Creator'
    duration_sec = info.get('duration') or 0
    duration_str = format_duration(duration_sec)
    extractor = info.get('extractor_key') or info.get('extractor') or 'Universal'
    thumbnail = info.get('thumbnail')
    
    # Build thumbnails list
    thumbnails = []
    raw_thumbs = info.get('thumbnails', [])
    if raw_thumbs:
        sorted_thumbs = sorted(raw_thumbs, key=lambda t: t.get('width', 0) or 0, reverse=True)
        seen_urls = set()
        for t in sorted_thumbs:
            u = t.get('url')
            if u and u not in seen_urls:
                seen_urls.add(u)
                label = f"{t.get('width')}x{t.get('height')}" if t.get('width') else "High Quality"
                thumbnails.append({
                    'label': label,
                    'url': u,
                    'resolution': f"{t.get('width', 1280)}x{t.get('height', 720)}"
                })
    if not thumbnails and thumbnail:
        thumbnails.append({'label': 'HD Default', 'url': thumbnail, 'resolution': 'HD'})

    raw_formats = info.get('formats', [])
    
    # Determine average audio track size to compute accurate merged size
    best_audio_size = 0
    audio_streams = [f for f in raw_formats if f.get('acodec') != 'none' and f.get('vcodec') == 'none']
    if audio_streams:
        best_audio = audio_streams[-1]
        best_audio_size = best_audio.get('filesize') or best_audio.get('filesize_approx') or 0
    if not best_audio_size and duration_sec:
        best_audio_size = int(duration_sec * 128 * 1000 / 8) # ~128kbps

    # Progressive streams (contains both video and audio in a single stream)
    progressive = [f for f in raw_formats if f.get('vcodec') != 'none' and f.get('acodec') != 'none' and f.get('url')]

    # Collect all valid video streams
    video_formats = []
    seen_heights = set()
    
    # Standard resolution labels
    height_names = {
        2160: '4K Ultra HD',
        1440: '2K Quad HD',
        1080: '1080p Full HD',
        720: '720p HD',
        480: '480p SD',
        360: '360p Standard',
        240: '240p Low',
        144: '144p Eco'
    }

    # Filter formats that contain video
    video_candidates = [f for f in raw_formats if f.get('vcodec') != 'none']
    
    # Sort by height descending and bitrate
    video_candidates.sort(key=lambda f: (f.get('height') or 0, f.get('tbr') or 0), reverse=True)

    for f in video_candidates:
        h = f.get('height')
        if not h and 'resolution' in f:
            res_str = str(f.get('resolution'))
            if 'x' in res_str:
                try:
                    h = int(res_str.split('x')[1])
                except:
                    pass
        if not h:
            continue

        # Standardize height bucket (e.g. 1080, 720, etc.)
        bucket = h
        for standard_h in sorted(height_names.keys(), reverse=True):
            if abs(h - standard_h) <= 20:
                bucket = standard_h
                break

        if bucket in seen_heights:
            continue
        seen_heights.add(bucket)

        vid_size = f.get('filesize') or f.get('filesize_approx') or 0
        has_native_audio = f.get('acodec') != 'none'
        # If video has no audio track, our backend merges audio, so combined size = vid + audio
        if not has_native_audio and vid_size:
            combined_size = vid_size + best_audio_size
        else:
            combined_size = vid_size or (int(duration_sec * (f.get('tbr') or 1500) * 1000 / 8) if duration_sec else 0)

        name = height_names.get(bucket, f"{bucket}p")
        direct_stream_url = f.get('url') if (has_native_audio and f.get('url')) else None

        video_formats.append({
            'quality': f"{bucket}p",
            'height': bucket,
            'ext': 'mp4',
            'filesize': format_filesize(combined_size),
            'url': f.get('url') or current_url,
            'direct_url': direct_stream_url,
            'requires_merge': not has_native_audio,
            'has_audio': True,
            'fps': f.get('fps'),
            'label': f"{name} • {'Direct Instant Stream' if has_native_audio else 'Full Audio & Video Merged'}"
        })

    # Sort descending by height
    video_formats.sort(key=lambda x: x['height'], reverse=True)

    # Audio formats (High-bitrate MP3)
    audio_formats = []
    standard_abrs = [
        (320, '320 kbps (Ultra-HD Studio MP3)'),
        (256, '256 kbps (High Quality MP3)'),
        (192, '192 kbps (Standard Audio MP3)'),
        (128, '128 kbps (Compact Audio MP3)')
    ]

    for abr_val, abr_label in standard_abrs:
        est_audio_size = int(duration_sec * abr_val * 1000 / 8) if duration_sec else 0
        audio_formats.append({
            'quality': abr_label,
            'abr': abr_val,
            'ext': 'mp3',
            'filesize': format_filesize(est_audio_size) if est_audio_size else "High Bitrate",
            'url': current_url
        })

    # Best playable preview stream with both video and audio
    preview_stream = None
    if progressive:
        mid_p = [p for p in progressive if (p.get('height') or 0) <= 720]
        preview_stream = (mid_p[-1] if mid_p else progressive[0]).get('url')
    elif video_candidates:
        # Pick a suitable video candidate
        preview_stream = video_candidates[0].get('url')

    # Generate embed URL for YouTube videos
    embed_url = None
    is_youtube = ('youtube' in extractor.lower() or 'youtube' in current_url.lower() or 'youtu.be' in current_url.lower())
    if is_youtube and video_id:
        embed_url = f"https://www.youtube-nocookie.com/embed/{video_id}?autoplay=1"

    return {
        'success': True,
        'title': title,
        'author': uploader,
        'platform': extractor,
        'video_id': video_id,
        'duration': duration_str,
        'duration_sec': duration_sec,
        'thumbnail': thumbnail or (thumbnails[0]['url'] if thumbnails else None),
        'thumbnails': thumbnails,
        'preview_stream': preview_stream,
        'embed_url': embed_url,
        'video_formats': video_formats,
        'audio_formats': audio_formats,
        'original_url': original_url
    }

def extract(url):
    resolved_url = resolve_redirects(url)

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'noprogress': True,
        'skip_download': True,
        'extract_flat': False,
        'noplaylist': True,
        'js_runtimes': {'node': {}}
    }
    if FFMPEG_PATH:
        ydl_opts['ffmpeg_location'] = FFMPEG_PATH

    # 1. Attempt standard yt-dlp extraction on resolved URL
    res = None
    ytdl_err_msg = None
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(resolved_url, download=False)
            res = format_ytdlp_info(info, resolved_url, url)
    except Exception as ytdl_err:
        ytdl_err_msg = str(ytdl_err)

    # If yt-dlp succeeded AND found video formats, return it!
    if res and res.get('video_formats') and len(res['video_formats']) > 0:
        return res

    # 2. If standard extractor failed OR found 0 video streams, run Universal Smart Webpage Sniffer!
    sniffed = sniff_webpage_videos(resolved_url)
    if sniffed and sniffed.get('candidates'):
        # Check each candidate
        for candidate in sniffed['candidates']:
            # If candidate is a video platform embed, try yt-dlp on it
            if any(p in candidate.lower() for p in ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'tiktok.com', 'twitter.com', 'x.com']):
                try:
                    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                        sub_info = ydl.extract_info(candidate, download=False)
                        sub_res = format_ytdlp_info(sub_info, candidate, url)
                        if sub_res and sub_res.get('video_formats') and len(sub_res['video_formats']) > 0:
                            if not sub_res.get('title') or sub_res['title'] == 'Video Download':
                                sub_res['title'] = sniffed['title']
                            if not sub_res.get('thumbnail') and sniffed.get('thumbnail'):
                                sub_res['thumbnail'] = sniffed['thumbnail']
                            return sub_res
                except Exception:
                    pass

            # If candidate is a direct stream (.mp4, .webm, .m3u8, .mov)
            if any(ext in candidate.lower() for ext in ['.mp4', '.webm', '.m3u8', '.mov']):
                filesize = 0
                try:
                    head_req = urllib.request.Request(candidate, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
                    with urllib.request.urlopen(head_req, timeout=5) as head_resp:
                        cl = head_resp.headers.get('content-length')
                        if cl and cl.isdigit():
                            filesize = int(cl)
                except Exception:
                    pass

                page_thumb = sniffed.get('thumbnail')
                return {
                    'success': True,
                    'title': sniffed.get('title') or 'Webpage Video Stream',
                    'author': 'Web Creator',
                    'platform': 'Webpage Sniffer',
                    'duration': 'HD',
                    'duration_sec': 0,
                    'thumbnail': page_thumb,
                    'thumbnails': [{'label': 'Page Cover', 'url': page_thumb, 'resolution': 'HD', 'direct_url': page_thumb}] if page_thumb else [],
                    'preview_stream': candidate,
                    'video_formats': [{
                        'quality': 'HD Video',
                        'height': 720,
                        'ext': 'mp4',
                        'filesize': format_filesize(filesize),
                        'url': candidate,
                        'direct_url': candidate,
                        'has_audio': True,
                        'requires_merge': False,
                        'label': 'HD Video • Direct Web Stream'
                    }],
                    'audio_formats': [{
                        'quality': '192 kbps (Standard Audio MP3)',
                        'abr': 192,
                        'ext': 'mp3',
                        'filesize': '~',
                        'url': candidate
                    }],
                    'original_url': url
                }

    # If nothing could be extracted, raise error
    raise Exception(ytdl_err_msg or 'Could not find or extract any video stream from this webpage.')

def download_video(url, height=1080, output_dir=None):
    if not output_dir:
        output_dir = os.path.abspath('.temp_downloads')
    os.makedirs(output_dir, exist_ok=True)

    uid = uuid.uuid4().hex[:8]
    out_template = os.path.join(output_dir, f"vid_{uid}_%(id)s.%(ext)s")

    format_spec = f"bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<={height}]+bestaudio/best[height<={height}]/best"

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'noprogress': True,
        'format': format_spec,
        'merge_output_format': 'mp4',
        'outtmpl': out_template,
        'noplaylist': True,
        'js_runtimes': {'node': {}}
    }
    if FFMPEG_PATH:
        ydl_opts['ffmpeg_location'] = FFMPEG_PATH

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        raw_out = ydl.prepare_filename(info)
        # yt-dlp replaces extension when merged
        base, _ = os.path.splitext(raw_out)
        final_mp4 = base + '.mp4'
        if not os.path.exists(final_mp4) and os.path.exists(raw_out):
            final_mp4 = raw_out

        if not os.path.exists(final_mp4):
            # Scan directory for matching file
            for f in os.listdir(output_dir):
                if f.startswith(f"vid_{uid}_"):
                    final_mp4 = os.path.join(output_dir, f)
                    break

        filesize = os.path.getsize(final_mp4) if os.path.exists(final_mp4) else 0

        return {
            'success': True,
            'file_path': os.path.abspath(final_mp4),
            'filename': f"{info.get('title', 'video')}_{height}p.mp4",
            'filesize': filesize,
            'title': info.get('title', 'video')
        }

def download_audio(url, abr=192, output_dir=None):
    if not output_dir:
        output_dir = os.path.abspath('.temp_downloads')
    os.makedirs(output_dir, exist_ok=True)

    uid = uuid.uuid4().hex[:8]
    out_template = os.path.join(output_dir, f"aud_{uid}_%(id)s.%(ext)s")

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'noprogress': True,
        'format': 'bestaudio/best',
        'outtmpl': out_template,
        'noplaylist': True,
        'js_runtimes': {'node': {}},
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': str(abr),
        }]
    }
    if FFMPEG_PATH:
        ydl_opts['ffmpeg_location'] = FFMPEG_PATH

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        raw_out = ydl.prepare_filename(info)
        base, _ = os.path.splitext(raw_out)
        final_mp3 = base + '.mp3'

        if not os.path.exists(final_mp3):
            for f in os.listdir(output_dir):
                if f.startswith(f"aud_{uid}_") and f.endswith('.mp3'):
                    final_mp3 = os.path.join(output_dir, f)
                    break

        filesize = os.path.getsize(final_mp3) if os.path.exists(final_mp3) else 0

        return {
            'success': True,
            'file_path': os.path.abspath(final_mp3),
            'filename': f"{info.get('title', 'audio')}_{abr}kbps.mp3",
            'filesize': filesize,
            'title': info.get('title', 'audio')
        }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No arguments provided'}))
        sys.exit(1)

    cmd = sys.argv[1]

    # Handle subcommands: extract, download_video, download_audio
    # If first argument is a URL, default to extract
    if cmd in ('extract', 'download_video', 'download_audio'):
        url = sys.argv[2] if len(sys.argv) > 2 else None
        if not url:
            print(json.dumps({'success': False, 'error': 'No URL specified'}))
            sys.exit(1)

        try:
            if cmd == 'extract':
                data = extract(url)
                print(json.dumps(data))
            elif cmd == 'download_video':
                height = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 1080
                output_dir = sys.argv[4] if len(sys.argv) > 4 else None
                res = download_video(url, height=height, output_dir=output_dir)
                print(json.dumps(res))
            elif cmd == 'download_audio':
                abr = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 192
                output_dir = sys.argv[4] if len(sys.argv) > 4 else None
                res = download_audio(url, abr=abr, output_dir=output_dir)
                print(json.dumps(res))
        except Exception as e:
            print(json.dumps({'success': False, 'error': str(e)}))
    else:
        # Default backward compatible behavior: sys.argv[1] is url
        url = cmd
        try:
            data = extract(url)
            print(json.dumps(data))
        except Exception as e:
            print(json.dumps({'success': False, 'error': str(e)}))
