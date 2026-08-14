import { useState, useMemo, useEffect } from "react";
import { mediaApi } from "@/api/media";

const AVATAR_PRESETS = [
  "alex.dev",
  "sarah_connor",
  "neo_matrix",
  "eva_ai",
  "quantum_coder",
  "cyber_samurai",
  "alice.smith",
  "bruce_wayne",
  "tony_stark",
  "diana_prince",
  "ada_lovelace",
  "turing_machine",
  "apollo_11",
  "stellar_blade",
  "pixel_master",
];

const THUMBNAIL_PRESETS = [
  { seed: "react-19-guide", text: "React 19 Deep Dive", width: 1200, height: 630 },
  { seed: "graphql-mastery", text: "GraphQL API Sandbox", width: 1200, height: 630 },
  { seed: "cloud-architecture", text: "Cloud Microservices", width: 800, height: 450 },
  { seed: "database-indexing", text: "PostgreSQL & Prisma Indexing", width: 600, height: 400 },
  { seed: "typescript-enterprise", text: "Enterprise TypeScript 5.8", width: 600, height: 400 },
  { seed: "sandbox-isolation", text: "Session State Isolation", width: 600, height: 400 },
];

const SIZE_PRESETS = [32, 64, 96, 128, 256, 512];

const DIMENSION_PRESETS = [
  { label: "1200 × 630 (OG / Social)", width: 1200, height: 630 },
  { label: "800 × 450 (16:9 Media)", width: 800, height: 450 },
  { label: "600 × 400 (Blog Card)", width: 600, height: 400 },
  { label: "400 × 400 (1:1 Square)", width: 400, height: 400 },
];

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === "success"
      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
      : "bg-amber-500/20 border-amber-500/40 text-amber-300";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
    >
      <span>{type === "success" ? "✓" : "ℹ"}</span>
      <span>{message}</span>
    </div>
  );
}

const Media = () => {
  const [activeTab, setActiveTab] = useState("avatars"); // "avatars" | "thumbnails" | "gallery" | "specs"
  const [toast, setToast] = useState(null);

  // Avatar state
  const [avatarSeed, setAvatarSeed] = useState("nilesh_developer");
  const [avatarSize, setAvatarSize] = useState(160);
  const [avatarRounded, setAvatarRounded] = useState(true);
  const [avatarCodeTab, setAvatarCodeTab] = useState("url"); // "url" | "html" | "jsx" | "markdown" | "svg"
  const [avatarRawSvg, setAvatarRawSvg] = useState("");

  // Thumbnail state
  const [thumbSeed, setThumbSeed] = useState("react-19-mastery");
  const [thumbText, setThumbText] = useState("React 19 Server Components");
  const [thumbWidth, setThumbWidth] = useState(1200);
  const [thumbHeight, setThumbHeight] = useState(630);
  const [thumbCodeTab, setThumbCodeTab] = useState("url");
  const [thumbRawSvg, setThumbRawSvg] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Compute live URLs
  const avatarUrl = useMemo(() => {
    return mediaApi.getAvatarUrl(avatarSeed, {
      size: avatarSize,
      rounded: avatarRounded,
    });
  }, [avatarSeed, avatarSize, avatarRounded]);

  const thumbUrl = useMemo(() => {
    return mediaApi.getThumbnailUrl(thumbSeed, {
      width: thumbWidth,
      height: thumbHeight,
      text: thumbText,
    });
  }, [thumbSeed, thumbWidth, thumbHeight, thumbText]);

  // Load avatar raw SVG when code tab is active
  useEffect(() => {
    if (avatarCodeTab !== "svg") return;
    let active = true;

    const fetchAvatarSvg = async () => {
      try {
        const svg = await mediaApi.getAvatarSvg(avatarSeed, {
          size: avatarSize,
          rounded: avatarRounded,
        });
        if (active) setAvatarRawSvg(svg);
      } catch {
        if (active) setAvatarRawSvg("<!-- Failed to load SVG -->");
      }
    };

    fetchAvatarSvg();
    return () => {
      active = false;
    };
  }, [avatarSeed, avatarSize, avatarRounded, avatarCodeTab]);

  // Load thumbnail raw SVG when code tab is active
  useEffect(() => {
    if (thumbCodeTab !== "svg") return;
    let active = true;

    const fetchThumbSvg = async () => {
      try {
        const svg = await mediaApi.getThumbnailSvg(thumbSeed, {
          width: thumbWidth,
          height: thumbHeight,
          text: thumbText,
        });
        if (active) setThumbRawSvg(svg);
      } catch {
        if (active) setThumbRawSvg("<!-- Failed to load SVG -->");
      }
    };

    fetchThumbSvg();
    return () => {
      active = false;
    };
  }, [thumbSeed, thumbWidth, thumbHeight, thumbText, thumbCodeTab]);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    } catch {
      showToast("Failed to copy", "warn");
    }
  };

  const rollRandomAvatarSeed = () => {
    const pool = AVATAR_PRESETS.filter((s) => s !== avatarSeed);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setAvatarSeed(chosen);
  };

  const handleDownloadAvatar = () => {
    mediaApi.downloadSvg(avatarUrl, `avatar-${avatarSeed}.svg`);
    showToast(`Downloading avatar-${avatarSeed}.svg!`);
  };

  const handleDownloadThumbnail = () => {
    mediaApi.downloadSvg(thumbUrl, `thumbnail-${thumbSeed}.svg`);
    showToast(`Downloading thumbnail-${thumbSeed}.svg!`);
  };

  return (
    <div className="space-y-8">
      {/* ── Executive Header Banner ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-purple-500 to-sky-500 opacity-80" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Dynamic Vector Asset Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Media & Dynamic Avatar Studio
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generate crisp, scalable vector SVG avatars and landscape cover
              thumbnails with deterministic gradient color hashing, zero external
              dependencies, and edge cache headers.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#080e1a] border border-[#1e293b] text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              image/svg+xml
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#080e1a] border border-[#1e293b] text-xs font-mono text-amber-300">
              ⚡ Edge Cached 86400s
            </span>
          </div>
        </div>
      </div>

      {/* ── Executive Metric Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Vector Precision
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            100% SVG
          </div>
          <div className="text-[11px] text-slate-400">Infinite crisp scaling</div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Color Hashing
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
            Deterministic
          </div>
          <div className="text-[11px] text-slate-400">Stable seed palettes</div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Render Latency
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono">
            &lt; 5ms
          </div>
          <div className="text-[11px] text-slate-400">Pure procedural generation</div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Gateway Endpoints
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            2 Generators
          </div>
          <div className="text-[11px] text-slate-400">/avatars & /thumbnails</div>
        </div>
      </div>

      {/* ── Studio Navigation Tabs ── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0f172a] border border-[#1e293b] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("avatars")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "avatars"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>👤</span>
          <span>Avatar Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("thumbnails")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "thumbnails"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🖼️</span>
          <span>Cover & Thumbnail Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "gallery"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>✨</span>
          <span>Inspiration Gallery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "specs"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>⚡</span>
          <span>API Specification</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────── TAB 1: AVATARS STUDIO */}
      {activeTab === "avatars" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-5 space-y-6 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl">
            <div className="border-b border-[#1e293b] pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🎨</span>
                <span>Avatar Parameters</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize seed identifier, pixel dimensions, and shape mask.
              </p>
            </div>

            {/* Seed Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Seed String / Identifier <span className="text-amber-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={rollRandomAvatarSeed}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>🎲 Roll Random</span>
                </button>
              </div>
              <input
                type="text"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                placeholder="e.g. bret, alice, user-10"
                className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Determines deterministic gradient hash and rendered initials.
              </p>
            </div>

            {/* Seed Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Popular Presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_PRESETS.slice(0, 8).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAvatarSeed(preset)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      avatarSeed === preset
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-[#080e1a] text-slate-400 hover:text-white border border-[#1e293b]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Slider & Presets */}
            <div className="space-y-2 pt-2 border-t border-[#1e293b]">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">Dimension Size</label>
                <span className="font-mono text-amber-400 font-bold">
                  {avatarSize} × {avatarSize} px
                </span>
              </div>
              <input
                type="range"
                min="32"
                max="512"
                step="8"
                value={avatarSize}
                onChange={(e) => setAvatarSize(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 pt-1">
                {SIZE_PRESETS.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setAvatarSize(sz)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      avatarSize === sz
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                        : "bg-[#080e1a] text-slate-400 hover:text-white border border-[#1e293b]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Toggle */}
            <div className="space-y-2 pt-2 border-t border-[#1e293b]">
              <label className="text-xs font-semibold text-slate-300">
                Avatar Border Shape
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAvatarRounded(true)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    avatarRounded
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-xs"
                      : "bg-[#080e1a] border-[#1e293b] text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border-2 border-current" />
                  <span>Circular (rounded=true)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarRounded(false)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !avatarRounded
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-xs"
                      : "bg-[#080e1a] border-[#1e293b] text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="w-4 h-4 rounded-md border-2 border-current" />
                  <span>Squircle (rounded=false)</span>
                </button>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#1e293b] flex items-center gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(avatarUrl, "Direct Avatar URL")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔗 Copy Direct URL</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadAvatar}
                className="px-4 py-2.5 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Download SVG"
              >
                <span>⬇ Download SVG</span>
              </button>
            </div>
          </div>

          {/* Live Preview & Code Generator */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Canvas Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden group">
              {/* Subtle background grid pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#94a3b8 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-2 rounded-3xl bg-[#080e1a] border border-[#1e293b] shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={avatarUrl}
                    alt={avatarSeed}
                    width={Math.min(avatarSize, 220)}
                    height={Math.min(avatarSize, 220)}
                    className="object-contain"
                    style={{
                      width: `${Math.min(avatarSize, 220)}px`,
                      height: `${Math.min(avatarSize, 220)}px`,
                    }}
                  />
                </div>

                <div className="text-center space-y-1">
                  <div className="text-sm font-bold text-white font-mono">
                    seed: "{avatarSeed}"
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {avatarSize} × {avatarSize} px · {avatarRounded ? "Circular" : "Squircle"}
                  </div>
                </div>
              </div>
            </div>

            {/* Code Snippets Panel */}
            <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-1.5">
                  {[
                    { key: "url", label: "Direct URL" },
                    { key: "jsx", label: "React JSX" },
                    { key: "html", label: "HTML <img>" },
                    { key: "markdown", label: "Markdown" },
                    { key: "svg", label: "Raw SVG" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setAvatarCodeTab(tab.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        avatarCodeTab === tab.key
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    let code = avatarUrl;
                    if (avatarCodeTab === "jsx") {
                      code = `<img src="${avatarUrl}" alt="${avatarSeed}" width={${avatarSize}} height={${avatarSize}} />`;
                    } else if (avatarCodeTab === "html") {
                      code = `<img src="${avatarUrl}" alt="${avatarSeed}" width="${avatarSize}" height="${avatarSize}" />`;
                    } else if (avatarCodeTab === "markdown") {
                      code = `![Avatar for ${avatarSeed}](${avatarUrl})`;
                    } else if (avatarCodeTab === "svg") {
                      code = avatarRawSvg;
                    }
                    copyToClipboard(code, "Snippet");
                  }}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1"
                >
                  <span>📋 Copy Code</span>
                </button>
              </div>

              {/* Code output area */}
              <div className="p-4 rounded-xl bg-[#080e1a] border border-[#1e293b] font-mono text-xs text-amber-300/90 overflow-x-auto whitespace-pre">
                {avatarCodeTab === "url" && avatarUrl}
                {avatarCodeTab === "jsx" &&
                  `<img src="${avatarUrl}" alt="${avatarSeed}" width={${avatarSize}} height={${avatarSize}} />`}
                {avatarCodeTab === "html" &&
                  `<img src="${avatarUrl}" alt="${avatarSeed}" width="${avatarSize}" height="${avatarSize}" />`}
                {avatarCodeTab === "markdown" &&
                  `![Avatar for ${avatarSeed}](${avatarUrl})`}
                {avatarCodeTab === "svg" &&
                  (avatarRawSvg || "<!-- Loading vector SVG XML... -->")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── TAB 2: THUMBNAILS STUDIO */}
      {activeTab === "thumbnails" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-5 space-y-6 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl">
            <div className="border-b border-[#1e293b] pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🖼️</span>
                <span>Cover Thumbnail Parameters</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Landscape vector image placeholders with mesh gradients and custom labels.
              </p>
            </div>

            {/* Seed Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Seed Identifier <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={thumbSeed}
                onChange={(e) => setThumbSeed(e.target.value)}
                placeholder="e.g. post-1, react-course, rust-engine"
                className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Controls background linear gradient color palette hashing.
              </p>
            </div>

            {/* Custom Headline Label */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Custom Headline Label (Optional)
              </label>
              <input
                type="text"
                value={thumbText}
                onChange={(e) => setThumbText(e.target.value)}
                placeholder="e.g. Building Modern Fullstack Apps"
                className="w-full bg-[#080e1a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Leave blank to auto-format from the seed string.
              </p>
            </div>

            {/* Dimension Presets */}
            <div className="space-y-2 pt-2 border-t border-[#1e293b]">
              <label className="text-xs font-semibold text-slate-300">
                Aspect Ratio & Dimension Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIMENSION_PRESETS.map((dp) => (
                  <button
                    key={dp.label}
                    type="button"
                    onClick={() => {
                      setThumbWidth(dp.width);
                      setThumbHeight(dp.height);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      thumbWidth === dp.width && thumbHeight === dp.height
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold"
                        : "bg-[#080e1a] border-[#1e293b] text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="text-white font-semibold">{dp.width} × {dp.height}</div>
                    <div className="text-[10px] text-slate-500">{dp.label.split("(")[1]?.replace(")", "") || ""}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Width & Height Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1e293b]">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Width</span>
                  <span className="font-mono text-amber-400">{thumbWidth}px</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1600"
                  step="20"
                  value={thumbWidth}
                  onChange={(e) => setThumbWidth(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Height</span>
                  <span className="font-mono text-amber-400">{thumbHeight}px</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="20"
                  value={thumbHeight}
                  onChange={(e) => setThumbHeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#1e293b] flex items-center gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(thumbUrl, "Direct Thumbnail URL")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔗 Copy Direct URL</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadThumbnail}
                className="px-4 py-2.5 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>⬇ Download SVG</span>
              </button>
            </div>
          </div>

          {/* Live Preview & Code Generator */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Canvas Box */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-[#1e293b] transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  src={thumbUrl}
                  alt={thumbSeed}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>{thumbWidth} × {thumbHeight} px</span>
                <span>•</span>
                <span>seed: "{thumbSeed}"</span>
              </div>
            </div>

            {/* Code Snippets Panel */}
            <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-1.5">
                  {[
                    { key: "url", label: "Direct URL" },
                    { key: "jsx", label: "React JSX" },
                    { key: "html", label: "HTML <img>" },
                    { key: "markdown", label: "Markdown" },
                    { key: "svg", label: "Raw SVG" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setThumbCodeTab(tab.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        thumbCodeTab === tab.key
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    let code = thumbUrl;
                    if (thumbCodeTab === "jsx") {
                      code = `<img src="${thumbUrl}" alt="${thumbText || thumbSeed}" width={${thumbWidth}} height={${thumbHeight}} />`;
                    } else if (thumbCodeTab === "html") {
                      code = `<img src="${thumbUrl}" alt="${thumbText || thumbSeed}" width="${thumbWidth}" height="${thumbHeight}" />`;
                    } else if (thumbCodeTab === "markdown") {
                      code = `![Thumbnail for ${thumbText || thumbSeed}](${thumbUrl})`;
                    } else if (thumbCodeTab === "svg") {
                      code = thumbRawSvg;
                    }
                    copyToClipboard(code, "Snippet");
                  }}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1"
                >
                  <span>📋 Copy Code</span>
                </button>
              </div>

              {/* Code output area */}
              <div className="p-4 rounded-xl bg-[#080e1a] border border-[#1e293b] font-mono text-xs text-amber-300/90 overflow-x-auto whitespace-pre">
                {thumbCodeTab === "url" && thumbUrl}
                {thumbCodeTab === "jsx" &&
                  `<img src="${thumbUrl}" alt="${thumbText || thumbSeed}" width={${thumbWidth}} height={${thumbHeight}} />`}
                {thumbCodeTab === "html" &&
                  `<img src="${thumbUrl}" alt="${thumbText || thumbSeed}" width="${thumbWidth}" height="${thumbHeight}" />`}
                {thumbCodeTab === "markdown" &&
                  `![Thumbnail for ${thumbText || thumbSeed}](${thumbUrl})`}
                {thumbCodeTab === "svg" &&
                  (thumbRawSvg || "<!-- Loading vector SVG XML... -->")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── TAB 3: INSPIRATION GALLERY */}
      {activeTab === "gallery" && (
        <div className="space-y-8">
          {/* Avatar Personas Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Curated User Personas</h3>
                <p className="text-xs text-slate-400">
                  Ready-to-use vector user avatars for UI prototypes and test suites.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">
                {AVATAR_PRESETS.length} Personas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {AVATAR_PRESETS.map((preset) => {
                const url = mediaApi.getAvatarUrl(preset, { size: 128, rounded: true });
                return (
                  <div
                    key={preset}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-amber-500/40 transition-all flex flex-col items-center justify-between text-center space-y-3 group"
                  >
                    <img
                      src={url}
                      alt={preset}
                      className="w-16 h-16 rounded-full object-contain group-hover:scale-110 transition-transform shadow-md"
                    />
                    <div className="w-full min-w-0">
                      <p className="text-xs font-bold text-white truncate">{preset}</p>
                      <p className="text-[10px] text-slate-500 font-mono">128 × 128</p>
                    </div>
                    <div className="w-full flex items-center gap-1 pt-1 border-t border-[#1e293b]">
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarSeed(preset);
                          setActiveTab("avatars");
                        }}
                        className="flex-1 py-1 rounded-md bg-[#080e1a] text-slate-300 hover:text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(url, preset)}
                        className="p-1 rounded-md bg-[#080e1a] text-slate-400 hover:text-white text-[11px] transition-colors cursor-pointer"
                        title="Copy Link"
                      >
                        🔗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Landscape Thumbnail Gallery */}
          <div className="space-y-4 pt-6 border-t border-[#1e293b]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Editorial Cover Gallery</h3>
                <p className="text-xs text-slate-400">
                  Pre-configured landscape cards for blog publications and media headers.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">
                {THUMBNAIL_PRESETS.length} Covers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {THUMBNAIL_PRESETS.map((item) => {
                const url = mediaApi.getThumbnailUrl(item.seed, {
                  width: item.width,
                  height: item.height,
                  text: item.text,
                });
                return (
                  <div
                    key={item.seed}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="rounded-xl overflow-hidden border border-[#1e293b]">
                      <img
                        src={url}
                        alt={item.text}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {item.text}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.width} × {item.height} px · seed: {item.seed}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
                      <button
                        type="button"
                        onClick={() => {
                          setThumbSeed(item.seed);
                          setThumbText(item.text);
                          setThumbWidth(item.width);
                          setThumbHeight(item.height);
                          setActiveTab("thumbnails");
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        Customize in Studio →
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(url, item.text)}
                        className="px-2.5 py-1 rounded-lg bg-[#080e1a] text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── TAB 4: API SPECIFICATION */}
      {activeTab === "specs" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>⚡</span>
              <span>Vector Media REST Endpoints Specification</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              These endpoints generate and serve standard SVG markup dynamically directly over HTTP with high-performance edge cache headers.
            </p>

            <div className="space-y-4 pt-2">
              {/* Endpoint 1 */}
              <div className="p-5 rounded-2xl bg-[#080e1a] border border-[#1e293b] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono text-xs border border-emerald-500/30">
                      GET
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      /api/v1/avatars/:seed
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Content-Type: image/svg+xml</span>
                </div>
                <p className="text-xs text-slate-300">
                  Generates deterministic gradient SVG avatar with centered user initials based on the provided string seed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-amber-400 font-bold">:seed</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Required URL parameter</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-sky-400 font-bold">?size=128</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Integer pixels (default: 128)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-purple-400 font-bold">?rounded=true</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Circle vs squircle border</p>
                  </div>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="p-5 rounded-2xl bg-[#080e1a] border border-[#1e293b] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono text-xs border border-emerald-500/30">
                      GET
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      /api/v1/thumbnails/:seed
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Content-Type: image/svg+xml</span>
                </div>
                <p className="text-xs text-slate-300">
                  Generates landscape thumbnail SVG cover cards with mesh gradient background and headline text.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-amber-400 font-bold">:seed</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Required URL seed</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-sky-400 font-bold">?width=600</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Width in px (default: 600)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-sky-400 font-bold">?height=400</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Height in px (default: 400)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <span className="text-purple-400 font-bold">?text=...</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">Custom title label</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Media;
