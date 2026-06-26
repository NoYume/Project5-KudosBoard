// Thin client for the Express backend. Base URL comes from VITE_API_URL.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Core request helper: serializes JSON bodies, checks res.ok, parses JSON,
// and throws an Error carrying the server's message on failure.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      // response had no JSON body — keep the default message
    }
    throw new Error(message)
  }

  return res.json()
}

// Boards
export const listBoards = ({ category, search } = {}) => {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (search) params.set('search', search)
  const qs = params.toString()
  return request(`/boards${qs ? `?${qs}` : ''}`)
}

export const getBoard = (id) => request(`/boards/${id}`)

export const createBoard = (data) =>
  request('/boards', { method: 'POST', body: data })

export const deleteBoard = (id) =>
  request(`/boards/${id}`, { method: 'DELETE' })

// Cards
export const createCard = (boardId, data) =>
  request(`/boards/${boardId}/cards`, { method: 'POST', body: data })

export const upvoteCard = (cardId) =>
  request(`/cards/${cardId}/upvote`, { method: 'PATCH' })

export const togglePin = (cardId) =>
  request(`/cards/${cardId}/pin`, { method: 'PATCH' })

export const deleteCard = (cardId) =>
  request(`/cards/${cardId}`, { method: 'DELETE' })

// Comments
export const addComment = (cardId, data) =>
  request(`/cards/${cardId}/comments`, { method: 'POST', body: data })
