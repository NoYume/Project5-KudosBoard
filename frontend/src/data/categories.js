// Stored board categories (the value persisted on each board).
export const CATEGORIES = [
  { value: 'celebration', label: 'Celebration' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'inspiration', label: 'Inspiration' },
]

// Filter tabs shown on the dashboard. `all` and `recent` are filters, not
// stored values; `mine` is the (stretch) "My Boards" placeholder.
export const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recent' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'mine', label: 'My Boards' },
]

// "Recent" shows the 6 most recently created boards.
export const RECENT_COUNT = 6

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}
