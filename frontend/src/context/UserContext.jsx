import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '@/lib/api'
import { TOKEN_KEY } from '@/lib/api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  // Only "loading" while we validate a persisted token on first paint.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  // Validate any persisted token once on mount. A bad/expired token is cleared.
  // (When there is no token, `loading` already initializes to false.)
  useEffect(() => {
    if (!token) return
    let active = true
    api
      .me()
      .then(({ user }) => {
        if (active) setUser(user)
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = useCallback((tok, usr) => {
    localStorage.setItem(TOKEN_KEY, tok)
    setToken(tok)
    setUser(usr)
  }, [])

  // `identifier` may be a username or an email address.
  const login = useCallback(
    async (identifier, password) => {
      const { token: tok, user: usr } = await api.login({ identifier, password })
      persist(tok, usr)
    },
    [persist],
  )

  const signup = useCallback(
    async (username, email, password) => {
      const { token: tok, user: usr } = await api.signup({
        username,
        email,
        password,
      })
      persist(tok, usr)
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, isLoggedIn: Boolean(user), login, signup, logout }),
    [user, token, loading, login, signup, logout],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within a UserProvider')
  return ctx
}
