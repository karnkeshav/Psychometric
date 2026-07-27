const SCALE = [
  { value: '1', label: 'Strongly Disagree' },
  { value: '2', label: 'Disagree' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'Agree' },
  { value: '5', label: 'Strongly Agree' },
]

export function LikertCard({
  questionId,
  statement,
  value,
  onChange,
}: {
  questionId: string
  statement: string
  value: string | undefined
  onChange: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="mb-6 text-lg text-ink">{statement}</legend>
      <div className="grid grid-cols-5 gap-2">
        {SCALE.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-mist p-3 text-center text-xs text-charcoal transition has-checked:border-jade has-checked:bg-jade/10"
          >
            <input
              type="radio"
              name={`likert-${questionId}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="accent-jade"
            />
            <span className="font-mono">{option.value}</span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
