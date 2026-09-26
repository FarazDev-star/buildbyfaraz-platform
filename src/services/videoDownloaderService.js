// Video Downloader Service for BUILDBYFARAZ Platform
// Universal multi-tier extraction engine:
// Tier 1: Local /api/videodl (High-speed Python yt-dlp backend with 1080p/720p/audio/thumbs)
// Tier 2: Dedicated TikWM API for TikTok (100% Watermark-Free HD stream + MP3 music)
// Tier 3: Upstream /api/alldl proxy (ahm7xmakki.com fallback for social videos)

export const SUPPORTED_PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: 'youtube', badge: '1080p + MP3', domain: 'youtube.com, youtu.be' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', badge: 'No Watermark HD', domain: 'tiktok.com' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', badge: 'Reels & Stories', domain: 'instagram.com' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', badge: 'Reels & HD MP4', domain: 'facebook.com, fb.watch' },
  { id: 'twitter', name: 'Twitter / X', icon: 'twitter', badge: 'Original Bitrate', domain: 'twitter.com, x.com' },
  { id: 'reddit', name: 'Reddit', icon: 'reddit', badge: 'With Audio', domain: 'reddit.com' },
  { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', badge: 'HD MP4', domain: 'pinterest.com' },
  { id: 'vimeo', name: 'Vimeo', icon: 'vimeo', badge: 'Ultra HD', domain: 'vimeo.com' },
  { id: 'dailymotion', name: 'Dailymotion', icon: 'tv', badge: '1080p Stream', domain: 'dailymotion.com' },
  { id: 'twitch', name: 'Twitch', icon: 'tv', badge: 'Clips & VODs', domain: 'twitch.tv' },
  { id: 'sniffer', name: 'Webpage Sniffer', icon: 'globe', badge: 'Auto-Detect Video', domain: 'Any Website / Blog' }
];

export function detectPlatform(url) {
  if (!url) return 'Universal';
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube';
  if (lower.includes('tiktok.com')) return 'TikTok';
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'Instagram';
  if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com')) return 'Facebook';
  if (lower.includes('twitter.com') || lower.includes('x.com') || lower.includes('t.co')) return 'Twitter / X';
  if (lower.includes('reddit.com') || lower.includes('redd.it')) return 'Reddit';
  if (lower.includes('pinterest.com') || lower.includes('pin.it')) return 'Pinterest';
  if (lower.includes('vimeo.com')) return 'Vimeo';
  if (lower.includes('dailymotion.com') || lower.includes('dai.ly')) return 'Dailymotion';
  if (lower.includes('twitch.tv')) return 'Twitch';
  if (lower.includes('threads.net')) return 'Threads';
  if (lower.includes('bilibili.com')) return 'Bilibili';
  if (lower.includes('soundcloud.com')) return 'SoundCloud';
  return 'Webpage Video Sniffer';
}

// Fallback: TikWM API for instant watermark-free TikTok
async function fetchTikwm(url) {
  try {
    const res = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ url, hd: '1' })
    });
    const data = await res.json();
    if (data && data.code === 0 && data.data) {
      const d = data.data;
      const videoFormats = [];

      // 1. Universal H.264 720p HD stream (Plays seamlessly in all browsers with audio & video)
      if (d.play) {
        const playUrl = d.play.startsWith('http') ? d.play : `https://www.tikwm.com${d.play}`;
        videoFormats.push({
          quality: '720p HD (Universal MP4)',
          height: 720,
          ext: 'mp4',
          filesize: '~',
          url: playUrl,
          direct_url: playUrl,
          has_audio: true,
          requires_merge: false,
          label: '720p HD • Universal Fast Stream (H.264)'
        });
      }

      // 2. 1080p Ultra HD stream (Clean No Watermark)
      if (d.hdplay) {
        const hdUrl = d.hdplay.startsWith('http') ? d.hdplay : `https://www.tikwm.com${d.hdplay}`;
        videoFormats.push({
          quality: '1080p Ultra HD (No Watermark)',
          height: 1080,
          ext: 'mp4',
          filesize: '~',
          url: hdUrl,
          direct_url: hdUrl,
          has_audio: true,
          requires_merge: false,
          label: '1080p Ultra HD • Clean No Watermark'
        });
      }

      // 3. Original with Watermark
      if (d.wmplay) {
        const wmUrl = d.wmplay.startsWith('http') ? d.wmplay : `https://www.tikwm.com${d.wmplay}`;
        videoFormats.push({
          quality: 'Original with Watermark',
          height: 720,
          ext: 'mp4',
          filesize: '~',
          url: wmUrl,
          direct_url: wmUrl,
          has_audio: true,
          requires_merge: false,
          label: 'Original Stream'
        });
      }

      const audioFormats = [];
      if (d.music) {
        const musicUrl = d.music.startsWith('http') ? d.music : `https://www.tikwm.com${d.music}`;
        audioFormats.push({
          quality: 'Original BGM Sound (MP3)',
          abr: 192,
          ext: 'mp3',
          filesize: '~',
          url: musicUrl,
          direct_url: musicUrl
        });
      }

      const thumbnails = [];
      if (d.cover) {
        const coverUrl = d.cover.startsWith('http') ? d.cover : `https://www.tikwm.com${d.cover}`;
        thumbnails.push({ label: 'HD Cover Art', url: coverUrl, resolution: 'HD', direct_url: coverUrl });
      }

      // Ensure preview_stream uses H.264 (d.play) so Chrome never renders an audio-only box!
      const previewUrl = d.play
        ? (d.play.startsWith('http') ? d.play : `https://www.tikwm.com${d.play}`)
        : videoFormats[0]?.url;

      return {
        success: true,
        title: d.title || 'TikTok Video (No Watermark)',
        author: d.author?.nickname || d.author?.unique_id || 'TikTok Creator',
        platform: 'TikTok',
        duration: `${d.duration || 15}s`,
        duration_sec: d.duration,
        thumbnail: d.cover ? (d.cover.startsWith('http') ? d.cover : `https://www.tikwm.com${d.cover}`) : null,
        thumbnails,
        preview_stream: previewUrl,
        video_formats: videoFormats,
        audio_formats: audioFormats,
        original_url: url
      };
    }
  } catch (err) {
    console.warn('TikWM fallback error:', err);
  }
  return null;
}

// Fallback: Upstream AllDL API (/api/alldl)
async function fetchAllDlProxy(url) {
  try {
    const res = await fetch(`/api/alldl?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.success && data.mediaInfo) {
      const info = data.mediaInfo;
      const videoFormats = [];
      if (info.videoUrl) {
        videoFormats.push({
          quality: 'Original HD Video',
          height: 720,
          ext: 'mp4',
          filesize: '~',
          url: info.videoUrl,
          direct_url: info.videoUrl,
          has_audio: true,
          requires_merge: false,
          label: 'HD Video'
        });
      }
      if (info.qualities && Array.isArray(info.qualities)) {
        info.qualities.forEach(q => {
          if (q.url && q.quality) {
            videoFormats.push({
              quality: q.quality,
              height: parseInt(q.quality) || 720,
              ext: 'mp4',
              filesize: '~',
              url: q.url,
              direct_url: q.url,
              has_audio: true,
              requires_merge: false,
              label: q.quality
            });
          }
        });
      }

      const audioFormats = [];
      const audioUrl = info.audioUrl || info.downloadMp3 || info.musicUrl;
      if (audioUrl) {
        audioFormats.push({
          quality: 'High Quality MP3',
          abr: 192,
          ext: 'mp3',
          filesize: '~',
          url: audioUrl,
          direct_url: audioUrl
        });
      }

      const thumbnails = [];
      const thumb = info.thumbnail || info.coverImage;
      if (thumb) {
        thumbnails.push({ label: 'Video Thumbnail', url: thumb, resolution: 'Standard', direct_url: thumb });
      }

      return {
        success: true,
        title: info.title || `${info.platform || 'Social'} Video`,
        author: 'Creator',
        platform: info.platform || detectPlatform(url),
        duration: 'HD',
        thumbnail: thumb,
        thumbnails,
        preview_stream: info.videoUrl,
        video_formats: videoFormats,
        audio_formats: audioFormats,
        original_url: url
      };
    }
  } catch (err) {
    console.warn('AllDL proxy fallback error:', err);
  }
  return null;
}

export function extractYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

// Universal Video Extractor
export async function extractVideoInfo(url) {
  if (!url || !url.trim()) {
    throw new Error('Please enter or paste a valid video URL.');
  }

  const cleanUrl = url.trim();
  const platform = detectPlatform(cleanUrl);

  // 1. If TikTok, first check dedicated TikWM API for instant watermark-free extraction
  if (platform === 'TikTok') {
    const tikResult = await fetchTikwm(cleanUrl);
    if (tikResult && tikResult.success) return tikResult;
  }

  // 2. Primary High-Speed Extraction via local /api/videodl (powered by yt-dlp)
  try {
    const res = await fetch(`/api/videodl?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        // If YouTube and embed_url is not set yet, attach it
        if (!data.embed_url && (platform === 'YouTube' || data.platform === 'YouTube')) {
          const ytId = data.video_id || extractYoutubeId(cleanUrl);
          if (ytId) {
            data.embed_url = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`;
          }
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Local /api/videodl extraction error, trying fallback tiers:', err);
  }

  // 3. Fallback Tier: Upstream /api/alldl
  const alldlResult = await fetchAllDlProxy(cleanUrl);
  if (alldlResult && alldlResult.success) {
    if (platform === 'YouTube') {
      const ytId = extractYoutubeId(cleanUrl);
      if (ytId) {
        alldlResult.embed_url = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`;
      }
    }
    return alldlResult;
  }

  // 4. If platform is TikTok, try TikWM again as final attempt
  if (platform === 'TikTok') {
    const finalTik = await fetchTikwm(cleanUrl);
    if (finalTik && finalTik.success) return finalTik;
  }

  throw new Error('Could not extract video streams from this URL. Please verify that the video is public and the link is active.');
}

// Local History Management
export function getRecentDownloads() {
  try {
    const saved = localStorage.getItem('bbf_videodl_history');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveRecentDownload(item) {
  try {
    const current = getRecentDownloads();
    const filtered = current.filter(x => x.url !== item.url);
    const updated = [item, ...filtered].slice(0, 20);
    localStorage.setItem('bbf_videodl_history', JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
