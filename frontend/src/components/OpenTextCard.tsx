export function OpenTextCard({
  prompt,
  value,
  onChange,
  onBlur,
}: {
  prompt: string
  value: string | undefined
  onChange: (value: string) => void
  onBlur: () => void
}) {
  const text = value ?? ''

  return (
    <div>
      <label className="mb-3 block text-lg text-ink" htmlFor="open-text-response">
        {prompt}
      </label>
      <textarea
        id="open-text-response"
        rows={5}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full rounded-lg border border-mist p-3 text-sm text-charcoal focus:outline-none focus-visible:outline-2 focus-visible:outline-jade"
      />
      <p className="mt-1 font-mono text-xs text-charcoal">
        ~{text.length} characters
      </p>
    </div>
  )
}
