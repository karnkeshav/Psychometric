export function ProgressHeader({
  current,
  total,
  domainName,
}: {
  current: number
  total: number
  domainName: string
}) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          className="h-2 w-full max-w-[75%] overflow-hidden rounded-full bg-mist"
        >
          <div
            className="h-full rounded-full bg-jade transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-sm text-ink">
          {current} / {total}
        </span>
      </div>
      <p className="text-sm font-medium text-charcoal">{domainName}</p>
    </div>
  )
}
