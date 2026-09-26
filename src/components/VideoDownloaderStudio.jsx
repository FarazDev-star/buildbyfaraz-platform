import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  Sparkles, 
  Film, 
  Music, 
  Image as ImageIcon, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  Trash2, 
  Clock, 
  Eye, 
  ArrowRight,
  Tv,
  Smartphone,
  Layers,
  Zap,
  Globe,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  extractVideoInfo, 
  detectPlatform, 
  SUPPORTED_PLATFORMS, 
  getRecentDownloads, 
  saveRecentDownload 
} from '../services/videoDownloaderService';

export default function VideoDownloaderStudio({ currentUser, onLogActivity }) {
  const [inputUrl, setInputUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'audio' | 'thumbnails'
  const [recentDownloads, setRecentDownloads] = useState(getRecentDownloads());
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [downloadToast, setDownloadToast] = useState(null);
  const videoPreviewRef = useRef(null);

  // Auto-detect platform icon as user types or pastes
  const detectedPlatform = detectPlatform(inputUrl);

  // Quick paste from clipboard
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text.trim());
          setErrorMessage('');
        }
      }
    } catch (e) {
      console.warn('Clipboard read error:', e);
    }
  };

  // Extract Video Action
  const handleExtract = async (e) => {
    if (e) e.preventDefault();
    const url = inputUrl.trim();
    if (!url) {
      setErrorMessage('Please enter a valid video URL from YouTube, TikTok, Instagram, etc.');
      return;
    }

    setIsExtracting(true);
    setErrorMessage('');
    setMediaData(null);

    try {
      const data = await extractVideoInfo(url);
      setMediaData(data);
      setActiveTab('video');

      // Save to recent
      const updated = saveRecentDownload({
        url,
        title: data.title,
        platform: data.platform,
        thumbnail: data.thumbnail,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setRecentDownloads(updated);

      // Log platform activity
      if (onLogActivity) {
        onLogActivity({
          user: currentUser?.name || 'User',
          role: currentUser?.role || 'user',
          action: 'Extracted Video Streams',
          target: `${data.platform} — ${data.title.slice(0, 40)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString()
        });
      }

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract video streams. Please check the URL.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Copy Stream Link
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1800);
  };

  // Trigger Instant Direct Download (Starts immediately in Chrome with speed, ETA, and progress bar)
  const handleTriggerDownload = (options, legacyTitle) => {
    // Support both options object and legacy (url, title) signature
    const opts = typeof options === 'object' && options !== null
      ? options
      : { type: 'video', url: options, title: legacyTitle };

    const { type = 'video', url, streamUrl, height, abr, title } = opts;
    const targetUrl = url || mediaData?.original_url;
    if (!targetUrl && !streamUrl) return;

    const baseTitle = (title || mediaData?.title || 'media_download')
      .replace(/[/\\?%*:|"<>]/g, '_')
      .trim();

    let ext = 'mp4';
    if (type === 'audio') ext = 'mp3';
    else if (type === 'direct' && baseTitle.toLowerCase().endsWith('.jpg')) ext = 'jpg';
    else if (type === 'direct' && baseTitle.toLowerCase().endsWith('.png')) ext = 'png';
    else if (type === 'direct' && baseTitle.toLowerCase().endsWith('.webp')) ext = 'webp';

    const cleanFilename = baseTitle.toLowerCase().endsWith(`.${ext}`) ? baseTitle : `${baseTitle}.${ext}`;

    // Select appropriate download action
    let proxyDownloadUrl = `/api/videodl?action=download&filename=${encodeURIComponent(cleanFilename)}`;

    if (streamUrl) {
      // Instant direct stream: Chrome will immediately show the file downloading with real-time speed & progress
      proxyDownloadUrl += `&type=direct&stream_url=${encodeURIComponent(streamUrl)}`;
      setDownloadToast(`🚀 Starting instant download: ${cleanFilename}`);
    } else if (type === 'video') {
      proxyDownloadUrl += `&type=video&url=${encodeURIComponent(targetUrl)}`;
      if (height) proxyDownloadUrl += `&height=${encodeURIComponent(height)}`;
      setDownloadToast(`⏳ Merging ${height ? height + 'p' : 'HD'} Video & Audio with FFmpeg... Download starting!`);
    } else if (type === 'audio') {
      proxyDownloadUrl += `&type=audio&url=${encodeURIComponent(targetUrl)}`;
      if (abr) proxyDownloadUrl += `&abr=${encodeURIComponent(abr)}`;
      setDownloadToast(`⏳ Extracting ${abr ? abr + ' kbps' : 'Studio'} MP3 Audio with FFmpeg... Download starting!`);
    } else {
      proxyDownloadUrl += `&type=direct&url=${encodeURIComponent(targetUrl)}`;
      setDownloadToast(`🚀 Starting download: ${cleanFilename}`);
    }

    // Trigger download via standard anchor element for instant Chrome download manager catch
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = proxyDownloadUrl;
    downloadAnchor.setAttribute('download', cleanFilename);
    downloadAnchor.style.display = 'none';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      if (document.body.contains(downloadAnchor)) {
        document.body.removeChild(downloadAnchor);
      }
    }, 2000);

    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });

    setTimeout(() => {
      setDownloadToast(`✅ Download initiated: ${cleanFilename}`);
      setTimeout(() => setDownloadToast(null), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* HERO / HEADER SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#12161A] to-[#0A0D10] border border-[#485563]/40 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Faraz VideoGrab Pro • AllDL Universal Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] font-display tracking-tight leading-tight">
            Universal Video, Audio & Thumbnail Downloader
          </h1>

          <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-2xl">
            Download high-definition videos without watermark from YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, or paste <strong className="text-[#D4AF37]">ANY webpage/article link</strong> — our Smart Sniffer automatically finds and extracts embedded videos!
          </p>

          {/* Quick Platform Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            {SUPPORTED_PLATFORMS.map((p) => (
              <span 
                key={p.id} 
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  detectedPlatform.toLowerCase().includes(p.name.toLowerCase()) || (p.id === 'sniffer' && detectedPlatform.includes('Sniffer'))
                    ? 'bg-[#D4AF37] text-[#080808] border-[#D4AF37] font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-[#14191E] text-[#9CA3AF] border-[#485563]/40 hover:border-[#D4AF37]/50'
                }`}
              >
                {p.name} <span className="opacity-60 text-[9px]">({p.badge})</span>
              </span>
            ))}
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="mt-8 max-w-4xl">
          <form onSubmit={handleExtract} className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Paste video URL or webpage link (YouTube, TikTok, Instagram, or any article/blog)..."
                className="w-full px-4 py-4 pl-4 pr-24 rounded-2xl bg-[#080808] border border-[#485563]/60 focus:border-[#D4AF37] text-sm text-[#F5F5F5] placeholder-[#9CA3AF]/50 outline-none transition-all shadow-inner font-mono"
              />

              {/* Action buttons inside input */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => { setInputUrl(''); setMediaData(null); }}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#181F25] text-xs font-mono"
                    title="Clear"
                  >
                    &times;
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2.5 py-1.5 rounded-xl bg-[#181F25] hover:bg-[#202930] text-[#D4AF37] border border-[#485563]/40 text-[11px] font-mono font-bold transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Paste</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isExtracting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-sm font-mono tracking-wide transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer active:scale-95"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>EXTRACTING...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 fill-current" />
                  <span>DOWNLOAD MEDIA</span>
                </>
              )}
            </button>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* EXTRACTED MEDIA SHOWCASE CARD */}
      {mediaData && (
        <div className="rounded-3xl bg-[#0E1114] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-6 animate-fadeIn">
          
          {/* Top Video Header */}
          <div className="flex flex-col lg:flex-row items-start gap-6 pb-6 border-b border-[#485563]/40">
            
            {/* Thumbnail / Video Preview Box */}
            <div className="w-full lg:w-80 rounded-2xl bg-[#080808] border border-[#485563]/50 overflow-hidden relative group shrink-0 aspect-video flex items-center justify-center">
              {mediaData.embed_url && isPlayingPreview ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={mediaData.embed_url}
                    title={mediaData.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPlayingPreview(false)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-white/80 hover:text-white hover:bg-black transition-colors"
                    title="Close Preview"
                  >
                    ✕
                  </button>
                </div>
              ) : mediaData.preview_stream && isPlayingPreview ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoPreviewRef}
                    src={mediaData.preview_stream}
                    controls
                    autoPlay
                    playsInline
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // If direct CDN stream fails due to CORS or referer blocking, fallback to stream proxy
                      const proxySrc = `/api/videodl?action=stream&stream_url=${encodeURIComponent(mediaData.preview_stream)}`;
                      if (e.target.src !== proxySrc) {
                        e.target.src = proxySrc;
                        e.target.play().catch(() => {});
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPlayingPreview(false)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-white/80 hover:text-white hover:bg-black transition-colors z-10"
                    title="Close Preview"
                  >
                    ✕
                  </button>
                </div>
              ) : mediaData.thumbnail ? (
                <>
                  <img 
                    src={mediaData.thumbnail} 
                    alt={mediaData.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {(mediaData.preview_stream || mediaData.embed_url) && (
                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview(true)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors group"
                      title="Play HD Preview"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#080808] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </button>
                  )}
                </>
              ) : (
                <Film className="w-12 h-12 text-[#9CA3AF] opacity-40" />
              )}

              {/* Duration Badge */}
              {mediaData.duration && !isPlayingPreview && (
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white">
                  {mediaData.duration}
                </div>
              )}
            </div>

            {/* Video Metadata & Platform Badge */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37] text-[#080808] uppercase">
                  {mediaData.platform}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>● 100% CLEAN NO WATERMARK</span>
                </span>

                {mediaData.author && (
                  <span className="text-xs text-[#9CA3AF] font-mono">
                    by <strong className="text-[#F5F5F5]">{mediaData.author}</strong>
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5] leading-snug font-display line-clamp-2">
                {mediaData.title}
              </h2>

              <p className="text-xs text-[#9CA3AF] font-mono truncate max-w-xl">
                Source: <a href={mediaData.original_url} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">{mediaData.original_url}</a>
              </p>

              {/* Summary Stats */}
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-[#9CA3AF]">
                <span>📹 {mediaData.video_formats?.length || 0} Video Streams</span>
                <span>•</span>
                <span>🎵 {mediaData.audio_formats?.length || 0} Audio Options</span>
                <span>•</span>
                <span>🖼️ {mediaData.thumbnails?.length || 0} Thumbnail Sizes</span>
              </div>
            </div>

          </div>

          {/* FORMAT TABS SELECTOR */}
          <div className="flex items-center gap-2 border-b border-[#485563]/40 pb-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'video'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-[#9CA3AF] hover:text-white bg-[#14191E] border border-[#485563]/40'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Video Formats ({mediaData.video_formats?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'audio'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-[#9CA3AF] hover:text-white bg-[#14191E] border border-[#485563]/40'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Audio MP3 ({mediaData.audio_formats?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('thumbnails')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'thumbnails'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-[#9CA3AF] hover:text-white bg-[#14191E] border border-[#485563]/40'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>HD Thumbnails ({mediaData.thumbnails?.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: VIDEO FORMATS TABLE & BUTTONS */}
          {activeTab === 'video' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
                Available Resolutions & Video Downloads
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mediaData.video_formats && mediaData.video_formats.length > 0 ? (
                  mediaData.video_formats.map((vf, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37]/60 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#14191E] border border-[#485563]/40 flex items-center justify-center font-bold text-xs text-[#D4AF37] shrink-0">
                          {vf.height >= 1080 ? '1080p' : vf.height >= 720 ? '720p' : `${vf.height || 'SD'}p`}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors truncate">
                            {vf.label || `${vf.quality} MP4`}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#9CA3AF] mt-0.5 flex-wrap">
                            <span>Format: MP4</span>
                            <span>•</span>
                            <span>Size: {vf.filesize}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> Audio Merged
                            </span>
                            {vf.direct_url && (
                              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                                <Zap className="w-3 h-3" /> Instant Stream
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(vf.direct_url || vf.url)}
                          className="p-2 rounded-xl bg-[#14191E] hover:bg-[#1E252D] text-[#9CA3AF] hover:text-white transition-colors"
                          title="Copy Direct Stream URL"
                        >
                          {copiedUrl === (vf.direct_url || vf.url) ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTriggerDownload({
                            type: vf.requires_merge ? 'video' : 'direct',
                            url: mediaData.original_url,
                            streamUrl: vf.direct_url,
                            height: vf.height,
                            title: `${mediaData.title}-${vf.quality}`
                          })}
                          className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download {vf.quality}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center text-xs font-mono text-[#9CA3AF] bg-[#080808] rounded-2xl border border-[#485563]/30">
                    No individual video streams found. Try the direct original URL.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO EXTRACTION (MP3) */}
          {activeTab === 'audio' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
                Extracted Audio Tracks & High-Bitrate MP3
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mediaData.audio_formats && mediaData.audio_formats.length > 0 ? (
                  mediaData.audio_formats.map((af, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37]/60 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-400 shrink-0">
                          <Music className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors truncate">
                            {af.quality || 'MP3 Audio'}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#9CA3AF] mt-0.5">
                            <span>Format: MP3 Audio</span>
                            <span>•</span>
                            <span>Estimated Size: {af.filesize}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(af.direct_url || af.url)}
                          className="p-2 rounded-xl bg-[#14191E] hover:bg-[#1E252D] text-[#9CA3AF] hover:text-white transition-colors"
                          title="Copy Direct URL"
                        >
                          {copiedUrl === (af.direct_url || af.url) ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTriggerDownload({
                            type: af.direct_url ? 'direct' : 'audio',
                            url: mediaData.original_url,
                            streamUrl: af.direct_url,
                            abr: af.abr || 192,
                            title: `${mediaData.title}-Audio-${af.abr || 192}kbps`
                          })}
                          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download MP3</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center text-xs font-mono text-[#9CA3AF] bg-[#080808] rounded-2xl border border-[#485563]/30">
                    No separate audio stream found. Video stream already contains audio.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: THUMBNAILS DOWNLOAD */}
          {activeTab === 'thumbnails' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
                Full-Resolution Video Thumbnails & Cover Images
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mediaData.thumbnails && mediaData.thumbnails.length > 0 ? (
                  mediaData.thumbnails.slice(0, 6).map((th, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#080808] border border-[#485563]/40 space-y-2.5 group overflow-hidden"
                    >
                      <div className="aspect-video rounded-xl bg-[#14191E] overflow-hidden relative">
                        <img 
                          src={th.url} 
                          alt={th.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                          {th.resolution || th.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-xs font-bold text-[#F5F5F5] truncate">
                          {th.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTriggerDownload({
                            type: 'direct',
                            url: th.url,
                            streamUrl: th.direct_url || th.url,
                            title: `${mediaData.title || 'thumbnail'}-${th.resolution || 'hd'}.jpg`
                          })}
                          className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Download className="w-3 h-3" />
                          <span>Save Image</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 p-8 text-center text-xs font-mono text-[#9CA3AF] bg-[#080808] rounded-2xl border border-[#485563]/30">
                    No thumbnail found for this media.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* RECENT DOWNLOADS LOG */}
      {recentDownloads.length > 0 && (
        <div className="rounded-3xl bg-[#0A0D10] border border-[#485563]/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-[#F5F5F5] font-display">
                Recent Extractions ({recentDownloads.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('bbf_videodl_history');
                setRecentDownloads([]);
              }}
              className="text-xs font-mono text-[#9CA3AF] hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentDownloads.slice(0, 6).map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setInputUrl(item.url);
                  handleExtract();
                }}
                className="p-3.5 rounded-2xl bg-[#12161A] border border-[#485563]/40 hover:border-[#D4AF37]/60 transition-all cursor-pointer group flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#080808] overflow-hidden shrink-0 border border-[#485563]/40 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Film className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold block">
                    {item.platform}
                  </span>
                  <h4 className="text-xs font-bold text-[#F5F5F5] truncate group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono text-[#9CA3AF]">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHY BUILDBYFARAZ VIDEOGRAB IS SUPERIOR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-[#0A0D10] border border-[#485563]/30 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#F5F5F5]">100% No Watermark</h4>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
            TikTok and short-form videos are downloaded directly in their raw, crystal-clear format without annoying publisher watermarks.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0A0D10] border border-[#485563]/30 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Tv className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#F5F5F5]">1080p & 4K Multi-Quality</h4>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
            Choose exact resolutions from 1080p Full HD down to 360p mobile formats, with accurate file sizes and progressive audio.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0A0D10] border border-[#485563]/30 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Music className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#F5F5F5]">Instant MP3 & Thumbnails</h4>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
            Extract high-fidelity audio tracks and full-resolution video thumbnails with zero ads, zero redirects, and zero spam.
          </p>
        </div>
      </div>

      {/* Floating Instant Download Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-[#12161A] border border-[#D4AF37] text-[#F5F5F5] text-xs font-mono shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{downloadToast}</span>
        </div>
      )}

    </div>
  );
}
