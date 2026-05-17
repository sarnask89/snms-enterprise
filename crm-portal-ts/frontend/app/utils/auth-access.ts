type InternalRole = 'admin' | 'manager' | 'service' | 'view'
type RouteRole = InternalRole | null

type NavigationLink = {
  label?: string
  to?: string
  children?: NavigationLink[]
  [key: string]: unknown
}

const INTERNAL_ROLES: InternalRole[] = ['admin', 'manager', 'service', 'view']
const ADMIN_ROLES: InternalRole[] = ['admin']

const PUBLIC_PREFIXES = ['/settings', '/architect']
const ROUTE_POLICIES: Array<{ prefix: string, roles: InternalRole[] | null }> = [
  { prefix: '/admin', roles: ADMIN_ROLES },
  { prefix: '/settings', roles: null },
  { prefix: '/architect', roles: null },
  { prefix: '/', roles: INTERNAL_ROLES }
]

function normalizePath(path: string | null | undefined) {
  if (!path) {
    return '/'
  }

  const [pathname] = String(path).split('?')
  return pathname || '/'
}

function getRoutePolicy(path: string | null | undefined) {
  const normalized = normalizePath(path)

  return ROUTE_POLICIES.find((policy) => {
    if (policy.prefix === '/') {
      return true
    }

    return normalized === policy.prefix || normalized.startsWith(`${policy.prefix}/`)
  }) ?? ROUTE_POLICIES[ROUTE_POLICIES.length - 1]
}

export function isPublicRoute(path: string | null | undefined) {
  const normalized = normalizePath(path)
  return PUBLIC_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))
}

export function canAccessRoute(role: RouteRole, path: string | null | undefined) {
  const policy = getRoutePolicy(path)
  if (!policy || policy.roles === null) {
    return true
  }

  if (!role) {
    return false
  }

  return policy.roles.includes(role)
}

export function filterNavigationLinks(links: NavigationLink[] | null | undefined, role: RouteRole) {
  return (links || []).reduce<NavigationLink[]>((result, link) => {
    const nextLink: NavigationLink = { ...link }

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
