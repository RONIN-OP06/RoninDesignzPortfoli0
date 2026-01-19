import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // load user from storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((userData) => {
    const userWithAdmin = {
      ...userData,
      isAdmin: userData.isAdmin === true
    }
    setUser(userWithAdmin)
    localStorage.setItem('user', JSON.stringify(userWithAdmin))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    // Redirect to home if on admin pages
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/'
    }
  }, [])

  const isAuthenticated = useMemo(() => !!user, [user])

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated,
    loading
  }), [user, login, logout, isAuthenticated, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
