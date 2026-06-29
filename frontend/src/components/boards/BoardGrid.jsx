import BoardCard from '@/components/boards/BoardCard'

export default function BoardGrid({ boards, onDeleteBoard }) {
  if (boards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        No boards found. Create one to get started!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} onDelete={onDeleteBoard} />
      ))}
    </div>
  )
}
