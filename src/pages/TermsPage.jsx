import React from 'react';
import { Shield, FileText, ArrowLeft, CheckCircle2, AlertCircle, Mail, MessageSquare, Terminal, Globe } from 'lucide-react';

export default function TermsPage({ onNavigate }) {
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
          <Terminal className="w-3.5 h-3.5" />
          <span>LEGAL PROTOCOL // BUILDBYFARAZ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#F5F5F5] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#9CA3AF]">
          Effective Date: January 1, 2025 &bull; Last Updated: March 2025 &bull; Platform: BUILDBYFARAZ (BBF)
        </p>
      </div>

      {/* Main Legal Content Container */}
      <div className="double-bezel shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="double-bezel-inner p-6 sm:p-10 bg-[#12161A] border border-[#485563]/40 space-y-8 text-[#9CA3AF] text-xs sm:text-sm leading-relaxed">
          
          {/* Section 1: Overview & Acceptance */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">01.</span> Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong className="text-[#F5F5F5]">BUILDBYFARAZ</strong> (accessible at buildbyfaraz.com and local distribution endpoints), an open developer tools suite and REST API platform founded and maintained by <strong className="text-[#F5F5F5]">Muhammad Faraz</strong> based in Lahore, Pakistan.
            </p>
            <p>
              By accessing, browsing, interacting with tools (including WebSnap, SpeechSter, TypingFast), or making programmatic calls to our REST APIs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the platform immediately.
            </p>
          </section>

          {/* Section 2: Zero-Auth Public API Fair Usage Policy */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">02.</span> Zero-Auth API Fair Usage Policy
            </h2>
            <p>
              BUILDBYFARAZ proudly delivers zero-authentication REST APIs to empower creators, developers, and researchers worldwide. To preserve continuous 99.9% uptime for the entire community, you agree to adhere to the following fair usage standards:
            </p>
            <ul className="space-y-2 text-xs font-mono text-[#F5F5F5] pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>No Denial of Service (DoS):</strong> Automated flooding, DDoS attacks, or intentionally suffocating tool endpoints is strictly prohibited.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Reasonable Burst Rates:</strong> Client scripts should maintain polite request pacing (maximum 60 requests per minute per IP for WebSnap screenshot generation and SpeechSter synthesis).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Lawful Content Only:</strong> The screenshot capture engine and voice synthesis tools must not be leveraged to target illegal, non-consensual, infringing, or malicious content.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Tool Catalog & User Submissions */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">03.</span> Tool Upload & Contributor Permissions
            </h2>
            <p>
              BUILDBYFARAZ allows verified contributors to submit web tools to the ecosystem. Upload privileges are guarded by Faraz through an administrative permission protocol:
            </p>
            <p>
              Contributors who upload tools grant BUILDBYFARAZ a non-exclusive license to host, display, and execute the tool within the sandbox catalog. Uploaded tools must not contain keyloggers, unauthorized trackers, malicious obfuscated JavaScript, or crypto miners. The platform reserves the unilateral right to remove any tool violating safety guidelines.
            </p>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">04.</span> Intellectual Property & Attribution
            </h2>
            <p>
              The BUILDBYFARAZ brand, logo, UI/UX architecture, and bespoke software tools (WebSnap, SpeechSter Studio, TypingFast) are the intellectual property of <strong className="text-[#F5F5F5]">Muhammad Faraz</strong>. Third-party neural voice models (including Fish Audio and edge synthesizers) belong to their respective creators and are integrated under open community and research API interfaces.
            </p>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">05.</span> Disclaimer & Limitation of Liability
            </h2>
            <p>
              The platform and all tools are provided on an <strong className="text-[#F5F5F5]">"AS IS" and "AS AVAILABLE"</strong> basis. While Faraz continuously ensures high fidelity, low latency, and stability, BUILDBYFARAZ disclaims all warranties regarding server uptime, upstream API availability, or external network latency. In no event shall Muhammad Faraz or BUILDBYFARAZ be liable for indirect, incidental, or consequential damages resulting from tool usage.
            </p>
          </section>

          {/* Section 6: Official Inquiries & Governing Jurisdiction */}
          <section className="space-y-3 pt-4 border-t border-[#485563]/30">
            <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5] font-display flex items-center gap-2">
              <span className="text-[#D4AF37] font-mono">06.</span> Direct Contact & Legal Inquiries
            </h2>
            <p>
              For legal inquiries, partnership terms, or questions regarding these Terms of Service, please reach out directly to the founder:
            </p>
            <div className="p-4 rounded-xl bg-[#080808] border border-[#485563]/40 font-mono text-xs text-[#F5F5F5] space-y-1.5">
              <div><strong>Founder:</strong> Muhammad Faraz</div>
              <div><strong>Location:</strong> Lahore, Pakistan</div>
              <div><strong>Email:</strong> <a href="mailto:faggaf786678@gmail.com" className="text-[#D4AF37] hover:underline">faggaf786678@gmail.com</a></div>
              <div><strong>WhatsApp:</strong> <a href="https://wa.me/923284487595" className="text-emerald-400 hover:underline">+92 328 4487595</a></div>
              <div><strong>Discord:</strong> <a href="https://discord.gg/sgYfp5KaFJ" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">discord.gg/sgYfp5KaFJ</a></div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
