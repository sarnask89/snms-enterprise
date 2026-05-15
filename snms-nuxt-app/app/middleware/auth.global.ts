export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')

  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
