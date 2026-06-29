import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { categoryLabel } from '@/data/categories'
import { useUser } from '@/context/UserContext'

// Blog-post-card style (UI Thing "Blog post card 3" → shadcn): rounded card,
// image on top, category badge, title, optional author, with a hover lift.
export default function BoardCard({ board, onDelete }) {
  const navigate = useNavigate()
  const { user } = useUser()
  // Only the owner may delete an owned board. (Legacy null-owner boards are
  // deletable by the API, but we hide the control to keep ownership clear.)
  const canDelete = Boolean(user) && board.userId === user.id

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={() => navigate(`/boards/${board.id}`)}
        className="block aspect-video w-full overflow-hidden"
        aria-label={`View ${board.title}`}
      >
        <img
          src={board.imageUrl}
          alt={board.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="secondary" className="w-fit">
          {categoryLabel(board.category)}
        </Badge>
        <h3 className="text-lg font-semibold leading-tight">{board.title}</h3>
        {board.author && (
          <p className="text-sm text-muted-foreground">by {board.author}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <Button asChild variant="link" className="h-auto p-0">
            <Link to={`/boards/${board.id}`}>View Board →</Link>
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(board.id)}
              aria-label={`Delete ${board.title}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
