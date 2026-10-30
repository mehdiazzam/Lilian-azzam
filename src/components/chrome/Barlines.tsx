
export function Barline({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`mx-auto h-16 w-px bg-gold/30 ${className}`}
    />
  )
}

export function DoubleBarline({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`mx-auto flex h-20 items-stretch gap-1 ${className}`}
    >
      <span className="w-px bg-gold/50" />
      <span className="w-[3px] bg-gold/70" />
    </div>
  )
}
