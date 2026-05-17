const INTERNAL_ROLES = ['admin', 'manager', 'service', 'view']
const ADMIN_ROLES = ['admin']

const PUBLIC_PREFIXES = ['/settings', '/architect']
const ROUTE_POLICIES = [
  { prefix: '/admin', roles: ADMIN_ROLES },
  { prefix: '/settings', roles: null },
  { prefix: '/architect', roles: null },
  { prefix: '/', roles: INTERNAL_ROLES }
]

function normalizePath(path) {
  if (!path) {
    return '/'
  }

  const [pathname] = String(path).split('?')
  return pathname || '/'
}

function getRoutePolicy(path) {
  const normalized = normalizePath(path)

  return ROUTE_POLICIES.find((policy) => {
    if (policy.prefix === '/') {
      return true
    }

    return normalized === policy.prefix || normalized.startsWith(`${policy.prefix}/`)
  }) ?? ROUTE_POLICIES[ROUTE_POLICIES.length - 1]
}

export function isPublicRoute(path) {
  const normalized = normalizePath(path)
  return PUBLIC_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))
}

export function canAccessRoute(role, path) {
  const policy = getRoutePolicy(path)
  if (!policy || policy.roles === null) {
    return true
  }

  if (!role) {
    return false
  }

  return policy.roles.includes(role)
}

export function filterNavigationLinks(links, role) {
  return (links || []).reduce((result, link) => {
    const nextLink = { ...link }

    if (Array.isArray(link.children)) {
      nextLink.children = filterNavigationLinks(link.children, role)
    }

    const hasVisibleChildren = Array.isArray(nextLink.children) && nextLink.children.length > 0
    const hasDirectTarget = typeof nextLink.to === 'string'
    const allowDirectTarget = !hasDirectTarget || canAccessRoute(role, nextLink.to)

    if ((hasDirectTarget && allowDirectTarget) || (!hasDirectTarget && hasVisibleChildren)) {
      result.push(nextLink)
    }

    return result
  }, [])
}
