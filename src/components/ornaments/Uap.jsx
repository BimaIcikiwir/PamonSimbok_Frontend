// Tiga kepul uap dari panci
export default function Uap({ className = "" }) {
  return (
    <svg viewBox="0 0 60 50" className={className} aria-hidden="true">
      {[10, 28, 46].map((x, i) => (
        <path
          key={x}
          d={`M${x} 46 C${x - 8} 36 ${x + 8} 28 ${x} 18 C${x - 5} 11 ${x + 3} 6 ${x} 2`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-uap"
          style={{ animationDelay: `${i * 0.7}s`, transformOrigin: "center" }}
        />
      ))}
    </svg>
  );
}
