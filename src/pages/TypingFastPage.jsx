import React, { useState } from 'react';
import { 
  Keyboard, 
  ExternalLink, 
  Maximize2, 
  Volume2, 
  Trophy, 
  Flame, 
  FileText, 
  Users, 
  ArrowLeft,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck
} from 'lucide-react';

export default function TypingFastPage({ onNavigate, onLogActivity, currentUser }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleLaunchExternal = () => {
    if (onLogActivity) {
      onLogActivity({
        user: currentUser?.name || 'Developer',
        role: currentUser?.role || 'user',
        action: 'Launched TypingFast Dedicated Window',
        target: 'TypingFast v1.0.0',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: new Date().toLocaleDateString()
      });
    }
    window.open('/typingfast/index.html', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-10">
      
      {/* 1. Header & Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#485563]/40">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => onNavigate('tools')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12161A] hover:bg-[#181F25] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#F5F5F5] text-xs font-mono transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Back to Tools</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>TOOL #3 // BUILDBYFARAZ SPEED ENGINE</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#F5F5F5] tracking-tight">
            TypingFast &bull; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Minimalist Speed Test</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] mt-2 max-w-2xl leading-relaxed">
            High-precision keyboard speed engine engineered by Faraz. Test your pure WPM, accuracy, and keystroke rhythm with realistic mechanical audio feedback, multiplayer, and PDF scorecards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-4 py-2.5 rounded-xl bg-[#12161A] hover:bg-[#181F25] border border-[#485563]/50 text-[#F5F5F5] text-xs font-mono font-semibold flex items-center gap-2 transition-all"
          >
            <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{isFullscreen ? 'Exit Expand' : 'Expand View'}</span>
          </button>

          <button
            onClick={handleLaunchExternal}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Dedicated New Tab</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Tool Container / Embedded Studio */}
      <div className={`double-bezel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-hidden bg-[#080808]' : ''
      }`}>
        <div className="double-bezel-inner bg-[#0d1117] border border-[#485563]/40 rounded-3xl overflow-hidden flex flex-col">
          
          {/* Studio Top Control Strip */}
          <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#12161A] border-b border-[#485563]/40 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              <div className="px-3 py-1 rounded-lg bg-[#080808] border border-[#485563]/40 text-xs font-mono text-[#F5F5F5] flex items-center gap-2">
                <Keyboard className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-bold text-[#D4AF37]">typingfast</span>
                <span className="text-[#9CA3AF] text-[11px]">// port 3001 live sandbox</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#9CA3AF]">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SOUND & PHYSICS ACTIVE</span>
              </span>

              <button
                onClick={handleLaunchExternal}
                className="px-3 py-1.5 rounded-lg bg-[#181F25] hover:bg-[#D4AF37] hover:text-[#080808] text-[#F5F5F5] transition-all flex items-center gap-1.5"
              >
                <span>Full Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#181F25] text-[#F5F5F5] hover:bg-red-500/20 hover:text-red-400"
                >
                  Close Fullscreen
                </button>
              )}
            </div>
          </div>

          {/* Embedded Application Viewport */}
          <div className="relative w-full bg-[#080808]">
            {!loaded && (
              <div className="absolute inset-0 bg-[#080808] z-10 flex flex-col items-center justify-center space-y-3 min-h-[400px]">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] animate-pulse">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-[#9CA3AF]">
                  Loading TypingFast Engine & Mechanical Audio Soundscapes...
                </div>
              </div>
            )}

            <iframe
              src="/typingfast/index.html"
              title="TypingFast Application"
              onLoad={() => setLoaded(true)}
              className={`w-full border-0 transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              } ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[750px] min-h-[600px]'}`}
              allow="clipboard-read; clipboard-write; autoplay"
            />
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="px-5 py-3 bg-[#12161A] border-t border-[#485563]/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <span>Engineered by:</span>
              <strong className="text-[#F5F5F5]">Muhammad Faraz</strong>
            </div>
            <div className="flex items-center gap-4">
              <span>Sound: <strong className="text-[#D4AF37]">Mechanical Synthesizer</strong></span>
              <span>Modes: <strong className="text-[#F5F5F5]">15s / 30s / 60s / Words / Code</strong></span>
              <span>Export: <strong className="text-[#D4AF37]">PDF Scorecard</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Feature Highlights & Architecture Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        
        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3 hover:border-[#D4AF37]/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">
            Real-Time WPM & CPM
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Zero input delay tracking calculates your net words per minute, gross speed, and accuracy curves with millimeter precision.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3 hover:border-[#D4AF37]/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">
            Mechanical Audio Feedback
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Tactile acoustic switches simulate the authentic sound of blue, brown, and red mechanical keyboards on every single keypress.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3 hover:border-[#D4AF37]/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">
            Multiplayer Room Races
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Create custom race rooms, share invitation codes with friends or colleagues, and compete head-to-head on the live leaderboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3 hover:border-[#D4AF37]/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">
            PDF Scorecard Export
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Download an official, beautifully formatted PDF certificate detailing your typing test metrics, error heatmap, and rating grade.
          </p>
        </div>

      </div>

      {/* 4. Quick Tips & Hotkeys */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#12161A] border border-[#485563]/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRO TYPIST SHORTCUTS</span>
          </div>
          <h3 className="text-lg font-bold text-[#F5F5F5]">
            Quick Restart & Audio Toggle
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Press <kbd className="px-2 py-1 rounded bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] font-mono text-[11px]">Tab</kbd> + <kbd className="px-2 py-1 rounded bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] font-mono text-[11px]">Enter</kbd> to immediately restart the test, or toggle mechanical sounds from the top sound icon.
          </p>
        </div>

        <button
          onClick={handleLaunchExternal}
          className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono flex items-center gap-2 shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          <span>Open in Standalone Tab</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
