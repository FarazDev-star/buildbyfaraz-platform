import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  Phone, 
  Info,
  Shield,
  Crown,
  Lock,
  Unlock
} from 'lucide-react';

export default function Navbar({ 
  currentPage, 
  onNavigate, 
  currentUser, 
  onLogout,
  onOpenUpload,
  onOpenAdmin,
  totalToolsCount 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tools', label: 'Tools', icon: Layers, badge: totalToolsCount },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const isAdmin = currentUser?.role === 'admin';
  const isEditor = currentUser?.role === 'editor';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-5 pointer-events-none">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-2.5 rounded-full bg-[#101418]/95 backdrop-blur-2xl border border-[#485563]/40 shadow-[0_12px_35px_rgba(0,0,0,0.8)] pointer-events-auto transition-all duration-300">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 pl-3">
          <button 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 group text-left"
          >
            {/* Machined Geometric Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8B5E3C] p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-sm tracking-tighter text-[#D4AF37]">
                  BBF
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm sm:text-base tracking-tight text-[#F5F5F5] leading-none group-hover:text-[#D4AF37] transition-colors">
                  BUILDBYFARAZ
                </span>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#D4AF37] text-[#080808]">
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono tracking-wider text-[#9CA3AF] leading-tight">
                DEVELOPER TOOLS & APIS
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#080808]/80 border border-[#485563]/30 text-xs font-medium text-[#9CA3AF]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-mono text-xs ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#9CA3AF]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Auth State, Admin Console & Actions */}
        <div className="flex items-center gap-2 pr-1">
          
          {/* Admin Console Shortcut (Only visible for Admins) */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080808] transition-all text-xs font-bold font-mono shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              title="Open Admin Console"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Discord Community Link */}
          <a
            href="https://discord.gg/sgYfp5KaFJ"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5865F2]/15 border border-[#5865F2]/40 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all text-xs font-mono font-bold group"
            title="Join Official Discord Community"
          >
            <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            <span>Discord</span>
          </a>

          {/* Upload Tool Button */}
          <button
            onClick={onOpenUpload}
            data-testid="nav-upload-button"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181F25] border border-[#485563]/50 text-[#F5F5F5] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-xs font-medium group"
          >
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform text-[#D4AF37]" />
            <span>Upload Tool</span>
          </button>

          {/* If Logged In: User Profile Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                data-testid="user-profile-button"
                className="flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full bg-[#080808] hover:bg-[#181F25] border border-[#485563]/50 text-xs font-mono text-[#F5F5F5] transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[10px] text-[#D4AF37] font-bold">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-semibold max-w-[100px] truncate">
                  {currentUser.name || currentUser.email?.split('@')[0]}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  isAdmin ? 'bg-[#D4AF37] text-[#080808]' : isEditor ? 'bg-[#8B5E3C] text-white' : 'bg-[#485563]/40 text-[#9CA3AF]'
                }`}>
                  {currentUser.role || 'Member'}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-[#12161A] border border-[#485563]/50 shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-50 animate-fadeIn space-y-1">
                  <div className="px-3 py-2 border-b border-[#485563]/30">
                    <div className="text-xs font-bold text-[#F5F5F5] truncate">{currentUser.name}</div>
                    <div className="text-[10px] font-mono text-[#9CA3AF] truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-[#D4AF37] font-mono font-bold">Role: {currentUser.role?.toUpperCase()}</span>
                      {currentUser.canUpload && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono">
                          Upload Active
                        </span>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => { onOpenAdmin(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#181F25] rounded-xl transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Admin Console</span>
                    </button>
                  )}

                  <button
                    onClick={() => { onOpenUpload(); setUserDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F5F5F5] hover:bg-[#181F25] rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Upload New Tool</span>
                  </button>

                  <button
                    onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                    data-testid="user-signout-button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* If Not Logged In: Gold Pill Button */
            <button
              onClick={() => onNavigate('login')}
              data-testid="nav-login-button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105"
            >
              <span>Get Started</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-sm mx-auto p-4 rounded-3xl bg-[#12161A]/95 backdrop-blur-2xl border border-[#485563]/50 shadow-2xl pointer-events-auto space-y-2 animate-fadeIn">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40' : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30"
            >
              <Crown className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}

          <button
            onClick={() => { onOpenUpload(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-[#F5F5F5] bg-[#181F25] border border-[#485563]/50"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Upload Tool</span>
          </button>

          <a
            href="https://discord.gg/sgYfp5KaFJ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono font-bold text-[#5865F2] bg-[#5865F2]/10 border border-[#5865F2]/30"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              <span>Join Discord Community</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Live</span>
          </a>
        </div>
      )}
    </header>
  );
}
