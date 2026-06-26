import { useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search'
const API_KEY = import.meta.env.VITE_GIPHY_API_KEY

// Live GIPHY search/select used inside the create-card form. Calls GIPHY
// directly from the browser (frontend-callable 3rd-party API). The selected
// gif's URL is lifted up via onSelect.
export default function GiphySearch({ selectedGif, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | error | empty | done

  const search = async (e) => {
    e?.preventDefault()
    const term = query.trim()
    if (!term) return

    if (!API_KEY) {
      setStatus('error')
      setResults([])
      return
    }

    setStatus('loading')
    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        q: term,
        limit: '12',
        rating: 'g',
      })
      const res = await fetch(`${GIPHY_ENDPOINT}?${params}`)
      if (!res.ok) throw new Error(`GIPHY error ${res.status}`)
      const { data } = await res.json()
      setResults(data)
      setStatus(data.length === 0 ? 'empty' : 'done')
    } catch {
      setResults([])
      setStatus('error')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                search()
              }
            }}
            placeholder="Search GIPHY for a gif..."
            className="pl-9"
            aria-label="Search GIPHY"
          />
        </div>
        <Button type="button" onClick={search} disabled={status === 'loading'}>
          {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {status === 'error' && (
        <p className="text-sm text-destructive">
          {API_KEY
            ? "Couldn't reach GIPHY. Check your connection and try again."
            : 'Set VITE_GIPHY_API_KEY in frontend/.env to enable gif search.'}
        </p>
      )}
      {status === 'empty' && (
        <p className="text-sm text-muted-foreground">No gifs found for “{query}”.</p>
      )}

      {results.length > 0 && (
        <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-md border p-2">
          {results.map((gif) => {
            const url = gif.images.fixed_height.url
            const selected = selectedGif === url
            return (
              <button
                type="button"
                key={gif.id}
                onClick={() => onSelect(url)}
                className={cn(
                  'overflow-hidden rounded-md border-2 transition',
                  selected ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted-foreground/40',
                )}
                aria-label={`Select gif: ${gif.title || 'gif'}`}
                aria-pressed={selected}
              >
                <img
                  src={url}
                  alt={gif.title || 'gif'}
                  className="aspect-square size-full object-cover"
                  loading="lazy"
                />
              </button>
            )
          })}
        </div>
      )}

      {selectedGif && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-2">
          <img src={selectedGif} alt="Selected gif" className="size-16 rounded object-cover" />
          <span className="text-sm text-muted-foreground">Gif selected ✓</span>
        </div>
      )}
    </div>
  )
}
