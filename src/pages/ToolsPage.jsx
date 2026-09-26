import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Camera, 
  Mic, 
  Keyboard, 
  FolderOpen, 
  Mail, 
  Palette, 
  Film, 
  Search, 
  ArrowRight, 
  Plus, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Code,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function ToolsPage({ 
  tools = [], 
  onOpenUploadModal, 
  currentUser, 
  onLogActivity 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular'); // 'Popular' | 'Latest' | 'A-Z'
  const [pipelineModalTool, setPipelineModalTool] = useState(null);

  // Core Tools with exact matching endpoints and categories
  const CORE_TOOLS = [
    {
      id: 'videodl',
      routeId: 'videodl',
      title: 'Universal Downloader',
      badge: 'POPULAR',
      badgeType: 'emerald',
      category: 'Media & Video',
      endpoint: '/api/alldl',
      description: 'Download video from YouTube, TikTok, Instagram, Twitter, Reddit and 100+ platforms. High-speed 1080p FFmpeg audio merging, MP3 audio, and HD thumbnails.',
      tags: ['YouTube', 'TikTok', '1080p MP4', 'MP3 Audio', 'No Watermark'],
      author: 'Faraz',
      version: 'v2.0.0',
      iconType: 'download',
      isOperational: true,
      popularScore: 100,
      createdAt: '2025-03-17'
    },
    {
      id: 'websnap',
      routeId: 'websnap',
      title: 'WebSnap',
      badge: 'REST API',
      badgeType: 'rose',
      category: 'Web Tools',
      endpoint: '/api/websnap',
      description: 'Capture any URL as a full-page screenshot or PDF. Real-time binary streaming with zero authentication or paywalls. Returns PNG instantly.',
      tags: ['Screenshot', 'PNG', 'REST API', 'Full Page'],
      author: 'Faraz',
      version: 'v3.2.0',
      iconType: 'camera',
      isOperational: true,
      popularScore: 90,
      createdAt: '2025-01-15'
    },
    {
      id: 'speechster',
      routeId: 'speechster',
      title: 'SpeechSter',
      badge: 'AI',
      badgeType: 'purple',
      category: 'AI & Audio',
      endpoint: '/api/tts',
      description: 'Convert any text to natural-sounding audio. 20,000+ Fish Audio models, Babar Azam voice clone, multi-speaker dialogues, and expressive emotion tags.',
      tags: ['TTS', 'Fish Audio', 'Voice AI', 'Multi-Speaker', 'MP3'],
      author: 'Faraz',
      version: 'v2.1.0',
      iconType: 'mic',
      isOperational: true,
      popularScore: 95,
      createdAt: '2025-03-10'
    },
    {
      id: 'typingfast',
      routeId: 'typingfast',
      title: 'TypingFast',
      badge: 'POPULAR',
      badgeType: 'emerald',
      category: 'Developer & Speed',
      endpoint: '/typingfast',
      description: 'High-precision minimalist typing speed engine. Measure real-time WPM, CPM, rhythm consistency, tactile mechanical sounds, and verified PDF scorecards.',
      tags: ['Speed Test', 'WPM', 'Keystroke Physics', 'Scorecards'],
      author: 'Faraz',
      version: 'v1.0.0',
      iconType: 'keyboard',
      isOperational: true,
      popularScore: 85,
      createdAt: '2025-03-14'
    },
    {
      id: 'driveup',
      routeId: 'driveup',
      title: 'DriveUp',
      badge: 'OAUTH',
      badgeType: 'blue',
      category: 'Utilities',
      endpoint: '/api/driveup',
      description: 'Clone shared Google Drive folders with deep nested hierarchies into your personal Drive or download as high-speed ZIP bundle with zero local bandwidth.',
      tags: ['Cloud', 'Drive Cloner', 'Streaming ZIP', 'OAuth'],
      author: 'Faraz',
      version: 'v6.8.2',
      iconType: 'folder',
      isOperational: true,
      popularScore: 88,
      createdAt: '2025-03-20'
    },
    {
      id: 'tempster',
      routeId: 'tempster',
      title: 'TempSter',
      badge: 'REST API',
      badgeType: 'rose',
      category: 'Security & API',
      endpoint: '/api/mail',
      description: 'Generate disposable email addresses with live inbox. Receive testing verification codes and OTPs without spam or signup.',
      tags: ['Temp Mail', 'Disposable', 'OTP', 'No Spam'],
      author: 'Faraz',
      version: 'v1.0.0 (Pipeline)',
      iconType: 'mail',
      isOperational: false,
      popularScore: 78,
      createdAt: '2025-02-20'
    },
    {
      id: 'pixelster',
      routeId: 'pixelster',
      title: 'PixelSter',
      badge: 'AI',
      badgeType: 'purple',
      category: 'AI & Audio',
      endpoint: '/api/tti',
      description: 'Generate AI images and concept visuals from text prompts. Bulk creative workflows, multi-resolution exports, and one-click downloads.',
      tags: ['Image Gen', 'AI Art', 'Diffusion', 'Batch'],
      author: 'Faraz',
      version: 'v1.0.0 (Pipeline)',
      iconType: 'palette',
      isOperational: false,
      popularScore: 82,
      createdAt: '2025-02-28'
    },
    {
      id: 'cinesearch',
      routeId: 'cinesearch',
      title: 'CineSearch',
      badge: 'REST API',
      badgeType: 'amber',
      category: 'Media & Video',
      endpoint: '/api/cinema',
      description: 'Live query database for movies, series, posters, trailers, and IMDb rankings with instant JSON response.',
      tags: ['Cinema', 'IMDb', 'Trailers', 'Streaming'],
      author: 'Faraz',
      version: 'v1.0.0 (Pipeline)',
      iconType: 'film',
      isOperational: false,
      popularScore: 75,
      createdAt: '2025-02-15'
    }
  ];

  // User uploaded custom community tools
  const customTools = tools
    .filter(t => !['tool-websnap', 'tool-speechster', 'tool-typingfast', 'tool-videodl', 'tool-driveup', 'tool-tempster', 'tool-pixelster', 'tool-cinesearch', 'websnap', 'speechster', 'typingfast', 'videodl', 'driveup', 'tempster', 'pixelster', 'cinesearch'].includes(t.id))
    .map(t => ({
      id: t.id,
      routeId: t.id,
      title: t.title?.split('—')[0]?.trim() || t.title,
      badge: t.badge || 'COMMUNITY',
      badgeType: 'amber',
      category: t.category || 'Community Tool',
      endpoint: t.endpoint || `/api/${t.id}`,
      description: t.description || t.tagline || 'Custom developer tool published to BUILDBYFARAZ.',
      tags: t.tags || ['Community', 'API'],
      author: t.author || 'Faraz',
      version: t.version || 'v1.0.0',
      iconType: 'code',
      isOperational: true,
      popularScore: 70,
      createdAt: t.createdDate || '2025-03-01'
    }));

  const allTools = [...CORE_TOOLS, ...customTools];

  // Filter & Search
  const filteredTools = allTools.filter(tool => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.endpoint.toLowerCase().includes(q) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(q)) ||
      tool.author?.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' ||
      (selectedCategory === 'Upcoming Pipeline' && !tool.isOperational) ||
      (selectedCategory === 'Utilities' && (tool.category?.includes('Utilities') || tool.tags?.includes('Drive Cloner'))) ||
      (selectedCategory === 'Media & Video' && (tool.category?.includes('Media') || tool.tags?.includes('YouTube'))) ||
      (selectedCategory === 'AI & Audio' && (tool.category?.includes('Audio') || tool.category?.includes('AI'))) ||
      (selectedCategory === 'Web Tools' && tool.category?.includes('Web')) ||
      (selectedCategory === 'Developer & Speed' && (tool.category?.includes('Speed') || tool.category?.includes('Developer'))) ||
      (selectedCategory === 'Security & API' && (tool.category?.includes('Security') || tool.tags?.includes('OTP'))) ||
      tool.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Sort
  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === 'Popular') {
      return (b.popularScore || 0) - (a.popularScore || 0);
    }
    if (sortBy === 'Latest') {
      return new Date(b.createdAt || '2025-01-01') - new Date(a.createdAt || '2025-01-01');
    }
    if (sortBy === 'A-Z') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const getToolIcon = (iconType) => {
    switch (iconType) {
      case 'download':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <DownloadCloud className="w-4 h-4" />
          </div>
        );
      case 'camera':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Camera className="w-4 h-4" />
          </div>
        );
      case 'mic':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Mic className="w-4 h-4" />
          </div>
        );
      case 'keyboard':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Keyboard className="w-4 h-4" />
          </div>
        );
      case 'folder':
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <FolderOpen className="w-4 h-4" />
          </div>
        );
      case 'mail':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Mail className="w-4 h-4" />
          </div>
        );
      case 'palette':
        return (
          <div className="w-8 h-8 rounded-lg bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400">
            <Palette className="w-4 h-4" />
          </div>
        );
      case 'film':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37]">
            <Code className="w-4 h-4" />
          </div>
        );
    }
  };

  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case 'emerald':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'rose':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      case 'purple':
        return 'text-purple-400 border-purple-500/40 bg-purple-500/10';
      case 'blue':
        return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
      case 'amber':
      default:
        return 'text-[#D4AF37] border-[#D4AF37]/40 bg-[#D4AF37]/10';
    }
  };

  const handleCardClick = (e, tool) => {
    if (!tool.isOperational) {
      e.preventDefault();
      setPipelineModalTool(tool);
      return;
    }

    if (onLogActivity) {
      onLogActivity({
        user: currentUser?.name || 'Developer',
        role: currentUser?.role || 'user',
        action: 'Launched Tool in Dedicated Tab',
        target: tool.title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: new Date().toLocaleDateString()
      });
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#485563]/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>BUILDBYFARAZ // DEVELOPER PLATFORM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#F5F5F5] tracking-tight">
            Developer Tools &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">APIs</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] mt-2 max-w-2xl leading-relaxed">
            High-speed media utilities, neural speech synthesizers, and zero-auth developer engines. Click any tool box to launch in full studio workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUploadModal}
          className="px-5 py-2.5 rounded-full bg-[#181F25] hover:bg-[#485563]/30 border border-[#485563]/50 text-[#F5F5F5] hover:border-[#D4AF37] text-xs font-semibold font-mono flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>+ Submit Tool</span>
        </button>
      </div>

      {/* 2. Top Filter, Search & Sort Control Bar (Matching Ahm's Layout Exactly) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left: Total APIs count */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF] flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-400">{filteredTools.filter(t => t.isOperational).length} LIVE APIS</span>
            <span className="text-[#485563]">•</span>
            <span className="font-bold text-amber-400">{filteredTools.filter(t => !t.isOperational).length} IN PIPELINE</span>
            <span className="text-[#6B7280]">({filteredTools.length} TOTAL SUITE)</span>
          </div>

          {/* Right: Sort Controls & Search Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search tools & APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#12161A] border border-[#485563]/50 text-[#F5F5F5] text-xs font-mono placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Sort Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12161A] border border-[#485563]/40 text-xs font-mono">
              <span className="text-[#9CA3AF] px-2 text-[11px]">Sort:</span>
              {['Popular', 'Latest', 'A-Z'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSortBy(mode)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    sortBy === mode
                      ? 'bg-[#D4AF37] text-[#080808] font-bold shadow-sm'
                      : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {['All', 'Media & Video', 'AI & Audio', 'Web Tools', 'Developer & Speed', 'Utilities', 'Upcoming Pipeline'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-[#080808] font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                  : 'bg-[#12161A] text-[#9CA3AF] hover:text-[#F5F5F5] border border-[#485563]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CONTAINER BOXES GRID (Exact Card Architecture from Reference Image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map((tool) => {
          const targetUrl = `/?tool=${tool.routeId}`;

          return (
            <a
              key={tool.id}
              href={targetUrl}
              target={tool.isOperational ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={(e) => handleCardClick(e, tool)}
              className="block rounded-2xl bg-[#101418] border-2 border-[#232B32] hover:border-[#D4AF37] transition-all duration-200 p-6 flex flex-col justify-between group shadow-lg hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] cursor-pointer hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                {/* Top Row: Icon Container Box + Badge */}
                <div className="flex items-center justify-between">
                  {/* Icon in Rounded Box */}
                  <div className="w-12 h-12 rounded-xl border-2 border-[#303B46] bg-[#161C22] flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors">
                    {getToolIcon(tool.iconType)}
                  </div>

                  {/* Top Right Badge */}
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider border ${getBadgeStyle(tool.badgeType)}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Middle: Title & Description */}
                <div>
                  <h3 className="text-xl font-bold font-display text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                {/* Tags */}
                {tool.tags && Array.isArray(tool.tags) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tool.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080808] text-[#9CA3AF] border border-[#485563]/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Row: Endpoint & Red/Amber Arrow */}
              <div className="border-t border-[#232B32] pt-4 mt-6 flex items-center justify-between">
                <span className="text-xs font-mono text-[#8C9BAE] group-hover:text-[#D4AF37] transition-colors">
                  {tool.endpoint}
                </span>

                <div className="flex items-center gap-1 text-rose-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all">
                  <span className="text-xs font-mono font-bold hidden group-hover:inline">Open in New Tab</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {sortedTools.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3">
          <Terminal className="w-8 h-8 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#F5F5F5]">No matching tools found</h3>
          <p className="text-xs text-[#9CA3AF]">
            Try clearing your search or selecting &quot;All&quot; categories.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#080808] font-bold text-xs font-mono"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* PIPELINE MODAL (For upcoming tools like DriveUp, TempSter, PixelSter) */}
      {pipelineModalTool && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#12161A] border border-[#D4AF37]/50 p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase">
                  DEPLOYMENT PIPELINE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPipelineModalTool(null)}
                className="text-[#9CA3AF] hover:text-[#F5F5F5] text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-[#F5F5F5]">
                {pipelineModalTool.title}
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                {pipelineModalTool.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/40 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Planned Endpoint:</span>
                <strong className="text-[#D4AF37]">{pipelineModalTool.endpoint}</strong>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Status:</span>
                <span className="text-amber-400 font-bold">Scheduled for Q2 Release</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Architecture:</span>
                <span className="text-[#F5F5F5]">Edge Serverless Worker</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`You are on the priority waitlist for ${pipelineModalTool.title}!`);
                  setPipelineModalTool(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all"
              >
                Join Early Access
              </button>
              <button
                type="button"
                onClick={() => setPipelineModalTool(null)}
                className="px-4 py-2.5 rounded-xl bg-[#181F25] hover:bg-[#20272E] text-[#9CA3AF] text-xs font-mono transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
