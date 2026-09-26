import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Terminal, 
  Search, 
  Camera, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Code, 
  Globe, 
  Clock, 
  Download, 
  Lock, 
  ExternalLink, 
  Play, 
  ShoppingBag, 
  Tv, 
  Mic, 
  Headphones, 
  Wand2, 
  Keyboard, 
  Volume2,
  Layers,
  Video,
  DownloadCloud
} from 'lucide-react';
import { UPCOMING_TOOLS } from '../data/initialTools';

export default function HomePage({ onNavigate, onOpenUpload, featuredTools = [] }) {
  const [inputUrl, setInputUrl] = useState('');
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategory, setToolCategory] = useState('All');

  const handleQuickCapture = (e) => {
    e.preventDefault();
    onNavigate('tools');
  };

  return (
    <div className="py-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-20">
      
      {/* 1. Modern Agency Hero (Balanced Proportions, Wide Container, Zero Side Dead Space) */}
      <section className="relative pt-6 sm:pt-12 pb-6">
        {/* Subtle Ambient Golden Glow Behind Hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Eyebrow Badge (Clean Developer Platform, No Dark & Luxurious Text) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>BUILDBYFARAZ // DEVELOPER PLATFORM</span>
          </div>

          {/* Refined Headline Typography (Agency-Scale, Never Clunky) */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-display font-bold tracking-tight text-[#F5F5F5] leading-[1.15]">
            High-Performance Web Utilities & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59F2D]">
              Free Zero-Auth APIs.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Production-grade developer tools engineered by Faraz. Test and execute directly in your browser with zero rate limits, no subscriptions, and instant results.
          </p>

          {/* Live Quick Launch & Search Input Bar */}
          <div className="max-w-2xl mx-auto pt-3">
            <form onSubmit={handleQuickCapture} className="relative flex items-center shadow-2xl">
              <Globe className="absolute left-5 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Enter any website URL to capture screenshot or test tools..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full pl-12 pr-36 py-4 rounded-2xl bg-[#12161A] border border-[#485563]/60 text-[#F5F5F5] placeholder-[#9CA3AF]/50 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 flex items-center gap-1.5"
              >
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Platform Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/30">
              <div className="text-lg sm:text-xl font-bold text-[#D4AF37] font-display">100%</div>
              <div className="text-[10px] text-[#9CA3AF]">Free Public Access</div>
            </div>
            <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/30">
              <div className="text-lg sm:text-xl font-bold text-[#F5F5F5] font-display">0</div>
              <div className="text-[10px] text-[#9CA3AF]">API Keys Required</div>
            </div>
            <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/30">
              <div className="text-lg sm:text-xl font-bold text-[#D4AF37] font-display">&lt; 2.5s</div>
              <div className="text-[10px] text-[#9CA3AF]">Capture Latency</div>
            </div>
            <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/30">
              <div className="text-lg sm:text-xl font-bold text-[#F5F5F5] font-display">REST</div>
              <div className="text-[10px] text-[#9CA3AF]">Standard Endpoints</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Flagship Feature Spotlight: WebSnap High-Resolution Screenshot Engine */}
      <section className="double-bezel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#485563]/30">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 uppercase">
                FLAGSHIP SPOTLIGHT
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5] mt-2">
                WebSnap &bull; High-Resolution Screenshot Capture
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                Full scroll-length PNG website captures streamed directly to your browser or REST pipeline.
              </p>
            </div>

            <button
              onClick={() => onNavigate('tools')}
              className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <span>OPEN WEBSNAP STUDIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Preview Card Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-[#F5F5F5] font-heading">
                Engineered for Developers & Creators
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Whether you need automated mockups, website archiving, audit reports, or instant preview cards, WebSnap captures full-length desktop viewports without requiring trial accounts or credit cards.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Real full-page headless browser rendering</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>1-click high-resolution PNG downloads</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Interactive zoom Lightbox modal inspector</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Ready for cURL, JavaScript, and Python automation</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('tools')}
              className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#485563]/50 bg-[#080808] shadow-2xl cursor-pointer group hover:border-[#D4AF37]/60 transition-all"
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B20] border-b border-[#485563]/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] font-mono text-[#9CA3AF]">github.com // live capture</span>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">CLICK TO TEST</span>
              </div>
              <div className="p-4 bg-[#080808] max-h-72 overflow-hidden flex items-center justify-center">
                <img
                  src="/api/websnap?action=screenshot&url=https%3A%2F%2Fgithub.com"
                  alt="WebSnap live snapshot"
                  className="w-full h-auto object-top rounded-lg group-hover:scale-[1.01] transition-transform"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 Flagship Feature Spotlight #2: SpeechSter AI Voice & Multi-Speaker Studio */}
      <section className="double-bezel shadow-[0_25px_60px_-15px_rgba(212,175,55,0.15)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#485563]/30">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37] text-[#080808] uppercase">
                NEW FLAGSHIP RELEASE // TOOL #2
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5] mt-2">
                SpeechSter &bull; AI Voice & Multi-Speaker Studio
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                Lifelike neural speech synthesis powered by 20,000+ Fish Audio models and 583 studio voices.
              </p>
            </div>

            <button
              onClick={() => onNavigate('tools')}
              className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>LAUNCH SPEECHSTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-[#F5F5F5] font-heading">
                Multi-Speaker Scripting with Emotion Tags
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Build full multi-character conversations in a unified canvas. Insert emotion tags like <span className="text-[#D4AF37] font-mono">[angry]</span>, <span className="text-[#D4AF37] font-mono">[whispering]</span>, <span className="text-[#D4AF37] font-mono">[laughs]</span>, or let our intelligent <span className="text-[#F5F5F5] font-semibold">Auto-Tag AI</span> format your script automatically.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>20,000+ Fish Audio community voice models + 583 neural voices</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Live audio audition preview for all voices before choosing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Multi-speaker script timeline with individual voice assignment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Integrated studio player with direct MP3 export</span>
                </div>
              </div>
            </div>

            {/* Interactive Visual Card Mock */}
            <div 
              onClick={() => onNavigate('tools')}
              className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#080808] p-5 shadow-2xl cursor-pointer group hover:border-[#D4AF37] transition-all space-y-4"
            >
              {/* Fake Speaker Card 1 */}
              <div className="p-3.5 rounded-xl bg-[#12161A] border border-[#485563]/40 space-y-2 group-hover:border-[#D4AF37]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[10px] text-[#D4AF37] font-bold">
                      A
                    </div>
                    <span className="text-xs font-bold text-[#F5F5F5]">Ali ali - Female</span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-mono text-[#D4AF37] bg-[#D4AF37]/15">FISH S2.1</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">● 100% Expressive</span>
                </div>
                <p className="text-xs text-[#F5F5F5] font-mono leading-relaxed">
                  <span className="text-red-400 font-bold">[angry]</span> Sometimes, <span className="text-amber-400">(frustrated)</span> I think we make life more complicated than it really needs to be...
                </p>
              </div>

              {/* Fake Speaker Card 2 */}
              <div className="p-3.5 rounded-xl bg-[#12161A] border border-[#485563]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                      A
                    </div>
                    <span className="text-xs font-bold text-[#F5F5F5]">Andrew Multilingual</span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-mono text-blue-400 bg-blue-500/15">NEURAL</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9CA3AF]">Speaker 2</span>
                </div>
                <p className="text-xs text-[#9CA3AF] font-mono leading-relaxed">
                  <span className="text-emerald-400 font-bold">[laughs]</span> Type your text with audio tags to turn into lifelike expressive speech...
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono text-[#D4AF37]">
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" />
                  <span>Click anywhere to open full studio</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Open Studio &rarr;
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2.6 Flagship Feature Spotlight #3: TypingFast Minimalist Speed Test */}
      <section className="double-bezel shadow-[0_25px_60px_-15px_rgba(16,185,129,0.15)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#485563]/30">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-[#080808] uppercase">
                NEW FLAGSHIP RELEASE // TOOL #3
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5] mt-2">
                TypingFast &bull; Ultra-Fast Minimalist Typing Test
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                Zero-lag keystroke engine with mechanical keyboard soundscapes, multiplayer room challenges, and verified PDF scorecards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('typingfast')}
                className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 self-start md:self-auto shrink-0"
              >
                <Keyboard className="w-4 h-4" />
                <span>LAUNCH TYPINGFAST</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="/typingfast/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-4 py-3 rounded-full bg-[#181F25] hover:bg-[#485563]/40 text-[#F5F5F5] border border-[#485563]/50 text-xs font-mono items-center gap-1.5 transition-colors"
                title="Open in Standalone Window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Tab</span>
              </a>
            </div>
          </div>

          {/* Interactive Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-[#F5F5F5] font-heading">
                Keystroke Physics with Tactile Audio
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Test your typing velocity across 15s, 30s, 60s timed sprints, word bursts, or code practice. Hear simulated acoustic mechanical switches and download official PDF scorecards for your portfolio.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Millisecond-accurate net WPM, CPM & error telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Acoustic mechanical switch synthesizer audio feedback</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time multiplayer race rooms & global leaderboards</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant verified PDF certificate & error heatmap export</span>
                </div>
              </div>
            </div>

            {/* Interactive Visual Card Mock */}
            <div 
              onClick={() => onNavigate('typingfast')}
              className="lg:col-span-7 rounded-2xl overflow-hidden border border-emerald-500/40 bg-[#080808] p-6 shadow-2xl cursor-pointer group hover:border-emerald-400 transition-all space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono text-emerald-400 font-bold">LIVE SPEED ENGINE ACTIVE</span>
                </div>
                <span className="text-xs font-mono text-[#9CA3AF]">Mode: 30s Sprint</span>
              </div>

              {/* Mock Speed Display */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/40 text-center">
                  <div className="text-2xl font-black font-display text-emerald-400">114</div>
                  <div className="text-[10px] font-mono text-[#9CA3AF]">WPM</div>
                </div>
                <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/40 text-center">
                  <div className="text-2xl font-black font-display text-[#F5F5F5]">98.6%</div>
                  <div className="text-[10px] font-mono text-[#9CA3AF]">ACCURACY</div>
                </div>
                <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/40 text-center">
                  <div className="text-2xl font-black font-display text-[#D4AF37]">572</div>
                  <div className="text-[10px] font-mono text-[#9CA3AF]">CPM</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/40 font-mono text-xs text-[#9CA3AF] leading-relaxed">
                <span className="text-emerald-400 font-bold">the quick brown fox </span>
                <span className="text-[#F5F5F5] underline decoration-emerald-400">jumps</span> over the lazy dog and codes high performance web applications...
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  <span>Mechanical audio & physics enabled</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                  Test Your Speed &rarr;
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2.7 Flagship Feature Spotlight #4: Faraz VideoGrab Pro — Universal Video Downloader */}
      <section className="double-bezel shadow-[0_25px_60px_-15px_rgba(212,175,55,0.2)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#485563]/30">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37] text-[#080808] uppercase">
                NEW FLAGSHIP RELEASE // TOOL #4
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5] mt-2">
                Faraz VideoGrab Pro &bull; Universal Media Downloader
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                Zero-watermark video extraction, high-bitrate MP3 audio, and ultra-HD thumbnails from YouTube, TikTok, Instagram &amp; 100+ platforms.
              </p>
            </div>

            <button
              onClick={() => onNavigate('tools', 'videodl')}
              className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>OPEN VIDEOGRAB PRO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-[#F5F5F5] font-heading">
                Multi-Resolution MP4, Bitrate MP3 &amp; HD Art
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Powered by a dual-engine architecture (<span className="text-[#D4AF37] font-mono font-bold">yt-dlp core</span> + <span className="text-pink-400 font-mono font-bold">TikWM zero-watermark engine</span>). Download directly in 1080p Full HD, 720p HD, 320kbps MP3 audio, and full-resolution cover artwork with an in-studio live preview player.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Watermark-free downloads for TikTok, Reels, Shorts &amp; Videos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Multi-resolution video streams: 1080p, 720p, 480p, 360p MP4</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Direct audio extraction in high-bitrate MP3 and M4A</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Integrated in-browser live video preview player</span>
                </div>
              </div>
            </div>

            {/* Interactive Visual Card Mock */}
            <div 
              onClick={() => onNavigate('tools', 'videodl')}
              className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#080808] p-5 shadow-2xl cursor-pointer group hover:border-[#D4AF37] transition-all space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#485563]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 font-bold">DUAL-ENGINE CORE READY</span>
                </div>
                <span className="text-xs font-mono text-[#D4AF37]">YouTube &bull; TikTok &bull; Instagram &bull; FB</span>
              </div>

              {/* Mock Video Card */}
              <div className="p-3.5 rounded-xl bg-[#12161A] border border-[#485563]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37] text-[#080808]">
                      1080p FULL HD
                    </span>
                    <span className="text-xs font-bold text-[#F5F5F5]">Clean MP4 &bull; No Watermark</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Direct CDN Stream</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#080808] border border-[#485563]/30">
                    <div className="text-xs font-bold text-[#D4AF37]">1080p / 720p</div>
                    <div className="text-[9px] text-[#9CA3AF]">Video MP4</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#080808] border border-[#485563]/30">
                    <div className="text-xs font-bold text-emerald-400">320 Kbps</div>
                    <div className="text-[9px] text-[#9CA3AF]">Audio MP3</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#080808] border border-[#485563]/30">
                    <div className="text-xs font-bold text-amber-400">Ultra-HD</div>
                    <div className="text-[9px] text-[#9CA3AF]">Thumbnails</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono text-[#D4AF37]">
                <div className="flex items-center gap-1.5">
                  <DownloadCloud className="w-4 h-4" />
                  <span>Paste URL to download videos, audio &amp; thumbnails</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                  Open Studio &rarr;
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2.8 LIVE PLATFORM TOOLS & PUBLIC UTILITIES CATALOG */}
      <section className="space-y-6 pt-4 border-t border-[#485563]/30">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>LIVE SUITE // {featuredTools.length} TOOLS &amp; ZERO-AUTH APIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5] tracking-tight">
              Live Platform Tools &amp; Public Utilities
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Instant access to every official engine, voice studio, and custom-uploaded utility on BUILDBYFARAZ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search tools & APIs..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#12161A] border border-[#485563]/50 text-[#F5F5F5] text-xs font-mono placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none transition-all shadow-inner"
              />
            </div>

            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl bg-[#181F25] hover:bg-[#485563]/30 border border-[#485563]/50 text-[#F5F5F5] hover:border-[#D4AF37] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Submit Tool</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {['All', 'Media & Video', 'AI & Audio', 'Web Tools', 'Developer & Speed', 'Utilities'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setToolCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                toolCategory === cat
                  ? 'bg-[#D4AF37] text-[#080808] font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-[#12161A] text-[#9CA3AF] hover:text-[#F5F5F5] border border-[#485563]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools
            .filter((t) => {
              const q = toolSearch.toLowerCase().trim();
              const matchesSearch = !q || 
                t.title?.toLowerCase().includes(q) ||
                t.tagline?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.tags?.some(tag => tag.toLowerCase().includes(q)) ||
                t.author?.toLowerCase().includes(q);
              
              const matchesCat = toolCategory === 'All' || 
                t.category?.toLowerCase().includes(toolCategory.toLowerCase()) ||
                (toolCategory === 'Media & Video' && (t.category?.toLowerCase().includes('video') || t.category?.toLowerCase().includes('media') || t.id.includes('videodl'))) ||
                (toolCategory === 'AI & Audio' && (t.category?.includes('Audio') || t.tags?.includes('TTS'))) ||
                (toolCategory === 'Developer & Speed' && (t.category?.includes('Speed') || t.id.includes('typingfast')));

              return matchesSearch && matchesCat;
            })
            .map((t) => {
              const isTypingFast = t.id === 'tool-typingfast' || t.id === 'typingfast';

              return (
                <div
                  key={t.id}
                  className="rounded-2xl bg-[#12161A] border border-[#485563]/40 p-6 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#080808] text-[#D4AF37] border border-[#D4AF37]/30">
                        {t.category || 'Utility'}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t.badge || 'OPERATIONAL'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors font-display">
                        {t.title}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                        {t.tagline || t.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {t.tags && Array.isArray(t.tags) && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {t.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#080808] text-[#9CA3AF] border border-[#485563]/30">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-[#485563]/25 mt-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#9CA3AF]">
                      <span>By <strong className="text-[#F5F5F5]">{t.author || 'Faraz'}</strong></span>
                      <span className="text-[#D4AF37]">{t.version || 'v1.0.0'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('tools', t.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.25)] active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Launch Tool</span>
                      </button>

                      {isTypingFast && (
                        <a
                          href="/typingfast/index.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-[#181F25] hover:bg-[#1f2933] text-[#F5F5F5] border border-[#485563]/40 text-xs font-mono flex items-center gap-1"
                          title="Open dedicated full window"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 3. Upcoming Tool Pipeline Roadmap (One-by-One Community Forge) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-[#F5F5F5]">
                Upcoming Tool Pipeline
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                FORGE ROADMAP
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Tools currently being engineered and scheduled to attach to BUILDBYFARAZ one by one
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Suggest a Tool to Build</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {UPCOMING_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/35 space-y-3 relative hover:border-[#D4AF37]/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#080808] text-[#9CA3AF] border border-[#485563]/40">
                  {tool.category}
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tool.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                {tool.title}
              </h3>

              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                {tool.desc}
              </p>

              <div className="pt-2 text-[11px] font-mono text-[#D4AF37]/70 flex items-center gap-1">
                <span>In Development</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Client Projects & Case Studies by Muhammad Faraz */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#485563]/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROVEN CLIENT TRACK RECORD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5] tracking-tight">
              Featured Projects by Faraz
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Real commercial implementations across marketplace e-commerce, viral video production, and media channels
            </p>
          </div>

          <button
            onClick={() => onNavigate('about')}
            className="text-xs font-mono font-bold text-[#D4AF37] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Full Case Studies & Biography</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Project 1: Daraz Store */}
          <div className="rounded-2xl bg-[#12161A] border border-[#485563]/40 overflow-hidden hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg">
            <div className="h-40 bg-[#080808] border-b border-[#485563]/40 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F85606] flex items-center justify-center text-white font-bold text-xs shadow">
                    D
                  </div>
                  <span className="text-xs font-bold text-[#F5F5F5]">Daraz PK Verified</span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-[#F85606]/15 text-[#F85606] px-2 py-0.5 rounded-full border border-[#F85606]/30">
                  MARKETPLACE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 my-auto">
                <div className="p-2 rounded-lg bg-[#12161A] border border-[#485563]/30 text-center">
                  <div className="text-xs font-bold text-amber-400 font-mono">4.9 ★</div>
                  <div className="text-[9px] text-[#9CA3AF]">Store Rating</div>
                </div>
                <div className="p-2 rounded-lg bg-[#12161A] border border-[#485563]/30 text-center">
                  <div className="text-xs font-bold text-emerald-400 font-mono">+40%</div>
                  <div className="text-[9px] text-[#9CA3AF]">Order Lift</div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#9CA3AF] flex justify-between">
                <span>E-Commerce Operations</span>
                <span className="text-[#D4AF37]">shop/pzg6b52d</span>
              </div>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                  Daraz E-Commerce Marketplace Hub
                </h3>
                <p className="text-[11px] text-[#9CA3AF] mt-1 leading-relaxed">
                  Store setup, SEO search discoverability, customer review velocity, and conversion optimization on Daraz.
                </p>
              </div>
              <a
                href="https://www.daraz.pk/shop/pzg6b52d"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#181F25] hover:bg-[#D4AF37] text-[#F5F5F5] hover:text-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Visit Daraz Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Project 2: Cinematic Video Showcase */}
          <div className="rounded-2xl bg-[#12161A] border border-[#485563]/40 overflow-hidden hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg">
            <div className="h-40 bg-[#080808] border-b border-[#485563]/40 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-[#12161A]" />
              <div className="relative z-10 flex flex-col items-center gap-2 text-center p-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-mono font-bold text-[#F5F5F5]">4K 60FPS Video Master</span>
              </div>
              <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-mono font-bold border border-rose-500/30">
                VIDEO SHOWCASE
              </div>
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#D4AF37]">
                Google Drive Storage • Premiere &amp; After Effects
              </div>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                  Cinematic Video Editing &amp; Motion FX Showcase
                </h3>
                <p className="text-[11px] text-[#9CA3AF] mt-1 leading-relaxed">
                  Masterclass video production and motion graphics showcase engineered by Faraz with dynamic pacing, custom sound design, and color grading.
                </p>
              </div>
              <a
                href="https://drive.google.com/file/d/1bqjdpff4geRJvK9g1D98Gc1xNnflnAYA/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#181F25] hover:bg-[#D4AF37] text-[#F5F5F5] hover:text-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Watch Video Showcase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Project 3: TypingFast Minimalist Keystroke Engine */}
          <div className="rounded-2xl bg-[#12161A] border border-[#485563]/40 overflow-hidden hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg">
            <div className="h-40 bg-[#080808] border-b border-[#485563]/40 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs shadow">
                    <Keyboard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#F5F5F5]">TypingFast Core</span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ACTIVE BBF TOOL
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 my-auto">
                <div className="p-2 rounded-lg bg-[#12161A] border border-[#485563]/30 text-center">
                  <div className="text-xs font-bold text-emerald-400 font-mono">140+ Peak</div>
                  <div className="text-[9px] text-[#9CA3AF]">Raw WPM Engine</div>
                </div>
                <div className="p-2 rounded-lg bg-[#12161A] border border-[#485563]/30 text-center">
                  <div className="text-xs font-bold text-[#D4AF37] font-mono">Instant</div>
                  <div className="text-[9px] text-[#9CA3AF]">PDF Certificate</div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#9CA3AF] flex justify-between">
                <span>Physics &amp; Mechanical Audio</span>
                <span className="text-emerald-400">v1.0.0 Verified</span>
              </div>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                  TypingFast — Minimalist Keystroke Engine
                </h3>
                <p className="text-[11px] text-[#9CA3AF] mt-1 leading-relaxed">
                  High-precision typing speed engine engineered by Faraz. Measure raw WPM, CPM, rhythm accuracy with mechanical audio and verified PDF scorecards.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('typingfast')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch Engine</span>
                </button>
                <a
                  href="/typingfast/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#181F25] hover:bg-[#1f2933] text-[#F5F5F5] border border-[#485563]/40 text-xs font-mono flex items-center justify-center"
                  title="Open dedicated standalone window"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Platform Philosophy & Architecture Strip */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#12161A] border border-[#485563]/40 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F5F5F5]">Zero-Auth Philosophy</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            No friction. Open the tool, execute your task, copy your result or binary image, and continue shipping.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Terminal className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F5F5F5]">Developer First Architecture</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Every tool comes bundled with clean cURL, JavaScript, Python, and PHP code snippets ready for backend pipelines.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F5F5F5]">Role-Based Management</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Platform governance managed by Faraz with live user audit logs, contributor permissions, and catalog moderation.
          </p>
        </div>
      </section>

    </div>
  );
}
