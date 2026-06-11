export default function ShimLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <rect width="512" height="512" fill="currentColor" rx="112" />
      <path fill="none" stroke="black" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" d="M 150 160 L 300 256 L 150 352" />
      <rect x="320" y="360" width="80" height="48" fill="black" />
    </svg>
  );
}
