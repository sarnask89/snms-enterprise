import { canAccessRoute, filterNavigationLinks } from '../utils/auth-access'

type PortalRole = 'admin' | 'manager' | 'service' | 'view'

type PortalUser = {
  id?: number
  username: string
  role: PortalRole
}

type PortalSession = {
  user: PortalUser | null
  loaded: boolean
}

type SessionPayload = {
  user: PortalUser
}

type LoginCredentials = {
  username: string
  password: string
}

type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
  newPassword2?: string
}

type SessionOptions = {
  force?: boolean
  silent?: boolean
}

export function usePortalAuth() {
  const session = useState<PortalSession>('portal-auth-session', () => ({
    user: null,
    loaded: false
  }))

  const pending = useState<boolean>('portal-auth-pending', () => false)

  const loadSession = async ({ force = false, silent = false }: SessionOptions = {}) => {
    if (pending.value) {
      return session.value
    }

    if (session.value.loaded && !force) {
      return session.value
    }

    pending.value = true
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      const payload = await $fetch<SessionPayload>('/api/v1/auth/me', { headers })
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

  const login = async (credentials: LoginCredentials) => {
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

  const changePassword = async (payload: ChangePasswordPayload) => {
    await $fetch('/api/v1/auth/change-password', {
      method: 'POST',
      body: payload
    })
  }

  const canAccess = (path: string) => canAccessRoute(session.value.user?.role ?? null, path)
  const visibleLinks = <T extends { children?: T[], to?: string }>(links: T[]) =>
    filterNavigationLinks(links, session.value.user?.role ?? null) as T[]

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
