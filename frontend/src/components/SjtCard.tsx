import type { QuestionOption } from '../lib/api/questions'

export function SjtCard({
  questionId,
  scenario,
  options,
  value,
  onChange,
}: {
  questionId: string
  scenario: string
  options: QuestionOption[]
  value: string | undefined
  onChange: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="mb-6 text-lg text-ink">{scenario}</legend>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.key}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-mist p-3 text-sm text-charcoal transition has-checked:border-jade has-checked:bg-jade/10"
          >
            <input
              type="radio"
              name={`sjt-${questionId}`}
              value={option.key}
              checked={value === option.key}
              onChange={() => onChange(option.key)}
              className="accent-jade"
            />
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
