import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { seedBoards, seedCards } from '@/data/seed'

const BoardsContext = createContext(null)

// Monotonic id generator for in-memory records (frontend-only milestone).
// Replaced by backend-assigned ids once the API is connected (Milestone 3).
let nextId = 100000
const genId = () => ++nextId

export function BoardsProvider({ children }) {
  const [boards, setBoards] = useState(seedBoards)
  // Cards are keyed by boardId so a board's cards are cheap to look up.
  const [cardsByBoard, setCardsByBoard] = useState(seedCards)

  const createBoard = useCallback(({ title, category, imageUrl, author }) => {
    const board = {
      id: genId(),
      title,
      category,
      imageUrl,
      author: author?.trim() ? author.trim() : null,
      createdAt: new Date().toISOString(),
    }
    setBoards((prev) => [board, ...prev])
    setCardsByBoard((prev) => ({ ...prev, [board.id]: [] }))
    return board
  }, [])

  const deleteBoard = useCallback((boardId) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId))
    setCardsByBoard((prev) => {
      const next = { ...prev }
      delete next[boardId] // cascade-delete the board's cards
      return next
    })
  }, [])

  const getBoard = useCallback(
    (boardId) => boards.find((b) => b.id === Number(boardId)) ?? null,
    [boards],
  )

  const getCards = useCallback(
    (boardId) => cardsByBoard[Number(boardId)] ?? [],
    [cardsByBoard],
  )

  const createCard = useCallback((boardId, { message, gifUrl, author }) => {
    const id = Number(boardId)
    const card = {
      id: genId(),
      boardId: id,
      message,
      gifUrl,
      author: author?.trim() ? author.trim() : null,
      upvotes: 0,
      pinned: false,
      pinnedAt: null,
      createdAt: new Date().toISOString(),
      comments: [],
    }
    setCardsByBoard((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), card] }))
    return card
  }, [])

  const upvoteCard = useCallback((boardId, cardId) => {
    const id = Number(boardId)
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).map((c) =>
        c.id === cardId ? { ...c, upvotes: c.upvotes + 1 } : c,
      ),
    }))
  }, [])

  const deleteCard = useCallback((boardId, cardId) => {
    const id = Number(boardId)
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).filter((c) => c.id !== cardId),
    }))
  }, [])

  const togglePin = useCallback((boardId, cardId) => {
    const id = Number(boardId)
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).map((c) =>
        c.id === cardId
          ? c.pinned
            ? { ...c, pinned: false, pinnedAt: null }
            : { ...c, pinned: true, pinnedAt: new Date().toISOString() }
          : c,
      ),
    }))
  }, [])

  const addComment = useCallback((boardId, cardId, { message, author }) => {
    const id = Number(boardId)
    const comment = {
      id: genId(),
      message,
      author: author?.trim() ? author.trim() : null,
      createdAt: new Date().toISOString(),
    }
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).map((c) =>
        c.id === cardId ? { ...c, comments: [...c.comments, comment] } : c,
      ),
    }))
    return comment
  }, [])

  const value = useMemo(
    () => ({
      boards,
      createBoard,
      deleteBoard,
      getBoard,
      getCards,
      createCard,
      upvoteCard,
      deleteCard,
      togglePin,
      addComment,
    }),
    [
      boards,
      createBoard,
      deleteBoard,
      getBoard,
      getCards,
      createCard,
      upvoteCard,
      deleteCard,
      togglePin,
      addComment,
    ],
  )

  return <BoardsContext.Provider value={value}>{children}</BoardsContext.Provider>
}

export function useBoards() {
  const ctx = useContext(BoardsContext)
  if (!ctx) throw new Error('useBoards must be used within a BoardsProvider')
  return ctx
}
