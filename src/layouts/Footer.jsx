import LogoIcon from "@/components/LogoIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#080e1a] border-t border-[#1e293b] text-slate-400 text-sm mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <LogoIcon size={24} className="w-6 h-6 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-slate-200">
                Directory Studio
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                Powered by Playground API Enterprise Sandbox
              </span>
            </div>
          </div>
          {/* Copyright & Info */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>© {currentYear} Playground API. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>
              Crafted by{" "}
              <a
                href="https://github.com/nileshcodehub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors hover:underline"
              >
                Nilesh Kumar
              </a>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Open Source (ISC)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
