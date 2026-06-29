// Thin client for the Express backend. Base URL comes from VITE_API_URL.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// localStorage key for the JWT. Exported so UserContext uses the same key.
export const TOKEN_KEY = 'kudos-token'

// Core request helper: serializes JSON bodies, attaches the auth token (if any),
// checks res.ok, parses JSON, and throws an Error carrying the server's message.
async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
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

// Auth
export const signup = (data) =>
  request('/auth/signup', { method: 'POST', body: data })

export const login = (data) =>
  request('/auth/login', { method: 'POST', body: data })

export const me = () => request('/auth/me')

// Boards
export const listBoards = ({ category, search, mine } = {}) => {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (search) params.set('search', search)
  if (mine) params.set('mine', 'true')
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
