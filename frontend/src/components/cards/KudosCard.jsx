import { ArrowBigUp, MessageCircle, Pin, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function KudosCard({ card, onUpvote, onDelete, onTogglePin, onOpenComments }) {
  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all',
        card.pinned && 'border-primary ring-2 ring-primary/40',
      )}
    >
      <div className="flex items-start justify-between gap-2 p-4 pb-2">
        <p className="flex-1 font-medium leading-snug">{card.message}</p>
        <Button
          variant={card.pinned ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onTogglePin(card.id)}
          aria-label={card.pinned ? 'Unpin card' : 'Pin card'}
          aria-pressed={card.pinned}
          title={card.pinned ? 'Unpin' : 'Pin to top'}
          className="shrink-0"
        >
          <Pin className={cn('size-4', card.pinned && 'fill-current')} />
        </Button>
      </div>

      {card.pinned && (
        <div className="px-4 pb-1">
          <Badge variant="secondary" className="gap-1">
            <Pin className="size-3 fill-current" /> Pinned
          </Badge>
        </div>
      )}

      <div className="px-4">
        <img
          src={card.gifUrl}
          alt="Card gif"
          loading="lazy"
          className="aspect-video w-full rounded-md object-cover"
        />
      </div>

      {card.author && (
        <p className="px-4 pt-3 text-sm text-muted-foreground">— {card.author}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 p-4 pt-3">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1"
          onClick={() => onUpvote(card.id)}
          aria-label="Upvote card"
        >
          <ArrowBigUp className="size-4" />
          {card.upvotes}
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={() => onOpenComments(card)}
            aria-label="View comments"
          >
            <MessageCircle className="size-4" />
            {card.comments.length}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(card.id)}
            aria-label="Delete card"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
