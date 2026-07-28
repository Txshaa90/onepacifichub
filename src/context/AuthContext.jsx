import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'
import * as supabaseAuthService from '../services/supabaseAuthService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { AUTH_STORAGE_MODE_KEY, setAuthStoragePersistence, setAuthTokenMirror } from '../lib/authStorage'
import { stripSupabaseAuthFromUrl } from '../lib/authUrl'

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

  // Single subscription: session from storage + email/OAuth/recovery callbacks in URL
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    const applySession = async (session) => {
      try {
        if (session) {
          const mapped = await supabaseAuthService.getSupabaseSession()
          if (mapped) {
            setAuthTokenMirror(mapped.token)
            setUser(mapped.user)
          }
        } else {
          setAuthTokenMirror(null)
          setUser(null)
        }
      } catch (err) {
        console.error('Auth session sync error:', err)
        setAuthTokenMirror(null)
        setUser(null)
      } finally {
        stripSupabaseAuthFromUrl()
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session)
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      void applySession(session)
      setLoading(false)
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

      await supabase.auth.signOut()
      setAuthStoragePersistence(rememberMe)

      const { token, user } = await supabaseAuthService.loginWithSupabase(email, password)

      setAuthTokenMirror(token)
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

      await supabase.auth.signOut()
      setAuthStoragePersistence(true)

      const result = await supabaseAuthService.registerWithSupabase(userData)

      if (result.needsVerification) {
        return { success: true, needsVerification: true, email: result.email }
      }

      setAuthTokenMirror(result.token)
      setUser(result.user)

      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (rememberMe = false) => {
    try {
      setError(null)
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      setAuthStoragePersistence(rememberMe)
      await supabaseAuthService.signInWithGoogle()
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Google sign-in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const loginWithFacebook = async (rememberMe = false) => {
    try {
      setError(null)
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      setAuthStoragePersistence(rememberMe)
      await supabaseAuthService.signInWithFacebook()
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Facebook sign-in failed'
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

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_MODE_KEY)
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_MODE_KEY)
      }
      setAuthTokenMirror(null)
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_MODE_KEY)
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_MODE_KEY)
      }
      setAuthTokenMirror(null)
      setUser(null)
      setError(null)
    }
  }

  const resendVerificationEmail = async (email) => {
    try {
      setError(null)
      if (!isSupabaseConfigured()) {
        throw new Error('Authentication not configured. Please contact support.')
      }
      await supabaseAuthService.resendSignupConfirmationEmail(email)
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Could not resend email'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const { user: updatedUser, emailChangeRequested } = await supabaseAuthService.updateSupabaseProfile(updates)
      setUser(updatedUser)
      
      return {
        success: true,
        message: emailChangeRequested
          ? 'Profile saved. Check your inbox to confirm the new email address.'
          : 'Profile saved successfully.'
      }
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

  const updateGarage = async (vehicles) => {
    try {
      setError(null)
      const updatedUser = await supabaseAuthService.updateSupabaseGarage(vehicles)
      setUser(updatedUser)
      return { success: true, vehicles: updatedUser.garage }
    } catch (err) {
      const errorMessage = err.message || 'Could not update your garage'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    updateProfile,
    updateGarage,
    changePassword,
    resendVerificationEmail,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
