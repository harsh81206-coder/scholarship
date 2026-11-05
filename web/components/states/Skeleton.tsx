export function Skeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div aria-label="Loading" aria-busy="true" className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-12 rounded-lg bg-surface-container-high" />
      ))}
    </div>
  );
}
