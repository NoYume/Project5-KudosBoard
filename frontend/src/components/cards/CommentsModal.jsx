import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// `card` is null when the modal is closed. onAddComment(cardId, { message, author }).
export default function CommentsModal({ card, onOpenChange, onAddComment }) {
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('A comment message is required.')
      return
    }
    onAddComment(card.id, { message: message.trim(), author })
    setMessage('')
    setAuthor('')
    setError('')
  }

  return (
    <Dialog open={!!card} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {card && (
          <>
            <DialogHeader>
              <DialogTitle>Card &amp; Comments</DialogTitle>
              <DialogDescription className="sr-only">
                View this card and its comments, and add your own.
              </DialogDescription>
            </DialogHeader>

            {/* Card preview */}
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <p className="font-medium">{card.message}</p>
              <img
                src={card.gifUrl}
                alt="Card gif"
                className="aspect-video w-full rounded-md object-cover"
              />
              {card.author && (
                <p className="text-sm text-muted-foreground">— {card.author}</p>
              )}
            </div>

            {/* Comment list */}
            <div className="max-h-48 space-y-2 overflow-y-auto">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Comments ({card.comments.length})
              </h4>
              {card.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first!
                </p>
              ) : (
                card.comments.map((c) => (
                  <div key={c.id} className="rounded-md border p-2 text-sm">
                    <p>{c.message}</p>
                    {c.author && (
                      <p className="mt-1 text-xs text-muted-foreground">— {c.author}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add comment */}
            <form onSubmit={handleSubmit} className="space-y-3 border-t pt-3" noValidate>
              <div className="space-y-2">
                <Label htmlFor="comment-message">
                  Add a comment <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="comment-message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    setError('')
                  }}
                  placeholder="Write something nice..."
                  aria-invalid={!!error}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment-author">Author (optional)</Label>
                <Input
                  id="comment-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <Button type="submit" className="w-full">
                Post Comment
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
