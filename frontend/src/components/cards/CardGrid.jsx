import { useMemo } from 'react'
import KudosCard from '@/components/cards/KudosCard'

// Pinned cards float to the top, ordered by most-recently-pinned first.
// Unpinned cards keep their creation order below.
function orderCards(cards) {
  const pinned = cards
    .filter((c) => c.pinned)
    .sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt))
  const rest = cards
    .filter((c) => !c.pinned)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  return [...pinned, ...rest]
}

export default function CardGrid({ cards, onUpvote, onDelete, onTogglePin, onOpenComments }) {
  const ordered = useMemo(() => orderCards(cards), [cards])

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        No cards yet. Add the first one!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((card) => (
        <KudosCard
          key={card.id}
          card={card}
          onUpvote={onUpvote}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onOpenComments={onOpenComments}
        />
      ))}
    </div>
  )
}
