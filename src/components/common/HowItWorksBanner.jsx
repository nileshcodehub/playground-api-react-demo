import { useState } from "react";

export function HowItWorksBanner({
  title,
  subtitle,
  badge = "Playground API Feature",
  endpoint = "GET /api/v1/posts",
  description,
  codeSnippet,
  payloadExample,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl bg-[#131722] border border-white/8 p-3.5 sm:p-4 text-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {badge}
          </span>
          <code className="px-1.5 py-0.5 rounded bg-black/40 text-slate-400 font-mono text-[11px] border border-white/5">
            {endpoint}
          </code>
          <span className="text-slate-300 font-medium truncate max-w-md hidden md:inline">
            {title ? `${title} — ` : ""}
            {subtitle || description}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 shrink-0 self-start sm:self-auto"
        >
          <span>{isOpen ? "✕ Close Explainer" : "⚡ View API Code"}</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-white/8 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Behind The Scenes
              </h4>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
                <p>
                  <strong>1. Isolated Sandbox:</strong> Mutations in this UI
                  send requests with your session token (
                  <code className="text-emerald-400 font-mono">
                    pg_identity
                  </code>
                  ).
                </p>
                <p>
                  <strong>2. Zero Collisions:</strong> Your changes persist in
                  your private overlay without affecting other users.
                </p>
                <p>
                  <strong>3. State Retention:</strong> Refreshing the page
                  preserves your changes.
                </p>
              </div>

              {payloadExample && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Payload Sample
                  </span>
                  <pre className="p-2.5 rounded-lg bg-black/50 border border-white/5 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                    {JSON.stringify(payloadExample, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Integration Snippet
                </h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 hover:text-white border border-white/10 font-mono transition-colors cursor-pointer"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-56">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HowItWorksBanner;
