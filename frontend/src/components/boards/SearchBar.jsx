import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Controlled by a local draft; the query is only applied to the board list on
// submit (Enter or Search button). Clearing the field re-shows all boards.
export default function SearchBar({ query, onSearch, onClear }) {
  const [draft, setDraft] = useState(query)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(draft.trim())
  }

  const handleChange = (e) => {
    const value = e.target.value
    setDraft(value)
    // When the user empties the input, all boards come back immediately.
    if (value === '') onClear()
  }

  const handleClear = () => {
    setDraft('')
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={draft}
          onChange={handleChange}
          placeholder="Search boards by title..."
          className="pl-9 pr-9"
          aria-label="Search boards by title"
        />
        {draft && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}
