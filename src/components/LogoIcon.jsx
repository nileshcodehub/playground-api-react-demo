export function LogoIcon({ className = 'w-8 h-8', size = 32 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="fintechBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#080e1a" />
        </linearGradient>
        <linearGradient id="fintechGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="fintechBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="fintechShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#f59e0b" floodOpacity="0.2" />
        </filter>
      </defs>
      {/* Container Box */}
      <rect
        width="512"
        height="512"
        rx="128"
        fill="url(#fintechBg)"
        stroke="url(#fintechGold)"
        strokeWidth="10"
      />
      {/* Inner Geometry */}
      <g filter="url(#fintechShadow)">
        {/* Left Column Bar */}
        <rect
          x="120"
          y="180"
          width="48"
          height="160"
          rx="24"
          fill="url(#fintechBlue)"
        />
        {/* Middle Tall Bar */}
        <rect
          x="200"
          y="120"
          width="48"
          height="280"
          rx="24"
          fill="url(#fintechGold)"
        />
        {/* Right Forward Chevron / Diamond */}
        <path
          d="M 285 160 L 390 256 L 285 352"
          fill="none"
          stroke="url(#fintechGold)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
export default LogoIcon;