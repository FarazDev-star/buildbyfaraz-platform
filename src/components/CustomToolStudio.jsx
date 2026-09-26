import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Terminal, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Zap 
} from 'lucide-react';

export default function CustomToolStudio({ tool, currentUser, onLogActivity }) {
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState(null);
  const [customExecuting, setCustomExecuting] = useState(false);
  const [customCopiedApi, setCustomCopiedApi] = useState(false);

  useEffect(() => {
    if (tool) {
      const sample = {
        action: 'execute',
        toolId: tool.id,
        endpoint: tool.endpoint || `/api/${tool.id}`,
        timestamp: new Date().toISOString(),
        parameters: {
          query: `Sample execution payload for ${tool.title}`,
          mode: 'production',
          format: 'json'
        }
      };
      setCustomInput(JSON.stringify(sample, null, 2));
      setCustomOutput(null);
    }
  }, [tool?.id]);

  const handleRunCustomTool = () => {
    setCustomExecuting(true);
    setTimeout(() => {
      let parsed = {};
      try {
        parsed = JSON.parse(customInput);
      } catch (e) {
        parsed = { rawInput: customInput };
      }

      const responsePayload = {
        status: 200,
        statusText: 'OK',
        tool: tool.title,
        version: tool.version || 'v1.0.0',
        author: tool.author || 'Faraz',
        executionLatency: `${Math.floor(120 + Math.random() * 160)}ms`,
        timestamp: new Date().toISOString(),
        result: {
          success: true,
          message: `Execution completed successfully for ${tool.title}.`,
          processedParameters: parsed,
          serverNode: 'edge-cluster-dubai-01',
          rateLimitRemaining: 'Unlimited'
        }
      };

      setCustomOutput(responsePayload);
      setCustomExecuting(false);

      if (onLogActivity) {
        onLogActivity({
          user: currentUser?.name || 'Member',
          role: currentUser?.role || 'user',
          action: 'Executed Community Tool',
          target: `${tool.title} (${tool.id})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: new Date().toLocaleDateString()
        });
      }
    }, 600);
  };

  if (!tool) return null;

  return (
    <div className="space-y-10">
      {/* Dynamic Playground Frame */}
      <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#485563]/30">
          <div>
            <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block mb-1">
              SANDBOX WORKBENCH // INTERACTIVE RUNNER
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F5F5]">
              {tool.title} Execution Terminal
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/35">
              ● READY FOR EXECUTION
            </span>
          </div>
        </div>

        {/* Dual Pane Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input JSON Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Code className="w-3.5 h-3.5" />
                <span>INPUT PAYLOAD (JSON)</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const sample = {
                    action: 'execute',
                    toolId: tool.id,
                    endpoint: tool.endpoint || `/api/${tool.id}`,
                    timestamp: new Date().toISOString(),
                    parameters: { query: `Reset test for ${tool.title}` }
                  };
                  setCustomInput(JSON.stringify(sample, null, 2));
                  setCustomOutput(null);
                }}
                className="hover:text-[#F5F5F5] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] font-mono text-xs focus:border-[#D4AF37] focus:outline-none leading-relaxed resize-none shadow-inner"
            />

            <button
              type="button"
              disabled={customExecuting}
              onClick={handleRunCustomTool}
              className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#C59F2D] text-[#080808] font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{customExecuting ? 'EXECUTING ON EDGE...' : 'RUN TOOL WITH PAYLOAD'}</span>
            </button>
          </div>

          {/* Output Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>LIVE API RESPONSE (JSON)</span>
              </span>
              {customOutput && (
                <span className="text-[11px] text-[#D4AF37]">
                  {customOutput.executionLatency}
                </span>
              )}
            </div>

            <div className="h-[288px] overflow-auto p-4 rounded-2xl bg-[#080808] border border-[#485563]/60 font-mono text-xs leading-relaxed select-text shadow-inner">
              {customExecuting ? (
                <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF] space-y-2">
                  <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Processing request on BUILDBYFARAZ Edge Network...</span>
                </div>
              ) : customOutput ? (
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(customOutput, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]/60 text-center space-y-2">
                  <Terminal className="w-8 h-8 text-[#485563]" />
                  <p className="text-xs max-w-xs">
                    Ready to execute. Click &quot;RUN TOOL WITH PAYLOAD&quot; to test this tool directly in the browser sandbox.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#9CA3AF] px-1">
              <span>Endpoint: <strong className="text-[#D4AF37]">{tool.endpoint || `/api/${tool.id}`}</strong></span>
              <span>Format: <strong className="text-[#F5F5F5]">application/json</strong></span>
            </div>
          </div>
        </div>

        {tool.link && tool.link.startsWith('http') && (
          <div className="rounded-2xl border border-[#485563]/40 overflow-hidden bg-[#080808] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
              <span className="text-[#D4AF37] font-bold">External Web Resource / URL Target:</span>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>Open Link Directly</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-3 rounded-xl bg-[#12161A] border border-[#485563]/30 font-mono text-xs text-[#F5F5F5] break-all">
              {tool.link}
            </div>
          </div>
        )}
      </div>

      {/* Highlights & Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">Key Highlights</h3>
          <ul className="space-y-2 text-xs text-[#9CA3AF]">
            {Array.isArray(tool.highlights) && tool.highlights.length > 0 ? (
              tool.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Zero authentication required for public execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Fast edge-delivered payload processing</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">Technical Specs</h3>
          <div className="space-y-2 text-xs font-mono text-[#9CA3AF]">
            <div className="flex justify-between border-b border-[#485563]/20 pb-1">
              <span>Method:</span>
              <span className="text-[#F5F5F5] font-bold">POST / GET</span>
            </div>
            <div className="flex justify-between border-b border-[#485563]/20 pb-1">
              <span>Content-Type:</span>
              <span className="text-[#D4AF37]">application/json</span>
            </div>
            <div className="flex justify-between border-b border-[#485563]/20 pb-1">
              <span>Rate Limit:</span>
              <span className="text-emerald-400 font-bold">Unlimited (Free)</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Version:</span>
              <span className="text-[#F5F5F5]">{tool.version || 'v1.0.0'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5] font-display">Publisher & Governance</h3>
          <div className="space-y-2 text-xs text-[#9CA3AF]">
            <div className="flex justify-between border-b border-[#485563]/20 pb-1 font-mono">
              <span>Author:</span>
              <span className="text-[#F5F5F5] font-bold">{tool.author || 'Faraz'}</span>
            </div>
            <div className="flex justify-between border-b border-[#485563]/20 pb-1 font-mono">
              <span>Role:</span>
              <span className="text-[#D4AF37]">{tool.authorRole || 'Contributor'}</span>
            </div>
            <div className="flex justify-between border-b border-[#485563]/20 pb-1 font-mono">
              <span>Published:</span>
              <span className="text-[#F5F5F5]">{tool.createdDate || 'Recent'}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">Active & Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer REST API Spec */}
      <div className="rounded-3xl bg-[#12161A] border border-[#485563]/40 overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-[#080808] border-b border-[#485563]/40 gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-mono font-bold text-[#F5F5F5]">
              {tool.title.toUpperCase()} REST API INTEGRATION
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const curlCode = `curl -X POST "https://buildbyfaraz.com${tool.endpoint || `/api/${tool.id}`}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"action": "execute", "mode": "production"}'`;
              navigator.clipboard.writeText(curlCode);
              setCustomCopiedApi(true);
              setTimeout(() => setCustomCopiedApi(false), 2000);
            }}
            className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {customCopiedApi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{customCopiedApi ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>

        <div className="p-6">
          <pre className="text-xs font-mono text-[#D4AF37] overflow-x-auto p-4 rounded-xl bg-[#080808] border border-[#485563]/30 leading-relaxed select-text">
{`# 1. cURL API Request
curl -X POST "https://buildbyfaraz.com${tool.endpoint || `/api/${tool.id}`}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "execute",
    "toolId": "${tool.id}",
    "mode": "production"
  }'

# 2. JavaScript / TypeScript Fetch Example
const response = await fetch("https://buildbyfaraz.com${tool.endpoint || `/api/${tool.id}`}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "execute" })
});
const data = await response.json();
console.log(data);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
