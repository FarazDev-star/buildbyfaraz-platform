export const INITIAL_TOOLS = [
  {
    id: 'tool-websnap',
    title: 'WebSnap — Website Screenshot Engine',
    tagline: 'Capture any website URL as an authentic full-page high-resolution screenshot',
    description: 'Direct high-fidelity website capture engine. Enter any URL to generate an instant viewport snapshot with domain SSL validation, fast binary image streaming, and one-click full PNG download.',
    category: 'Web Tools',
    categoryIcon: 'Camera',
    tags: ['Screenshot', 'PNG', 'REST API', 'Full Page Capture', 'Viewport'],
    badge: 'FLAGSHIP',
    badgeColor: 'amber',
    downloads: '184.2K',
    rating: 4.99,
    version: 'v3.2.0',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-01-15',
    endpoint: '/api/websnap',
    accentColor: '#D4AF37',
    highlights: [
      'Full scroll-length PNG capture of any public URL',
      'Direct binary streaming with real-time progress indicator',
      'One-click high-resolution PNG download and Lightbox zoom',
      'Zero API key, zero sign-up required — 100% free'
    ]
  },
  {
    id: 'tool-speechster',
    title: 'SpeechSter — AI Voice & Multi-Speaker Studio',
    tagline: 'Convert scripts and dialogue into human-like expressive speech with 20,000+ voice models',
    description: 'Next-generation AI Text-to-Speech and voice synthesis studio. Integrates 20,000+ Fish Audio models and 583 AHM neural voices. Supports multi-speaker dialogues, emotion tags [angry], [happy], (pause), auto-tagging, pitch, speed, and one-click master MP3 export.',
    category: 'AI & Audio',
    categoryIcon: 'Mic',
    tags: ['TTS', 'Fish Audio', 'Voice AI', 'Multi-Speaker', 'Emotion Tags', 'MP3'],
    badge: 'NEW // v2.1',
    badgeColor: 'gold',
    downloads: '96.4K',
    rating: 5.0,
    version: 'v2.1.0',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-03-10',
    endpoint: '/api/tts',
    accentColor: '#D4AF37',
    highlights: [
      '20,000+ Fish Audio expressive models & 583 neural voices',
      'Multi-speaker dialogue scripting with individual voice assignment',
      'Expressive audio tags [angry], [whisper], [laughs] with Auto-Tag',
      'Studio audio controls: Speed, Pitch, Volume, Normalization'
    ]
  },
  {
    id: 'tool-typingfast',
    title: 'TypingFast — Ultra-Fast Minimalist Typing Test',
    tagline: 'Measure real typing speed, accuracy, and keystroke rhythm with mechanical audio feedback',
    description: 'High-precision minimalist typing speed engine engineered by Faraz. Features real-time WPM, CPM, raw accuracy tracking, mechanical switch audio soundscapes, custom themes, multiplayer challenge mode, error heatmaps, and downloadable verified PDF scorecards.',
    category: 'Developer & Speed',
    categoryIcon: 'Keyboard',
    tags: ['Typing Test', 'WPM', 'Keystroke Physics', 'Mechanical Audio', 'Multiplayer', 'PDF Report'],
    badge: 'NEW // v1.0',
    badgeColor: 'emerald',
    downloads: '52.1K',
    rating: 4.98,
    version: 'v1.0.0',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-03-14',
    endpoint: '/typingfast',
    accentColor: '#D4AF37',
    highlights: [
      'Real-time WPM, CPM & keystroke rhythm telemetry',
      'Tactile mechanical keyboard audio soundscapes',
      'Word, timed (15s/30s/60s), quote & custom code practice modes',
      'Instant verified PDF scorecard certificate generation'
    ]
  },
  {
    id: 'tool-videodl',
    title: 'Faraz VideoGrab Pro — Universal Video Downloader',
    tagline: 'Download clean videos, audio MP3, and HD thumbnails from YouTube, TikTok, Instagram & 100+ platforms without watermarks',
    description: 'Next-generation universal media extraction studio. Engineered with dual-engine AI pipeline (yt-dlp core + TikWM zero-watermark engine). Download in 1080p Full HD, 720p HD, 480p, 360p MP4, high-bitrate MP3/M4A audio, and ultra-HD thumbnails with an integrated live preview player.',
    category: 'Media & Video',
    categoryIcon: 'DownloadCloud',
    tags: ['Video Downloader', 'No Watermark', '1080p MP4', 'MP3 Audio', 'HD Thumbnails', 'YouTube', 'TikTok', 'Instagram'],
    badge: 'NEW // v1.0',
    badgeColor: 'amber',
    downloads: '142.8K',
    rating: 4.99,
    version: 'v1.0.0',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-03-17',
    endpoint: '/api/videodl',
    accentColor: '#D4AF37',
    highlights: [
      '100% clean video downloads without watermarks across 100+ platforms',
      'Full HD 1080p, 720p, 480p, 360p MP4 progressive video streams',
      'Studio audio extraction in high-bitrate MP3 & M4A formats',
      'Ultra-HD thumbnail grabber with one-click direct save',
      'In-studio HTML5 live video preview player before download'
    ]
  },
  {
    id: 'tool-driveup',
    title: 'DriveUp — Universal Google Drive Cloud Cloner & ZIP Downloader',
    tagline: 'Clone any shared Google Drive folder with deep nested hierarchies into your personal Drive or download as an instant ZIP bundle',
    description: 'Autonomous cloud-to-cloud Google Drive folder cloning and streaming ZIP downloader. Recreates exact nested subfolder hierarchies directly inside Google cloud servers with zero local bandwidth. Features 8x-24x parallel BFS scanning, interactive tree checkboxes, inline & batch renamers, and browser-streamed STORE mode ZIP bundling.',
    category: 'Utilities',
    categoryIcon: 'FolderOpen',
    tags: ['Google Drive', 'Folder Cloner', 'Streaming ZIP', 'OAuth 2.0', 'Cloud-to-Cloud', 'Batch Renamer'],
    badge: 'NEW // v6.8.2',
    badgeColor: 'blue',
    downloads: '88.5K',
    rating: 4.99,
    version: 'v6.8.2',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-03-20',
    endpoint: '/api/driveup',
    accentColor: '#3B82F6',
    highlights: [
      'Zero-bandwidth cloud-to-cloud cloning directly on Google servers',
      '8x-24x parallel BFS scanner handles 10,000+ files and deep nested folders',
      'Interactive folder tree with selective checkboxes and inline file renaming',
      'Batch renamer: Prefix/Suffix, Sequential numbering (Video 01), Find & Replace',
      'Instant browser-streamed ZIP download in zero-CPU STORE mode',
      'Micro-checkpoint persistence (Power outage and load-shedding protected)'
    ]
  },
  {
    id: 'tool-tempster',
    title: 'TempSter — Disposable Mailbox & OTP Receiver',
    tagline: 'Generate temporary disposable email addresses with real-time OTP receipt',
    description: 'Autonomous zero-spam temporary mailbox generator. Receive activation links, OTPs, and verification emails in a live streamed inbox without providing your personal credentials.',
    category: 'Security & API',
    categoryIcon: 'Mail',
    tags: ['Temp Mail', 'Disposable', 'OTP', 'No Spam', 'REST API'],
    badge: 'PIPELINE',
    badgeColor: 'rose',
    downloads: '14.2K',
    rating: 4.9,
    version: 'v1.0.0 (Pipeline)',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-02-20',
    endpoint: '/api/mail',
    accentColor: '#F43F5E',
    isOperational: false,
    highlights: [
      'Instant disposable email address generation',
      'Live WebSocket OTP and verification code streaming',
      'Zero spam retention with 1-hour auto shredding'
    ]
  },
  {
    id: 'tool-pixelster',
    title: 'PixelSter — Neural Concept & AI Art Studio',
    tagline: 'Generate AI imagery and visual assets from natural language prompts',
    description: 'State-of-the-art text-to-image neural synthesis studio. Create photorealistic visuals, marketing graphics, and vector concepts with multi-aspect ratio rendering and instant downloads.',
    category: 'AI & Audio',
    categoryIcon: 'Palette',
    tags: ['AI Art', 'Diffusion', 'Concept Art', 'Batch', 'PNG Export'],
    badge: 'PIPELINE',
    badgeColor: 'purple',
    downloads: '28.6K',
    rating: 4.95,
    version: 'v1.0.0 (Pipeline)',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-02-28',
    endpoint: '/api/tti',
    accentColor: '#A855F7',
    isOperational: false,
    highlights: [
      'High-speed latent diffusion image generation',
      'Multiple aspect ratios (1:1, 16:9, 9:16, 4:3)',
      'Prompt enhancer and style presets'
    ]
  },
  {
    id: 'tool-cinesearch',
    title: 'CineSearch — Cinema Intelligence & Metadata',
    tagline: 'Live query database for cinema, box office, cast, and IMDb rankings',
    description: 'Instant movie and series search engine. Fetches high-res posters, trailers, storyline metadata, and Rotten Tomatoes/IMDb ratings in unified high-speed JSON payloads.',
    category: 'Media & Video',
    categoryIcon: 'Film',
    tags: ['Cinema', 'IMDb', 'Trailers', 'Streaming', 'Metadata'],
    badge: 'PIPELINE',
    badgeColor: 'amber',
    downloads: '19.8K',
    rating: 4.92,
    version: 'v1.0.0 (Pipeline)',
    author: 'Faraz',
    authorRole: 'Founder & Lead Architect',
    createdDate: '2025-02-15',
    endpoint: '/api/cinema',
    accentColor: '#F59E0B',
    isOperational: false,
    highlights: [
      'Universal movie and TV show lookup',
      'Direct IMDb and TMDb synced ratings',
      'High-resolution promotional posters and trailers'
    ]
  }
];

export const UPCOMING_TOOLS = [
  {
    id: 'up-cine',
    title: 'CineSearch — Cinema Intelligence',
    desc: 'Live query database for movies and series with posters, trailers, and IMDb rankings.',
    category: 'Media',
    badge: 'NEXT RELEASE'
  },
  {
    id: 'up-mail',
    title: 'TempSter — Disposable Mailbox',
    desc: 'Disposable email generator for testing signups with live OTP verification code dispatcher.',
    category: 'Security',
    badge: 'PIPELINE'
  },
  {
    id: 'up-qr',
    title: 'QR Code Vector Studio',
    desc: 'Instant high-resolution SVG and PNG QR code generator for URLs, Wi-Fi, and text.',
    category: 'Utility',
    badge: 'PIPELINE'
  }
];

export const CATEGORIES = [
  'All',
  'Media & Video',
  'AI & Audio',
  'Web Tools',
  'Developer & Speed',
  'Upcoming Pipeline'
];