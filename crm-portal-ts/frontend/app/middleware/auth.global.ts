import { canAccessRoute } from '../utils/auth-access'

export default defineNuxtRouteMiddleware(async (to) => {
  const { session, loadSession } = usePortalAuth()
  await loadSession({ silent: true })

  const role = session.value.user?.role ?? null
  if (canAccessRoute(role, to.path)) {
    return
  }

  const reason = role ? 'forbidden' : 'auth'
  return navigateTo({
    path: '/settings',
    query: {
      reason,
      redirect: to.fullPath
    }
  })
})
