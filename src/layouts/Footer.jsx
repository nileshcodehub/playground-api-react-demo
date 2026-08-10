import LogoIcon from "@/components/LogoIcon";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#0b0f19] border-t border-[#1f2937] text-gray-400 text-sm mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <LogoIcon size={24} className="w-6 h-6 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-gray-200">
                Playground API
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="text-xs text-gray-400">
                React Client Demo Application
              </span>
            </div>
          </div>
          {/* Copyright & Info */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>© {currentYear} Playground API. All rights reserved.</span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span>
              Created by{" "}
              <a
                href="https://github.com/nileshcodehub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors underline"
              >
                Nilesh Kumar
              </a>
            </span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span>Open Source (ISC)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
