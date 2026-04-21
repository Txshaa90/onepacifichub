import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getEmailConfirmationRedirectUrl, getOAuthCallbackUrl } from '../lib/siteUrl'

// Login with Supabase
export const loginWithSupabase = async (email, password) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    token: data.session.access_token,
    user: mapSupabaseUser(data.user)
  }
}

const mapSupabaseUser = (u) => ({
  ...u.user_metadata,
  id: u.id,
  email: u.email,
  firstName: u.user_metadata?.firstName || u.user_metadata?.full_name?.split?.(' ')?.[0] || '',
  lastName: u.user_metadata?.lastName || '',
  phone: u.user_metadata?.phone || '',
  address: u.user_metadata?.address || '',
  city: u.user_metadata?.city || '',
  state: u.user_metadata?.state || '',
  zipCode: u.user_metadata?.zipCode || '',
  marketingEmails: u.user_metadata?.marketingEmails ?? true,
  orderUpdates: u.user_metadata?.orderUpdates ?? true,
  smsAlerts: u.user_metadata?.smsAlerts ?? false,
  avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || ''
})

// Google OAuth — redirects back to this app after provider login
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getOAuthCallbackUrl(),
      // Always show Google’s account picker instead of silently reusing the browser’s session.
      queryParams: {
        prompt: 'select_account'
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }
}

export const signInWithFacebook = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: getOAuthCallbackUrl()
    }
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Register with Supabase
export const registerWithSupabase = async (userData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  }

  const { firstName, lastName, email, password } = userData

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getEmailConfirmationRedirectUrl(),
      data: {
        firstName,
        lastName
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.session) {
    return {
      needsVerification: true,
      email: email.trim()
    }
  }

  return {
    needsVerification: false,
    token: data.session.access_token,
    user: mapSupabaseUser(data.user)
  }
}

export const resendSignupConfirmationEmail = async (email) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: {
      emailRedirectTo: getEmailConfirmationRedirectUrl()
    }
  })

  if (error) {
    console.error('[Supabase] resend signup email failed:', error.message)
    throw new Error(error.message)
  }

  return { success: true, message: 'Verification email sent.' }
}

// Logout with Supabase
export const logoutWithSupabase = async () => {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

// Get current session
export const getSupabaseSession = async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }

  return {
    token: session.access_token,
    user: mapSupabaseUser(session.user)
  }
}

export const updateSupabaseProfile = async (updates) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const {
    firstName = '',
    lastName = '',
    email,
    phone = '',
    address = '',
    city = '',
    state = '',
    zipCode = '',
    marketingEmails = true,
    orderUpdates = true,
    smsAlerts = false
  } = updates

  const {
    data: { user: currentUser },
    error: currentUserError
  } = await supabase.auth.getUser()

  if (currentUserError || !currentUser) {
    throw new Error(currentUserError?.message || 'User not found')
  }

  const metadata = {
    ...currentUser.user_metadata,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    full_name: `${firstName} ${lastName}`.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    state: state.trim(),
    zipCode: zipCode.trim(),
    marketingEmails: Boolean(marketingEmails),
    orderUpdates: Boolean(orderUpdates),
    smsAlerts: Boolean(smsAlerts)
  }

  const payload = { data: metadata }
  const normalizedEmail = email?.trim().toLowerCase()
  const currentEmail = currentUser.email?.trim().toLowerCase()

  if (normalizedEmail && normalizedEmail !== currentEmail) {
    payload.email = normalizedEmail
  }

  const { data, error } = await supabase.auth.updateUser(payload)

  if (error) {
    throw new Error(error.message)
  }

  return {
    user: mapSupabaseUser(data.user || currentUser),
    emailChangeRequested: Boolean(payload.email)
  }
}

// Verify token with Supabase
export const verifySupabaseToken = async (token) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw new Error('Invalid token')
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
      ...user.user_metadata
    }
  }
}

export default {
  loginWithSupabase,
  registerWithSupabase,
  resendSignupConfirmationEmail,
  logoutWithSupabase,
  getSupabaseSession,
  updateSupabaseProfile,
  verifySupabaseToken,
  signInWithGoogle,
  signInWithFacebook
}
