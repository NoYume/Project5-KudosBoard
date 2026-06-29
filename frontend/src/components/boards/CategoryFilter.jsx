import { Button } from '@/components/ui/button'
import { FILTERS } from '@/data/categories'

export default function CategoryFilter({ active, onChange, showMine = true }) {
  // "My Boards" only makes sense for logged-in users.
  const filters = showMine ? FILTERS : FILTERS.filter((f) => f.value !== 'mine')

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {filters.map((filter) => (
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
