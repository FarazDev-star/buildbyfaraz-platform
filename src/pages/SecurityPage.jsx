import React from 'react';
import { ShieldCheck, Lock, Key, Terminal, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Crown, Mail } from 'lucide-react';

export default function SecurityPage({ onNavigate }) {
  return (
    <div className="py-12 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="space-y-4 border-b border-[#485563]/40 pb-8">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12161A] hover:bg-[#181F25] border border-[#485563]/40 text-[#9CA3AF] hover:text-[#F5F5F5] text-xs font-mono transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12161A] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SECURITY ARCHITECTURE // BUILDBYFARAZ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#F5F5F5] tracking-tight">
          Platform Security Standards
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#9CA3AF]">
          Audited & Maintained by Muhammad Faraz &bull; Defense-in-Depth Protocol
        </p>
      </div>

      {/* Main Security Container */}
      <div className="double-bezel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8 text-[#9CA3AF] text-xs sm:text-sm leading-relaxed">
          
          {/* Security Status Banner */}
          <div className="p-5 rounded-2xl bg-[#080808] border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F5F5F5] font-mono">SECURITY PROTOCOL ACTIVE</div>
                <div className="text-[11px] text-[#9CA3AF]">Zero Critical Vulnerabilities &bull; TOTP Authenticator Active &bull; SSL/TLS Encrypted</div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 self-start sm:self-auto">
              GRADE A+ DEFENSE
            </span>
          </div>

          {/* Section 1: 2FA Authenticator Defense */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">01.</span> Cryptographic 2FA Authenticator Engine
            </h2>
            <p>
              To eliminate disposable bot registrations and brute-force intrusion, BUILDBYFARAZ implements RFC 6238 Time-Based One-Time Password (TOTP) verification:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30 space-y-1.5">
                <div className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Google & Microsoft Authenticator</span>
                </div>
                <p className="text-[11px] text-[#9CA3AF]">
                  Users bind their account to an authenticator application using a unique 16-character base32 cryptographic seed key.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/30 space-y-1.5">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Clock-Drift Window Protection</span>
                </div>
                <p className="text-[11px] text-[#9CA3AF]">
                  Dynamic 30-second token verification with &plusmn;1 step tolerance checks to ensure instantaneous, spoof-proof session activation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Role-Based Access Control (RBAC) */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">02.</span> Strict Role-Based Access Control (RBAC)
            </h2>
            <p>
              System capabilities are segregated by cryptographic roles to prevent unauthorized code injection or tool manipulation:
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#080808] border border-[#D4AF37]/30 flex items-center justify-between">
                <div>
                  <span className="text-[#D4AF37] font-bold">SUPER ADMIN (Faraz):</span> Full platform governance, contributor approval, catalog purge, audit stream monitoring.
                </div>
                <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
              </div>
              <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30 flex items-center justify-between">
                <div>
                  <span className="text-[#F5F5F5] font-bold">VERIFIED EDITORS:</span> Granted individual permissions by Faraz to publish and configure developer tools.
                </div>
                <span className="text-[10px] text-amber-400">Editor</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080808] border border-[#485563]/30 flex items-center justify-between">
                <div>
                  <span className="text-[#9CA3AF] font-bold">PUBLIC / MEMBERS:</span> Complete free access to use tools, stream APIs, test speed, without write permissions to the master catalog.
                </div>
                <span className="text-[10px] text-[#9CA3AF]">User</span>
              </div>
            </div>
          </section>

          {/* Section 3: Upstream Proxy Isolation & Rate Limiting */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">03.</span> Upstream Proxy Isolation & Zero Leakage
            </h2>
            <p>
              All external tool requests (such as WebSnap screenshot rendering and Fish Audio voice synthesis) are proxied through an isolated edge layer:
            </p>
            <ul className="space-y-2 text-xs font-mono text-[#F5F5F5] pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Header Stripping:</strong> Client origin IP addresses and private session cookies are sanitized before hitting upstream endpoints.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Binary Stream Validation:</strong> Media payloads (PNG screenshots, MP3 voice buffers) are checked for MIME headers and validated before client delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Automatic Upstream Fallback:</strong> If an upstream voice model or snapshot node experiences high latency, the engine automatically fails over to redundant nodes.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Responsible Disclosure */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">04.</span> Responsible Disclosure & Bug Bounty
            </h2>
            <p>
              Security researchers and developers who discover a vulnerability in BUILDBYFARAZ are invited to submit a confidential report directly to Faraz:
            </p>
            <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/40 font-mono text-xs text-[#F5F5F5] space-y-1.5">
              <div><strong>Lead Architect:</strong> Muhammad Faraz</div>
              <div><strong>Security Inbox:</strong> <a href="mailto:faggaf786678@gmail.com" className="text-[#D4AF37] hover:underline">faggaf786678@gmail.com</a></div>
              <div><strong>Urgent WhatsApp Dispatch:</strong> <a href="https://wa.me/923284487595" className="text-emerald-400 hover:underline">+92 328 4487595</a></div>
              <div><strong>Response SLA:</strong> Valid reports acknowledged within 12 hours with priority patch turnaround.</div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
