export function LogoIcon({ size = 32, className = "" }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-linear-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md ${className}`}
    >
      <span style={{ fontSize: size * 0.55 }}>⚡</span>
    </div>
  );
}

export default LogoIcon;
