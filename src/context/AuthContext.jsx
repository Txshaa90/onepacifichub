import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'
import * as supabaseAuthService from '../services/supabaseAuthService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          console.warn('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
          setLoading(false)
          return
        }

        // Get Supabase session
        const session = await supabaseAuthService.getSupabaseSession()
        if (session) {
          localStorage.setItem('authToken', session.token)
          setUser(session.user)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  // Keep user in sync after Google OAuth redirect and other session changes
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const mapped = await supabaseAuthService.getSupabaseSession()
        if (mapped) {
          localStorage.setItem('authToken', mapped.token)
          setUser(mapped.user)
        }
      } else {
        localStorage.removeItem('authToken')
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Login function - Uses Supabase authentication
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      
      const { token, user } = await supabaseAuthService.loginWithSupabase(email, password)
      
      localStorage.setItem('authToken', token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Register function - Uses Supabase authentication
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      
      const { token, user } = await supabaseAuthService.registerWithSupabase(userData)
      
      localStorage.setItem('authToken', token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      await supabaseAuthService.signInWithGoogle()
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Google sign-in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const loginWithFacebook = async () => {
    try {
      setError(null)
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      await supabaseAuthService.signInWithFacebook()
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Facebook sign-in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const loginWithTwitter = async () => {
    try {
      setError(null)
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      await supabaseAuthService.signInWithTwitter()
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'X / Twitter sign-in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabaseAuthService.logoutWithSupabase()
      }
      
      localStorage.removeItem('authToken')
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      // Still clear local state even if Supabase logout fails
      localStorage.removeItem('authToken')
      setUser(null)
      setError(null)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const { user: updatedUser } = await authService.updateProfile(user.id, updates)
      setUser(updatedUser)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      setError(null)
      
      await authService.changePassword(user.id, currentPassword, newPassword)
      
      return { success: true, message: 'Password changed successfully' }
    } catch (err) {
      const errorMessage = err.message || 'Password change failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Request password reset - Uses Supabase
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      
      const result = await supabaseAuthService.requestPasswordResetSupabase(email)
      
      return { success: true, message: result.message }
    } catch (err) {
      const errorMessage = err.message || 'Password reset request failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
