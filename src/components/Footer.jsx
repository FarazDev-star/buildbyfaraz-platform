import React from 'react';
import { ArrowUp, Terminal, Code, Heart, Crown } from 'lucide-react';

export default function Footer({ onOpenUpload, onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="relative border-t border-[#485563]/40 bg-[#080808] pt-16 pb-12 px-4 sm:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#485563]/30">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8B5E3C] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-sm text-[#D4AF37]">
                    BBF
                  </span>
                </div>
              </div>

              <div>
                <span className="font-display font-bold text-base text-[#F5F5F5] tracking-tight">
                  BUILDBYFARAZ
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-[#D4AF37]">
                  DEVELOPER TOOLS & REST APIS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-sm leading-relaxed">
              High-performance developer utilities, full-page screen capture, and zero-auth REST APIs. Free for developers worldwide, engineered by Muhammad Faraz (Lahore, Pakistan).
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#9CA3AF]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block animate-pulse" />
              <span className="text-[#F5F5F5]">ALL REST ENDPOINTS OPERATIONAL</span>
            </div>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#F5F5F5]">
              COMMUNITY & DIRECT
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#9CA3AF]">
              <li>
                <a 
                  href="https://discord.gg/sgYfp5KaFJ" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#5865F2] flex items-center gap-1.5 transition-colors group"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#5865F2] group-hover:scale-110 transition-transform" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                  <span>Discord Community</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/farazdev-star" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#F5F5F5] flex items-center gap-1.5 transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>GitHub: @farazdev-star</span>
                </a>
              </li>
              <li>
                <a href="mailto:faggaf786678@gmail.com" className="hover:text-[#D4AF37] transition-colors">
                  Email: faggaf786678@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/923284487595?text=Hello%20Muhammad%20Faraz" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  WhatsApp: +92 328 4487595
                </a>
              </li>
              <li>
                <a href="https://farazdev-star.github.io/FarazDev/" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                  Portfolio: FarazDev
                </a>
              </li>
            </ul>
          </div>

          {/* Tool Ecosystem */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#F5F5F5]">
              TOOL ENGINE
            </h4>
            <ul className="space-y-1.5 text-xs font-mono text-[#9CA3AF]">
              <li>
                <button onClick={() => handleNav('tools')} className="hover:text-[#D4AF37] transition-colors">
                  WebSnap Engine
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools')} className="hover:text-[#D4AF37] transition-colors">
                  SpeechSter Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('typingfast')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>TypingFast</span>
                  <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-400 rounded">v1.0</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenUpload} className="hover:text-[#D4AF37] transition-colors">
                  + Submit New Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Security & Policies */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#F5F5F5]">
              LEGAL & SECURITY
            </h4>
            <ul className="space-y-1.5 text-xs font-mono text-[#9CA3AF]">
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-[#D4AF37] transition-colors">
                  Terms of Service & API Fair Use
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-[#D4AF37] transition-colors">
                  Privacy Policy & Zero-Sale Pact
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('security')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Security & 2FA Architecture</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </button>
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12161A] border border-[#485563]/40 text-[10px] font-mono text-[#D4AF37]">
                <Crown className="w-3 h-3 text-[#D4AF37]" />
                <span>FOUNDED BY MUHAMMAD FARAZ</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9CA3AF]">
          <div>
            © {new Date().getFullYear()} BUILDBYFARAZ (BBF) &bull; Lahore, Pakistan. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('terms')} className="hover:underline">Terms</button>
            <button onClick={() => handleNav('privacy')} className="hover:underline">Privacy</button>
            <button onClick={() => handleNav('security')} className="hover:underline">Security</button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A] hover:bg-[#181F25] text-[#9CA3AF] hover:text-[#F5F5F5] transition-all border border-[#485563]/40"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
