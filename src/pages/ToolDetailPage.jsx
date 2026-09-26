import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  DownloadCloud, 
  Mic, 
  Camera, 
  Keyboard, 
  Code,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import VideoDownloaderStudio from '../components/VideoDownloaderStudio';
import SpeechSterStudio from '../components/SpeechSterStudio';
import WebSnapStudio from '../components/WebSnapStudio';
import DriveUpStudio from '../components/DriveUpStudio';
import CustomToolStudio from '../components/CustomToolStudio';
import TypingFastPage from './TypingFastPage';

export default function ToolDetailPage({ 
  toolId = 'videodl', 
  tools = [], 
  onBack, 
  currentUser, 
  onLogActivity 
}) {
  const normalizeId = (id) => {
    if (!id) return 'videodl';
    if (id === 'tool-videodl' || id === 'videodl') return 'videodl';
    if (id === 'tool-speechster' || id === 'speechster') return 'speechster';
    if (id === 'tool-websnap' || id === 'websnap') return 'websnap';
    if (id === 'tool-typingfast' || id === 'typingfast') return 'typingfast';
    if (id === 'tool-driveup' || id === 'driveup') return 'driveup';
    return id;
  };

  const activeId = normalizeId(toolId);
  const targetTool = tools.find(t => t.id === toolId || t.id === activeId || t.id === `tool-${activeId}`);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeId]);

  const getToolIcon = () => {
    switch (activeId) {
      case 'videodl':
        return <DownloadCloud className="w-6 h-6 text-blue-400" />;
      case 'speechster':
        return <Mic className="w-6 h-6 text-purple-400" />;
      case 'websnap':
        return <Camera className="w-6 h-6 text-[#D4AF37]" />;
      case 'typingfast':
        return <Keyboard className="w-6 h-6 text-emerald-400" />;
      case 'driveup':
        return <FolderOpen className="w-6 h-6 text-sky-400" />;
      default:
        return <Code className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  const getToolBadge = () => {
    if (targetTool?.badge) return targetTool.badge;
    switch (activeId) {
      case 'videodl':
        return 'POPULAR // 1080P AUDIO MERGE';
      case 'speechster':
        return 'AI // 20,000+ VOICES';
      case 'websnap':
        return 'REST API // HIGH-RES';
      case 'typingfast':
        return 'SPEED ENGINE // WPM';
      case 'driveup':
        return 'OAUTH // CLOUD CLONER';
      default:
        return 'VERIFIED TOOL';
    }
  };

  const getToolTitle = () => {
    if (targetTool?.title) return targetTool.title;
    switch (activeId) {
      case 'videodl':
        return 'Faraz VideoGrab Pro — Universal Media Downloader';
      case 'speechster':
        return 'SpeechSter — AI Voice & Multi-Speaker Studio';
      case 'websnap':
        return 'WebSnap — Website Screenshot Engine';
      case 'typingfast':
        return 'TypingFast — Minimalist Speed Engine';
      case 'driveup':
        return 'DriveUp — Cloud Google Drive Folder Cloner & ZIP Downloader';
      default:
        return 'Developer Tool Studio';
    }
  };

  const getToolDescription = () => {
    if (targetTool?.description) return targetTool.description;
    switch (activeId) {
      case 'videodl':
        return 'Download 1080p, 4K, 720p videos, studio-quality MP3 audio, and ultra-HD thumbnails from YouTube, TikTok, Instagram, Twitter, and 100+ platforms with automatic FFmpeg audio merging and zero watermarks.';
      case 'speechster':
        return 'Convert scripts into expressive natural speech with 20,000+ Fish Audio models, 583 neural voices, Babar Azam custom voice clone, and multi-speaker dialogue controls.';
      case 'websnap':
        return 'High-speed full-page website capture engine and viewport renderer. Capture any URL as a crisp binary PNG with zero authentication or paywalls.';
      case 'typingfast':
        return 'Precision typing speed engine engineered by Faraz. Real-time WPM, CPM, rhythm consistency, tactile mechanical keyboard sounds, and verified downloadable certificates.';
      case 'driveup':
        return 'Recreate deep nested Google Drive folder hierarchies and clone files cloud-to-cloud inside Google servers with zero local bandwidth, or stream entire folders as high-speed ZIP archives.';
      default:
        return 'Interactive developer utility running on the BUILDBYFARAZ edge network with zero authentication required.';
    }
  };

  const handleShare = () => {
    const url = window.location.origin + '/?tool=' + activeId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Tool link copied to clipboard: ' + url);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-10">
      
      {/* 1. Header & Dedicated Navigation (Zero Tab Clutter) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#485563]/40">
        <div>
          {/* Breadcrumbs & Back Button */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12161A] hover:bg-[#181F25] border border-[#485563]/50 text-[#9CA3AF] hover:text-[#F5F5F5] text-xs font-mono transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Tools Directory</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>BUILDBYFARAZ // DEDICATED TOOL VIEW</span>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% OPERATIONAL</span>
            </span>
          </div>

          {/* Title & Eyebrow */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#12161A] border border-[#485563]/50 flex items-center justify-center shrink-0 mt-1 shadow-lg">
              {getToolIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 uppercase tracking-wider">
                  {getToolBadge()}
                </span>
                <span className="text-xs text-[#9CA3AF] font-mono">
                  Engineered by <strong className="text-[#F5F5F5]">{targetTool?.author || 'Faraz'}</strong>
                </span>
                <span className="text-xs text-[#D4AF37] font-mono font-bold">
                  {targetTool?.version || 'v2.1.0'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#F5F5F5] tracking-tight">
                {getToolTitle()}
              </h1>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2 max-w-3xl leading-relaxed">
                {getToolDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-[#12161A] hover:bg-[#181F25] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#F5F5F5] text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
            title="Copy direct link to this tool"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Share Tool Link</span>
          </button>
        </div>
      </div>

      {/* 2. DEDICATED TOOL WORKBENCH */}
      <div>
        {activeId === 'videodl' && (
          <VideoDownloaderStudio
            currentUser={currentUser}
            onLogActivity={onLogActivity}
          />
        )}

        {activeId === 'speechster' && (
          <SpeechSterStudio
            currentUser={currentUser}
            onLogActivity={onLogActivity}
          />
        )}

        {activeId === 'websnap' && (
          <WebSnapStudio
            currentUser={currentUser}
            onLogActivity={onLogActivity}
          />
        )}

        {activeId === 'typingfast' && (
          <TypingFastPage
            onNavigate={onBack}
            onLogActivity={onLogActivity}
            currentUser={currentUser}
          />
        )}

        {activeId === 'driveup' && (
          <DriveUpStudio
            currentUser={currentUser}
            onLogActivity={onLogActivity}
          />
        )}

        {activeId !== 'videodl' && 
         activeId !== 'speechster' && 
         activeId !== 'websnap' && 
         activeId !== 'typingfast' && 
         activeId !== 'driveup' && (
          <CustomToolStudio
            tool={targetTool || { id: activeId, title: activeId }}
            currentUser={currentUser}
            onLogActivity={onLogActivity}
          />
        )}
      </div>

    </div>
  );
}
