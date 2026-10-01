import { LEAD_STATUSES } from '../queries'
import type { StatusFilterValue } from '../queries'

const OPTIONS: StatusFilterValue[] = ['Todos', ...LEAD_STATUSES]

type StatusFilterProps = {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="filter-bar">
      <p className="filter-bar__label" id="status-filter-label">
        Filtrar por status
      </p>
      <div className="filter-bar__options" role="group" aria-labelledby="status-filter-label">
        {OPTIONS.map((option) => {
          const selected = option === value

          return (
            <button
              key={option}
              type="button"
              className={selected ? 'filter-chip filter-chip--active' : 'filter-chip'}
              aria-pressed={selected}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
