import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CardGrid from '@/components/cards/CardGrid'
import CreateCardModal from '@/components/cards/CreateCardModal'
import CommentsModal from '@/components/cards/CommentsModal'
import { useBoards } from '@/context/BoardsContext'
import { categoryLabel } from '@/data/categories'

export default function BoardDetailPage() {
  const { boardId } = useParams()
  const { getBoard, getCards, createCard, upvoteCard, deleteCard, togglePin, addComment } =
    useBoards()

  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [commentsCardId, setCommentsCardId] = useState(null)

  const board = getBoard(boardId)
  const cards = getCards(boardId)

  if (!board) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-lg font-medium">Board not found.</p>
        <Button asChild variant="link" className="mt-2">
          <Link to="/">← Back to all boards</Link>
        </Button>
      </div>
    )
  }

  // Resolve the live card object for the comments modal so it reflects newly
  // added comments without re-opening.
  const commentsCard = commentsCardId
    ? cards.find((c) => c.id === commentsCardId) ?? null
    : null

  return (
    <>
      {/* Board header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 gap-1 px-2">
            <Link to="/">
              <ArrowLeft className="size-4" /> All Boards
            </Link>
          </Button>

          {board.imageUrl && (
            <img
              src={board.imageUrl}
              alt={board.title}
              className="mb-4 h-40 w-full rounded-xl object-cover"
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary">{categoryLabel(board.category)}</Badge>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {board.title}
              </h1>
              {board.author && (
                <p className="text-sm text-muted-foreground">Created by {board.author}</p>
              )}
            </div>
            <Button className="gap-2" onClick={() => setIsCardModalOpen(true)}>
              <Plus className="size-5" />
              Add Card
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <CardGrid
          cards={cards}
          onUpvote={(cardId) => upvoteCard(board.id, cardId)}
          onDelete={(cardId) => deleteCard(board.id, cardId)}
          onTogglePin={(cardId) => togglePin(board.id, cardId)}
          onOpenComments={(card) => setCommentsCardId(card.id)}
        />
      </section>

      <CreateCardModal
        open={isCardModalOpen}
        onOpenChange={setIsCardModalOpen}
        onCreate={(data) => createCard(board.id, data)}
      />

      <CommentsModal
        card={commentsCard}
        onOpenChange={(open) => !open && setCommentsCardId(null)}
        onAddComment={(cardId, data) => addComment(board.id, cardId, data)}
      />
    </>
  )
}
