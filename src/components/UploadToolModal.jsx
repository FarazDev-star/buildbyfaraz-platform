import React, { useState } from 'react';
import { X, Upload, Plus, Sparkles, Check, FileCode, Code, ShieldCheck, Lock, ArrowRight, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UploadToolModal({ isOpen, onClose, onAddTool, currentUser, onRequestAccess, onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Developer',
    tags: 'API, Utility, Developer, Web',
    badge: 'NEW',
    version: 'v1.0.0',
    link: '',
    author: currentUser?.name || 'Faraz',
    authorRole: currentUser?.role === 'admin' ? 'Founder & Lead Architect' : 'Approved Contributor',
    accentColor: '#D4AF37',
    highlights: 'Zero authentication required\nFast browser execution\nFree public REST endpoint'
  });

  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [fileSizeText, setFileSizeText] = useState('1.5 MB');
  const [requestedAccess, setRequestedAccess] = useState(false);

  if (!isOpen) return null;

  const canUserUpload = currentUser && (currentUser?.role === 'admin' || currentUser?.role === 'editor' || currentUser?.canUpload);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeText(`${sizeInMb} MB`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTool = {
      id: `tool-${Date.now()}`,
      title: formData.title,
      tagline: formData.tagline || 'Next-generation high-performance utility',
      description: formData.description || 'Custom engineered software utility published via BUILDBYFARAZ.',
      category: formData.category,
      categoryIcon: formData.category === 'Developer' ? 'Code' : formData.category === 'Media' ? 'Film' : 'QrCode',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      badge: formData.badge,
      badgeColor: 'amber',
      downloads: '1.2K',
      rating: 5.0,
      version: formData.version || 'v1.0.0',
      author: formData.author || currentUser?.name || 'Faraz',
      authorRole: formData.authorRole || (currentUser?.role === 'admin' ? 'Lead Architect' : 'Contributor'),
      createdDate: new Date().toISOString().split('T')[0],
      link: formData.link || '#',
      fileSize: fileSizeText,
      fileName: uploadedFileName,
      endpoint: '/api/' + formData.title.toLowerCase().replace(/[^a-z0-9]/g, ''),
      accentColor: formData.accentColor,
      highlights: formData.highlights.split('\n').filter(h => h.trim())
    };

    onAddTool(newTool);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F5F5F5', '#8B5E3C']
    });

    onClose();
  };

  const handleRequest = () => {
    if (!currentUser) return;
    setRequestedAccess(true);
    if (onRequestAccess) {
      onRequestAccess(currentUser.email);
    }
    setTimeout(() => {
      alert(`Access request submitted for ${currentUser.email}! Platform administrators can approve your permissions from the Admin Console.`);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 double-bezel shadow-[0_25px_60px_-15px_rgba(212,175,55,0.25)]">
        <div className="double-bezel-inner p-6 sm:p-8 max-h-[90vh] overflow-y-auto bg-[#12161A] border border-[#485563]/40">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#485563]/40 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider">
                  BBF TOOL INGESTION
                </span>
                <span className="text-xs text-[#9CA3AF] font-mono">FORGE // DEPLOY</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-[#F5F5F5] tracking-tight">
                Upload & Deploy Your Tool
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF]">
                Publish converters, AI engines, developer utilities, or REST APIs directly to the BBF platform.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-all border border-[#485563]/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CASE 1: USER NOT LOGGED IN AT ALL -> STRICT AUTH GATE */}
          {!currentUser ? (
            <div className="py-8 px-6 text-center space-y-5 bg-[#080808] border border-[#485563]/40 rounded-2xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Lock className="w-8 h-8" />
              </div>
              
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-[#F5F5F5] font-heading">
                  Authentication Required
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  You must be logged into a verified <strong className="text-[#F5F5F5]">@gmail.com</strong> account to submit upload requests or publish developer tools. Anonymous or guest requests are strictly disabled.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12161A] border border-[#485563]/30 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Authenticator Verification:</span>
                </div>
                <ul className="text-[#9CA3AF] list-disc list-inside space-y-1 text-[11px]">
                  <li>Sign in with your registered credentials.</li>
                  <li>Or create a new account and verify your real email via the 6-digit Authenticator OTP.</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('login');
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : !canUserUpload ? (
            /* CASE 2: USER IS LOGGED IN BUT DOES NOT HAVE UPLOAD PERMISSION */
            <div className="py-8 px-6 text-center space-y-5 bg-[#080808] border border-[#485563]/40 rounded-2xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Shield className="w-8 h-8" />
              </div>
              
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-[#F5F5F5] font-heading">
                  Contributor Permission Required
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  You are logged in as <strong className="text-[#F5F5F5]">{currentUser.name || currentUser.email}</strong> (<span className="text-[#D4AF37] font-mono">{currentUser.email}</span>). Contributor upload access is required to publish tools to the public catalog.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12161A] border border-[#485563]/30 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Identity Detected:</span>
                </div>
                <div className="text-[#9CA3AF] text-[11px] leading-relaxed">
                  Click the button below to submit a formal Contributor Request for your verified account (<strong className="text-[#F5F5F5]">{currentUser.email}</strong>). Faraz will review and grant upload permissions in the Admin Console.
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRequest}
                  disabled={requestedAccess}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-60"
                >
                  {requestedAccess ? '✓ Request Submitted' : `Request Access for ${currentUser.email.split('@')[0]}`}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            /* ALLOWED: Tool Upload Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tool Title & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-1.5">
                    Tool / API Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PixelGen — High-Speed AI Renderer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-[#9CA3AF]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                    Version
                  </label>
                  <input
                    type="text"
                    placeholder="v1.0.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                  Catchy Subheadline / Tagline
                </label>
                <input
                  type="text"
                  placeholder="One sentence describing what this tool solves..."
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] text-sm focus:border-[#D4AF37] outline-none"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Media">Media</option>
                    <option value="AI & Audio">AI & Audio</option>
                    <option value="Utility">Utility</option>
                    <option value="Documents">Documents</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                    Catalog Badge
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] text-sm focus:border-[#D4AF37] outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="HOT">HOT</option>
                    <option value="REST API">REST API</option>
                    <option value="POPULAR">POPULAR</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                  Detailed Documentation
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain input parameters, supported formats, and performance benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] text-sm focus:border-[#D4AF37] outline-none resize-none"
                />
              </div>

              {/* Drag & Drop File */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                  Upload Executable / Script / API Spec (Optional)
                </label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#485563]/60 rounded-2xl cursor-pointer hover:border-[#D4AF37] transition-all bg-[#080808]/50 group">
                  <Upload className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#D4AF37] group-hover:scale-110 transition-all mb-2" />
                  <span className="text-xs text-[#F5F5F5] font-semibold">
                    {uploadedFileName ? uploadedFileName : 'Click to browse script or ZIP package'}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] font-mono mt-1">
                    Supports .js, .py, .zip, .json, .wasm up to 50MB
                  </span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#485563]/40">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Publish to BBF Catalog
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
