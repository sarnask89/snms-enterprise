import { canAccessRoute, filterNavigationLinks } from '../utils/auth-access.js'

export function usePortalAuth() {
  const session = useState('portal-auth-session', () => ({
    user: null,
    loaded: false
  }))

  const pending = useState('portal-auth-pending', () => false)

  const loadSession = async ({ force = false, silent = false } = {}) => {
    if (pending.value) {
      return session.value
    }

    if (session.value.loaded && !force) {
      return session.value
    }

    pending.value = true
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      const payload = await $fetch('/api/v1/auth/me', { headers })
      session.value = {
        user: payload.user,
        loaded: true
      }
    } catch (error) {
      session.value = {
        user: null,
        loaded: true
      }

      if (!silent) {
        throw error
      }
    } finally {
      pending.value = false
    }

    return session.value
  }

  const login = async (credentials) => {
    await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: credentials
    })

    return await loadSession({ force: true })
  }

  const logout = async () => {
    await $fetch('/api/v1/auth/logout', { method: 'POST' })
    session.value = {
      user: null,
      loaded: true
    }
  }

  const changePassword = async (payload) => {
    await $fetch('/api/v1/auth/change-password', {
      method: 'POST',
      body: payload
    })
  }

  const canAccess = (path) => canAccessRoute(session.value.user?.role ?? null, path)
  const visibleLinks = (links) => filterNavigationLinks(links, session.value.user?.role ?? null)

  return {
    session,
    pending,
    loadSession,
    login,
    logout,
    changePassword,
    canAccess,
    visibleLinks
  }
}
