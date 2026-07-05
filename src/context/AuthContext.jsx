import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Two hardcoded users for the assignment - no backend needed
const USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' },
  user: { username: 'user', password: 'user123', role: 'user' },
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('authUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [currentUser])

  const login = (username, password) => {
    const match = Object.values(USERS).find(
      (u) => u.username === username && u.password === password
    )
    if (!match) {
      return { success: false, error: 'Invalid username or password' }
    }
    setCurrentUser({ username: match.username, role: match.role })
    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext) 
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}