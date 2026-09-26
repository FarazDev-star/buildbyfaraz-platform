import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Globe, Sparkles, AlertCircle, Shield, Code } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage({ onMessageSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tool Suggestion / Collaboration');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    
    // Save to local inquiries so Admin can read in Admin Console
    const newInquiry = {
      name: name.trim() || 'Anonymous Developer',
      email: email.trim(),
      subject,
      message: message.trim(),
      date: new Date().toLocaleDateString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bbf_inquiries') || '[]');
      localStorage.setItem('bbf_inquiries', JSON.stringify([newInquiry, ...existing]));
      if (onMessageSubmitted) onMessageSubmitted(newInquiry);
    } catch (err) {
      console.warn(err);
    }

    setSubmitted(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F5F5F5', '#8B5E3C']
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CONNECT WITH BUILDBYFARAZ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-[#F5F5F5] tracking-tight">
          Initiate Contact Protocol
        </h1>

        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-xl mx-auto">
          Have a tool suggestion, public API integration question, custom software inquiry, or feedback? Send a direct dispatch to Faraz.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 sm:p-8 bg-[#12161A] space-y-6">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                  DIRECT CHANNELS
                </span>
                <h3 className="text-xl font-display font-bold text-[#F5F5F5]">
                  Get in Touch
                </h3>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <a 
                  href="mailto:faggaf786678@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37]/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">DIRECT EMAIL</span>
                    <span className="text-[#F5F5F5] font-medium group-hover:text-[#D4AF37] transition-colors">faggaf786678@gmail.com</span>
                  </div>
                </a>

                <a 
                  href="https://wa.me/923284487595?text=Hello%20Muhammad%20Faraz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080808] border border-[#485563]/40 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">WHATSAPP DIRECT</span>
                    <span className="text-[#F5F5F5] font-medium group-hover:text-emerald-400 transition-colors">+92 328 4487595</span>
                  </div>
                </a>

                <a 
                  href="https://discord.gg/sgYfp5KaFJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080808] border border-[#5865F2]/40 hover:border-[#5865F2] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#5865F2]/15 flex items-center justify-center text-[#5865F2] shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[#9CA3AF] block text-[10px]">COMMUNITY DISCORD</span>
                    <span className="text-[#F5F5F5] font-medium group-hover:text-[#5865F2] transition-colors">discord.gg/sgYfp5KaFJ</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Join</span>
                </a>

                <a 
                  href="https://github.com/farazdev-star"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37]/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#485563]/25 flex items-center justify-center text-[#F5F5F5] shrink-0 group-hover:scale-105 transition-transform">
                    <Code className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">OFFICIAL GITHUB</span>
                    <span className="text-[#F5F5F5] font-medium group-hover:text-[#D4AF37] transition-colors">github.com/farazdev-star</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080808] border border-[#485563]/40">
                  <div className="w-9 h-9 rounded-lg bg-[#8B5E3C]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">LOCATION</span>
                    <span className="text-[#F5F5F5] font-medium">Lahore, Pakistan</span>
                  </div>
                </div>

                <a 
                  href="https://farazdev-star.github.io/FarazDev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080808] border border-[#485563]/40 hover:border-[#D4AF37]/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#485563]/25 flex items-center justify-center text-[#9CA3AF] shrink-0 group-hover:text-[#D4AF37] transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">PORTFOLIO WEBSITE</span>
                    <span className="text-[#F5F5F5] font-medium group-hover:text-[#D4AF37] transition-colors">farazdev-star.github.io/FarazDev</span>
                  </div>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30 text-xs text-[#9CA3AF] space-y-1">
                <div className="text-[#D4AF37] font-semibold">Priority SLA:</div>
                <p>Developer and tool contributor inquiries are reviewed directly within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12161A] border border-[#485563]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#F5F5F5] font-heading">
                  Dispatch Received
                </h3>
                <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#F5F5F5]">{name || 'developer'}</strong>. Your message has been routed to Faraz and logged in the administrative queue.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F5F5] font-heading mb-1">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    All submissions are delivered straight to platform operations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faraz Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                    {emailError && <p className="text-[11px] text-red-400 mt-1">{emailError}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] focus:border-[#D4AF37] outline-none"
                  >
                    <option value="Tool Suggestion / Collaboration">Tool Suggestion / Collaboration</option>
                    <option value="Request Upload / Contributor Access">Request Upload / Contributor Access</option>
                    <option value="Bug Report / Tool Issue">Bug Report / Tool Issue</option>
                    <option value="Custom API Integration">Custom API Integration</option>
                    <option value="Other Inquiries">Other Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your query, tool suggestion, or contributor profile..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-4 text-xs rounded-xl bg-[#080808] border border-[#485563]/50 text-[#F5F5F5] placeholder-[#9CA3AF]/50 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Faraz</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
