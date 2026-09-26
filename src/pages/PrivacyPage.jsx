import React from 'react';
import { Shield, Lock, EyeOff, ArrowLeft, CheckCircle2, Terminal, HardDrive, Key } from 'lucide-react';

export default function PrivacyPage({ onNavigate }) {
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
          <Shield className="w-3.5 h-3.5" />
          <span>DATA PRIVACY PACT // BUILDBYFARAZ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#F5F5F5] tracking-tight">
          Privacy Policy & Data Principles
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#9CA3AF]">
          Effective Date: January 1, 2025 &bull; Platform Owner: Muhammad Faraz (Lahore, Pakistan)
        </p>
      </div>

      {/* Main Privacy Content Container */}
      <div className="double-bezel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8 text-[#9CA3AF] text-xs sm:text-sm leading-relaxed">
          
          {/* Commitment Highlight Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#080808] to-[#12161A] border border-[#D4AF37]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-[#D4AF37]" />
              <span>THE ZERO-DATA-COMMODIFICATION PLEDGE</span>
            </div>
            <p className="text-xs text-[#F5F5F5] leading-relaxed">
              BUILDBYFARAZ does <strong className="text-[#D4AF37]">NOT</strong> sell, rent, monetize, or broker user data to advertisers, data brokers, or third parties. We are a developer platform built by a developer for developers.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">01.</span> What Information We Process
            </h2>
            <p>
              Depending on how you interact with BUILDBYFARAZ, we process the minimum necessary data to perform requested operations:
            </p>
            <ul className="space-y-2 text-xs font-mono text-[#F5F5F5] pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Public Tool Usage:</strong> When you capture a screenshot via WebSnap or test keystrokes on TypingFast, the target URL or typing stream is processed ephemerally in volatile memory and is not stored permanently.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>SpeechSynthesizer Scripts:</strong> Script text entered into SpeechSter Studio is rendered to binary MP3 streams in real-time. We do not catalog or sell your audio scripts.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Account & Authenticator Data:</strong> When registering an account, your username, verified Gmail address, and Google Authenticator TOTP secret key are stored locally in your browser's private storage (`localStorage`).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Contact Inquiries:</strong> Messages submitted via the Contact Protocol are recorded into the platform's administrative audit queue so Faraz can respond to your dispatch.</span>
              </li>
            </ul>
          </section>

          {/* Section 2: Local-First Storage Architecture */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">02.</span> Local-First Client Storage
            </h2>
            <p>
              To maintain maximal privacy, BUILDBYFARAZ employs a <strong className="text-[#F5F5F5]">Local-First Architecture</strong>. Your custom preferences (such as favorite Fish Audio voices, SpeechSter multi-speaker scripts, recent screenshot URLs, and theme settings) reside strictly within your client machine:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#080808] border border-[#485563]/30">
                <div className="text-[#D4AF37] font-bold mb-1">Local Storage Keys</div>
                <div className="text-[11px] text-[#9CA3AF]">`bbf_current_user`, `bbf_tools_v5`, `bbf_activity_logs`</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080808] border border-[#485563]/30">
                <div className="text-[#D4AF37] font-bold mb-1">Zero Tracking Cookies</div>
                <div className="text-[11px] text-[#9CA3AF]">No third-party tracking or retargeting pixel cookies deployed.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080808] border border-[#485563]/30">
                <div className="text-[#D4AF37] font-bold mb-1">Total Client Control</div>
                <div className="text-[11px] text-[#9CA3AF]">Clearing your browser cache completely purges all stored session data.</div>
              </div>
            </div>
          </section>

          {/* Section 3: Two-Factor Authentication (2FA) Privacy */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">03.</span> Authenticator & Cryptographic Verification
            </h2>
            <p>
              Our authentication protocol enforces RFC 6238 Time-Based One-Time Password (TOTP) standards compatible with Google Authenticator and Microsoft Authenticator. The secret key is generated using cryptographic random salt and verified client-side without sharing your master biometric or external passwords.
            </p>
          </section>

          {/* Section 4: Contact & Data Deletion Requests */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">04.</span> Data Erasure & Privacy Contact
            </h2>
            <p>
              You have the right to request deletion of any contact dispatch or user log from our administrative queue at any time. Simply contact Faraz:
            </p>
            <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/40 font-mono text-xs text-[#F5F5F5] space-y-1.5">
              <div><strong>Platform Architect:</strong> Muhammad Faraz</div>
              <div><strong>Email:</strong> <a href="mailto:faggaf786678@gmail.com" className="text-[#D4AF37] hover:underline">faggaf786678@gmail.com</a></div>
              <div><strong>WhatsApp:</strong> <a href="https://wa.me/923284487595" className="text-emerald-400 hover:underline">+92 328 4487595</a></div>
              <div><strong>Community Discord:</strong> <a href="https://discord.gg/sgYfp5KaFJ" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">discord.gg/sgYfp5KaFJ</a></div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
