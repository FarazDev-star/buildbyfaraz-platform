import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Code, 
  Globe, 
  Layers, 
  Crown, 
  CheckCircle2, 
  ExternalLink,
  Play,
  ShoppingBag,
  Video,
  Tv,
  Camera,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  TrendingUp,
  Award,
  Users,
  Clock,
  Star,
  Keyboard
} from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  
  // Real projects extracted from https://farazdev-star.github.io/FarazDev/
  const PROJECTS = [
    {
      id: 'proj-daraz',
      title: 'Daraz E-Commerce Marketplace Hub',
      tagline: 'E-commerce operations, store architecture & digital sales optimization on Daraz PK',
      desc: 'Complete commercial marketplace setup and ongoing optimization. Streamlined product catalog indexing, enhanced SEO search discoverability, customer review velocity, and conversion-focused listing design that drove higher sales volume.',
      url: 'https://www.daraz.pk/shop/pzg6b52d',
      category: 'E-Commerce / Marketplace',
      badge: 'MARKETPLACE',
      badgeColor: 'amber',
      accentColor: '#F85606', // Daraz brand color
      icon: ShoppingBag,
      actionLabel: 'Visit Daraz PK Store',
      metrics: [
        { label: 'Store Rating', value: '4.9 ★' },
        { label: 'Conversion Lift', value: '+40%' },
        { label: 'Catalog Health', value: '100% SEO' }
      ],
      tags: ['E-Commerce Ops', 'Daraz PK', 'Product SEO', 'Conversion CRO', 'Logistics'],
      type: 'store',
      previewType: 'ecommerce_mockup'
    },
    {
      id: 'proj-video',
      title: 'Cinematic Video Editing & Motion FX Showcase',
      tagline: 'High-retention cinematic video production with custom sound design and motion FX',
      desc: 'Masterclass video editing and motion graphics showcase engineered by Faraz. Features custom cinematic pacing, rhythmic sound design, dynamic camera keyframes, color grading, and viral retention storytelling.',
      url: 'https://drive.google.com/file/d/1bqjdpff4geRJvK9g1D98Gc1xNnflnAYA/view?usp=sharing',
      category: 'Video Production & FX',
      badge: 'VIDEO SHOWCASE',
      badgeColor: 'rose',
      accentColor: '#FF0000',
      icon: Video,
      actionLabel: 'Watch Video Showcase',
      metrics: [
        { label: 'Video Quality', value: '4K 60FPS' },
        { label: 'Pacing & FX', value: 'Dynamic' },
        { label: 'Hosting', value: 'Google Drive' }
      ],
      tags: ['Filmora', 'Adobe Premiere', 'After Effects', 'Sound Design', 'Motion FX', '4K Master'],
      type: 'video',
      previewType: 'video_showcase'
    },
    {
      id: 'proj-typingfast',
      title: 'TypingFast — Minimalist Keystroke Engine',
      tagline: 'Measure real typing speed, accuracy, and keystroke rhythm with mechanical audio feedback',
      desc: 'High-precision minimalist typing speed engine engineered by Faraz. Features real-time WPM, CPM, raw accuracy tracking, mechanical switch audio soundscapes, custom themes, and downloadable verified PDF scorecards.',
      url: '#typingfast',
      internalNav: 'typingfast',
      category: 'Developer & Speed Engine',
      badge: 'ACTIVE BBF TOOL',
      badgeColor: 'emerald',
      accentColor: '#10B981',
      icon: Keyboard,
      actionLabel: 'Launch TypingFast Tool',
      metrics: [
        { label: 'Keystroke Physics', value: 'Instant' },
        { label: 'Audio Soundscape', value: 'Mechanical' },
        { label: 'Report Certificate', value: 'Verified PDF' }
      ],
      tags: ['React', 'Web Audio API', 'Keystroke Physics', 'WPM Engine', 'PDF Scorecard'],
      type: 'tool',
      previewType: 'typingfast_mockup'
    },
    {
      id: 'proj-websnap',
      title: 'WebSnap — High-Resolution Viewport Engine',
      tagline: 'Headless full-page screenshot engine with binary image streaming and 1-click download',
      desc: 'A flagship developer tool on BUILDBYFARAZ. Converts any target URL into an instant, high-resolution scroll-length PNG with SSL validation, server-side caching, automated binary streaming, and responsive viewport emulation.',
      url: '#tools',
      internalNav: 'tools',
      category: 'Web Tool & REST API',
      badge: 'ACTIVE BBF SAAS',
      badgeColor: 'gold',
      accentColor: '#D4AF37',
      icon: Camera,
      actionLabel: 'Launch WebSnap Tool',
      metrics: [
        { label: 'Response Latency', value: '~280ms' },
        { label: 'Output Resolution', value: 'Retina HD' },
        { label: 'API Key Required', value: 'Zero (Free)' }
      ],
      tags: ['React 18', 'Vite', 'Node.js', 'Puppeteer', 'REST API', 'Binary Streaming'],
      type: 'tool',
      previewType: 'websnap_mockup'
    }
  ];

  // Core Specialized Services
  const SERVICES = [
    {
      title: 'Web Design & Development',
      desc: 'Modern, high-speed responsive web applications engineered with clean code, intuitive UI/UX, and search engine optimization.',
      skills: ['Custom React Architecture', 'Responsive Mobile Design', 'API Integration', 'Speed & Vitals Tuning'],
      accent: 'from-[#D4AF37] to-[#8B5E3C]'
    },
    {
      title: 'Video Production & Motion FX',
      desc: 'Cinematic video editing and high-impact short-form video content created for YouTube, Instagram, TikTok, and brand campaigns.',
      skills: ['Filmora & Premiere Pro', 'Dynamic Motion Captions', 'Color Grading & Pacing', 'Sound Design & Beats'],
      accent: 'from-rose-500 to-amber-600'
    },
    {
      title: 'Technical SEO & Analytics',
      desc: 'Comprehensive technical audits, Schema markup, Google Search Console optimization, and GA4 tracking to scale organic visibility.',
      skills: ['Technical Site Audits', 'Schema & Rich Snippets', 'Google Analytics / GTM', 'Keyword Ranking Strategy'],
      accent: 'from-emerald-500 to-cyan-600'
    }
  ];

  // Testimonials from portfolio
  const TESTIMONIALS = [
    {
      quote: "Muhammad delivered a stunning website that not only looks amazing but performs exceptionally well. Our traffic increased by 40% in just two months!",
      author: "E-Commerce Store Owner",
      highlight: "+40% Organic Traffic Growth"
    },
    {
      quote: "The video content created for our social media campaigns was exactly what we needed. Engagement and retention have never been higher!",
      author: "Digital Marketing Director",
      highlight: "Highest Audience Retention"
    },
    {
      quote: "Professional, efficient, and creative. Muhammad understood our vision perfectly and brought it to life beyond our expectations.",
      author: "Startup Founder & Client",
      highlight: "100% On-Time Delivery"
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-20">
      
      {/* 1. HERO & FOUNDER BIO */}
      <section className="relative pt-6 sm:pt-10 pb-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12161A] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Crown className="w-3.5 h-3.5" />
            <span>FOUNDER & CREATIVE TECHNOLOGIST</span>
          </div>

          {/* Main Name & Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-[#F5F5F5] leading-tight">
            Muhammad Faraz
            <span className="block mt-2 text-xl sm:text-2xl lg:text-3xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59F2D]">
              Web Developer • Graphic Designer • Technical SEO • Video Editor
            </span>
          </h1>

          {/* Narrative Bio */}
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Based in <strong className="text-[#F5F5F5]">Lahore, Pakistan</strong> with 2+ years of hands-on experience crafting digital experiences for local and international clients. Passionate about building fast web platforms, scaling e-commerce stores, and producing high-retention video content.
          </p>

          {/* Status & Direct Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Client Projects & Contracts</span>
            </span>

            <a
              href="https://wa.me/923284487595?text=Hello%20Muhammad%20Faraz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] text-xs font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="mailto:faggaf786678@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12161A] hover:bg-[#181F25] text-[#F5F5F5] border border-[#485563]/50 hover:border-[#D4AF37] text-xs font-mono transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>faggaf786678@gmail.com</span>
            </a>

            <a
              href="https://discord.gg/sgYfp5KaFJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2]/15 hover:bg-[#5865F2] text-[#5865F2] hover:text-white border border-[#5865F2]/40 text-xs font-mono font-bold transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              <span>Discord Community</span>
            </a>

            <a
              href="https://github.com/farazdev-star"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12161A] hover:bg-[#181F25] text-[#F5F5F5] border border-[#485563]/50 hover:border-[#D4AF37] text-xs font-mono transition-all"
            >
              <Code className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            {[
              { val: '4+', label: 'Platforms & Stores Launched' },
              { val: '2+', label: 'Years Engineering Experience' },
              { val: '40+', label: 'Client NPS / Satisfaction' },
              { val: '180K+', label: 'Tool & Media Operations' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-1">
                <div className="text-2xl font-display font-black text-[#D4AF37]">{stat.val}</div>
                <div className="text-[11px] text-[#9CA3AF] font-mono leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROJECTS SHOWCASE WITH VISUAL THUMBNAILS & IMAGE CASES */}
      <section id="projects" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#485563]/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PORTFOLIO & CASE STUDIES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#F5F5F5] tracking-tight">
              Featured Client Work & Digital Projects
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
              Live case studies spanning e-commerce marketplace operations, cinematic video production, and SaaS tooling
            </p>
          </div>

          <a
            href="https://farazdev-star.github.io/FarazDev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4AF37] hover:underline"
          >
            <span>View Full Portfolio Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project) => {
            const Icon = project.icon;
            return (
              <div 
                key={project.id}
                className="rounded-3xl bg-[#12161A] border border-[#485563]/40 overflow-hidden hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between group shadow-xl"
              >
                {/* Visual Thumbnail / Case Preview Header */}
                <div className="relative w-full h-56 bg-[#080808] border-b border-[#485563]/40 overflow-hidden flex items-center justify-center p-4">
                  
                  {/* Subtle Grid / Noise Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#485563_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                  {/* CASE 1: Daraz E-Commerce Mockup Frame */}
                  {project.previewType === 'ecommerce_mockup' && (
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#1A1108] to-[#0A0A0A] border border-[#F85606]/30 p-4 flex flex-col justify-between shadow-inner">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#F85606] flex items-center justify-center text-white font-bold text-xs shadow-md">
                            D
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#F5F5F5]">Daraz PK Verified Store</span>
                            <div className="text-[10px] text-amber-400 font-mono">★★★★★ 4.9 Rating</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#F85606]/20 text-[#F85606] text-[10px] font-mono font-bold border border-[#F85606]/40">
                          Active Marketplace
                        </span>
                      </div>

                      {/* Mock Product Catalog Preview Row */}
                      <div className="grid grid-cols-3 gap-2 my-auto">
                        {['Smart Tech', 'Accessories', 'Premium Electronics'].map((cat, i) => (
                          <div key={i} className="p-2 rounded-xl bg-[#080808]/80 border border-[#485563]/40 text-center space-y-1">
                            <div className="w-6 h-6 rounded-md bg-[#F85606]/15 mx-auto flex items-center justify-center text-[#F85606]">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[9px] font-mono text-[#F5F5F5] block truncate">{cat}</span>
                            <span className="text-[8px] text-emerald-400 font-mono">Verified Sale</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#9CA3AF] pt-1 border-t border-[#485563]/30">
                        <span>Daraz Operations & SEO</span>
                        <span className="text-[#D4AF37]">shop/pzg6b52d</span>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: Video Production & FX Showcase with Google Drive Preview */}
                  {project.previewType === 'video_showcase' && (
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#1C0A0A] via-[#0A0A0A] to-[#140808] border border-rose-500/30 p-4 flex flex-col justify-between overflow-hidden group/thumb">
                      <div className="absolute inset-0 bg-[radial-gradient(#F43F5E_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                            <Video className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#F5F5F5]">Cinematic Master Showcase</span>
                            <div className="text-[10px] text-rose-400 font-mono">Hollywood Pacing & Color FX</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
                          4K 60FPS MASTER
                        </span>
                      </div>

                      {/* Video Player Center Graphic */}
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 my-auto flex flex-col items-center justify-center gap-2 group/play cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-[0_0_25px_rgba(244,63,94,0.45)] group-hover/play:scale-110 transition-transform">
                          <div className="w-full h-full rounded-full bg-[#080808] flex items-center justify-center text-rose-400 group-hover/play:text-white transition-colors">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#F5F5F5] group-hover/play:text-[#D4AF37] transition-colors">
                          Click to Stream 4K via Google Drive
                        </span>
                      </a>

                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#9CA3AF] pt-1 border-t border-[#485563]/30">
                        <span>Filmora / After Effects FX</span>
                        <span className="text-rose-400">Google Drive High-Speed Stream</span>
                      </div>
                    </div>
                  )}

                  {/* CASE 3: TypingFast Minimalist Keystroke Mockup */}
                  {project.previewType === 'typingfast_mockup' && (
                    <div className="relative w-full h-full rounded-2xl bg-[#080808] border border-emerald-500/30 p-3 flex flex-col justify-between font-mono">
                      <div className="flex items-center justify-between pb-2 border-b border-[#485563]/30">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="px-2 py-0.5 rounded bg-[#12161A] text-[9px] text-emerald-400 border border-emerald-500/30">
                          buildbyfaraz.com/typingfast
                        </div>
                        <span className="text-[9px] text-emerald-400">ONLINE</span>
                      </div>

                      {/* Simulated WPM Terminal Display */}
                      <div className="flex-1 my-1.5 rounded-lg bg-[#12161A] border border-[#485563]/20 flex items-center justify-around p-3 text-center">
                        <div>
                          <div className="text-2xl font-bold font-mono text-[#D4AF37]">128</div>
                          <div className="text-[9px] text-[#9CA3AF] uppercase">WPM SPEED</div>
                        </div>
                        <div className="w-px h-8 bg-[#485563]/30" />
                        <div>
                          <div className="text-2xl font-bold font-mono text-emerald-400">99.4%</div>
                          <div className="text-[9px] text-[#9CA3AF] uppercase">ACCURACY</div>
                        </div>
                        <div className="w-px h-8 bg-[#485563]/30" />
                        <div>
                          <div className="text-2xl font-bold font-mono text-[#F5F5F5]">15s</div>
                          <div className="text-[9px] text-[#9CA3AF] uppercase">BURST TIME</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-[#9CA3AF] pt-1">
                        <span className="text-emerald-400">Mechanical Audio Soundscapes</span>
                        <span>Verified PDF Scorecard</span>
                      </div>
                    </div>
                  )}

                  {/* CASE 4: WebSnap Mockup Viewport */}
                  {project.previewType === 'websnap_mockup' && (
                    <div className="relative w-full h-full rounded-2xl bg-[#080808] border border-[#D4AF37]/30 p-3 flex flex-col justify-between font-mono">
                      <div className="flex items-center justify-between pb-2 border-b border-[#485563]/30">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="px-2 py-0.5 rounded bg-[#12161A] text-[9px] text-[#D4AF37] border border-[#D4AF37]/30">
                          https://github.com
                        </div>
                        <span className="text-[9px] text-emerald-400">200 OK</span>
                      </div>

                      {/* Simulated Screenshot Viewport */}
                      <div className="flex-1 my-1.5 rounded-lg bg-[#12161A] border border-[#485563]/20 flex items-center justify-center p-2 text-center">
                        <div className="space-y-1">
                          <Camera className="w-5 h-5 text-[#D4AF37] mx-auto animate-pulse" />
                          <div className="text-[10px] text-[#F5F5F5] font-bold">Full-Page Viewport Binary</div>
                          <div className="text-[8px] text-[#9CA3AF]">Zero Rate Limits • Free REST API</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-[#9CA3AF] pt-1">
                        <span>Binary Stream: ~1.26MB</span>
                        <span className="text-[#D4AF37]">Latency: 280ms</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Content Area */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        project.badgeColor === 'amber' ? 'bg-[#F85606]/15 text-[#F85606] border border-[#F85606]/30' :
                        project.badgeColor === 'rose' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                        project.badgeColor === 'purple' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                        'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                      }`}>
                        {project.badge}
                      </span>

                      <span className="text-[11px] text-[#9CA3AF] font-mono">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[#9CA3AF] leading-relaxed">
                      {project.desc}
                    </p>

                    {/* Metrics Pills */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-[#080808] border border-[#485563]/30 text-center">
                          <div className="text-xs font-bold text-[#F5F5F5] font-mono">{m.value}</div>
                          <div className="text-[9px] text-[#9CA3AF] truncate mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-[#181F25] border border-[#485563]/30 text-[10px] text-[#9CA3AF] font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Launch / Visit Action Button */}
                  <div className="pt-4 border-t border-[#485563]/30">
                    {project.internalNav ? (
                      <button
                        onClick={() => onNavigate(project.internalNav)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                      >
                        <span>{project.actionLabel || `Launch ${project.title}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#181F25] hover:bg-[#D4AF37] text-[#F5F5F5] hover:text-[#080808] border border-[#485563]/40 hover:border-[#D4AF37] text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>{project.actionLabel || 'Inspect Live Project'}</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
            SPECIALIZED SKILLSET
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#F5F5F5] tracking-tight">
            Core Client Services
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            Comprehensive creative and technical services engineered for high-performance outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((srv, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-[#12161A] border border-[#485563]/40 hover:border-[#D4AF37]/50 transition-all space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${srv.accent} flex items-center justify-center text-[#080808] font-bold shadow-md`}>
                  <Zap className="w-5 h-5 text-[#080808]" />
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] font-display">
                  {srv.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#485563]/30 space-y-2">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                  CAPABILITIES
                </span>
                <ul className="space-y-1.5">
                  {srv.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROFESSIONAL EXPERIENCE & BACKGROUND */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#12161A] border border-[#485563]/40 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
              CAREER TRACK RECORD
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F5F5]">
              Professional Experience
            </h2>
          </div>
          <div className="text-xs font-mono text-[#9CA3AF]">
            Location: <span className="text-[#F5F5F5]">Lahore, Pakistan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#D4AF37] font-mono font-bold">2022 — Present</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">Active</span>
            </div>
            <h3 className="text-base font-bold text-[#F5F5F5]">Freelance Web Developer & Video Editor</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Providing web development, e-commerce store architecture, technical SEO, and viral video editing services to clients worldwide with consistent 5-star feedback.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080808] border border-[#485563]/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#D4AF37] font-mono font-bold">2021 — Present</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px]">Academic & Tech</span>
            </div>
            <h3 className="text-base font-bold text-[#F5F5F5]">ILM School — Computer Teacher & Tech Expert</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Leading computer science education and curriculum while managing the institution's digital infrastructure, network stability, and technical solutions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
            CLIENT FEEDBACK
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#F5F5F5] tracking-tight">
            Trusted By Clients & Partners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-[#12161A] border border-[#485563]/40 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#F5F5F5] italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#485563]/30">
                <div className="text-xs font-bold text-[#D4AF37]">{t.author}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{t.highlight}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION / DIRECT DISPATCH */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#181F25] to-[#0E1114] border border-[#D4AF37]/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 mx-auto flex items-center justify-center text-[#D4AF37]">
            <MessageCircle className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#F5F5F5]">
            Have a Project or Collaboration in Mind?
          </h2>

          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Whether you need a custom web application, e-commerce optimization on Daraz, high-retention video production, or developer tools — let's build something extraordinary together.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/923284487595?text=Hello%20Muhammad%20Faraz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] text-xs font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start WhatsApp Conversation</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-full bg-[#080808] hover:bg-[#12161A] text-[#F5F5F5] border border-[#485563]/50 hover:border-[#D4AF37] text-xs font-mono transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>Open Contact Protocol Form</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
