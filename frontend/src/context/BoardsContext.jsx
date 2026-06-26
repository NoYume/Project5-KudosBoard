import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '@/lib/api'

const BoardsContext = createContext(null)

export function BoardsProvider({ children }) {
  const [boards, setBoards] = useState([])
  // Cards are keyed by boardId so a board's cards are cheap to look up.
  const [cardsByBoard, setCardsByBoard] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load the board list once on mount.
  useEffect(() => {
    let active = true
    api
      .listBoards()
      .then((data) => {
        if (active) setBoards(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const createBoard = useCallback(async ({ title, category, imageUrl, author }) => {
    const board = await api.createBoard({
      title,
      category,
      imageUrl,
      author: author?.trim() ? author.trim() : null,
    })
    setBoards((prev) => [board, ...prev])
    setCardsByBoard((prev) => ({ ...prev, [board.id]: [] }))
    return board
  }, [])

  const deleteBoard = useCallback(async (boardId) => {
    await api.deleteBoard(boardId)
    setBoards((prev) => prev.filter((b) => b.id !== boardId))
    setCardsByBoard((prev) => {
      const next = { ...prev }
      delete next[boardId] // cascade-delete the board's cards (mirrors the backend)
      return next
    })
  }, [])

  // Fetch a single board with its cards (used by the detail page). Upserts the
  // board into the list so getBoard/getCards can read it synchronously.
  const fetchBoard = useCallback(async (boardId) => {
    const id = Number(boardId)
    const board = await api.getBoard(id)
    const { cards = [], ...boardMeta } = board
    setBoards((prev) => {
      const exists = prev.some((b) => b.id === id)
      return exists ? prev.map((b) => (b.id === id ? boardMeta : b)) : [boardMeta, ...prev]
    })
    setCardsByBoard((prev) => ({ ...prev, [id]: cards }))
    return board
  }, [])

  const getBoard = useCallback(
    (boardId) => boards.find((b) => b.id === Number(boardId)) ?? null,
    [boards],
  )

  const getCards = useCallback(
    (boardId) => cardsByBoard[Number(boardId)] ?? [],
    [cardsByBoard],
  )

  const createCard = useCallback(async (boardId, { message, gifUrl, author }) => {
    const id = Number(boardId)
    const card = await api.createCard(id, {
      message,
      gifUrl,
      author: author?.trim() ? author.trim() : null,
    })
    setCardsByBoard((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), card] }))
    return card
  }, [])

  // Replace a single card in state with the server's version.
  const replaceCard = useCallback((boardId, updated) => {
    const id = Number(boardId)
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).map((c) => (c.id === updated.id ? updated : c)),
    }))
  }, [])

  const upvoteCard = useCallback(
    async (boardId, cardId) => {
      const updated = await api.upvoteCard(cardId)
      replaceCard(boardId, updated)
    },
    [replaceCard],
  )

  const deleteCard = useCallback(async (boardId, cardId) => {
    await api.deleteCard(cardId)
    const id = Number(boardId)
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).filter((c) => c.id !== cardId),
    }))
  }, [])

  const togglePin = useCallback(
    async (boardId, cardId) => {
      const updated = await api.togglePin(cardId)
      replaceCard(boardId, updated)
    },
    [replaceCard],
  )

  const addComment = useCallback(async (boardId, cardId, { message, author }) => {
    const comment = await api.addComment(cardId, {
      message,
      author: author?.trim() ? author.trim() : null,
    })
    const id = Number(boardId)
    setCardsByBoard((prev) => ({
      ...prev,
      [id]: (prev[id] ?? []).map((c) =>
        c.id === cardId ? { ...c, comments: [...(c.comments ?? []), comment] } : c,
      ),
    }))
    return comment
  }, [])

  const value = useMemo(
    () => ({
      boards,
      loading,
      error,
      createBoard,
      deleteBoard,
      fetchBoard,
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
      loading,
      error,
      createBoard,
      deleteBoard,
      fetchBoard,
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
