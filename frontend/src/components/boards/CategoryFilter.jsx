import { Button } from '@/components/ui/button'
import { FILTERS } from '@/data/categories'

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {FILTERS.map((filter) => (
        <Button
          key={filter.value}
          variant={active === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(filter.value)}
          aria-pressed={active === filter.value}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
