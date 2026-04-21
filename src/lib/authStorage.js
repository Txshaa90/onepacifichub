/**
 * Supabase session storage: "Remember me" off → sessionStorage (tab-only).
 * Remember me on → localStorage (survives browser restarts).
 */
export const AUTH_STORAGE_MODE_KEY = 'oph_auth_storage_mode'

function getAuthStorageMode() {
  if (typeof window === 'undefined') return 'session'
  try {
    if (sessionStorage.getItem(AUTH_STORAGE_MODE_KEY) === 'session') {
      return 'session'
    }
    if (localStorage.getItem(AUTH_STORAGE_MODE_KEY) === 'persistent') {
      return 'persistent'
    }
  } catch {
    return 'session'
  }
  return 'session'
}

export function setAuthStoragePersistence(persistent) {
  if (typeof window === 'undefined') return
  try {
    if (persistent) {
      localStorage.setItem(AUTH_STORAGE_MODE_KEY, 'persistent')
      sessionStorage.removeItem(AUTH_STORAGE_MODE_KEY)
      return
    }
    localStorage.removeItem(AUTH_STORAGE_MODE_KEY)
    sessionStorage.setItem(AUTH_STORAGE_MODE_KEY, 'session')
  } catch {
    /* ignore quota */
  }
}

export function isSessionOnlyAuthMode() {
  return getAuthStorageMode() === 'session'
}

/** Legacy mirror for code that reads `authToken`; stays out of localStorage when "Remember me" is off. */
export function setAuthTokenMirror(token) {
  if (typeof window === 'undefined') return
  try {
    if (token == null || token === '') {
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
      return
    }
    if (isSessionOnlyAuthMode()) {
      localStorage.removeItem('authToken')
      sessionStorage.setItem('authToken', token)
    } else {
      localStorage.setItem('authToken', token)
      sessionStorage.removeItem('authToken')
    }
    } catch {
    /* ignore quota */
  }
}

export function getMirroredAuthToken() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  } catch {
    return null
  }
}

export function createSupabaseAuthStorage() {
  return {
    getItem(key) {
      try {
        if (typeof window === 'undefined') return null
        if (getAuthStorageMode() === 'session') {
          return sessionStorage.getItem(key)
        }
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem(key, value) {
      try {
        if (getAuthStorageMode() === 'session') {
          sessionStorage.setItem(key, value)
        } else {
          localStorage.setItem(key, value)
        }
      } catch {
        /* ignore quota */
      }
    },
    removeItem(key) {
      try {
        sessionStorage.removeItem(key)
        localStorage.removeItem(key)
      } catch {
        /* ignore */
      }
    }
  }
}
