export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', () => {
    const token = useCookie('auth_token')

    if (token.value) {
      // In a real app, we would set the Authorization header for all $fetch calls
      // Nuxt 3 way is often using useRequestFetch or wrapping $fetch
    }
  })
})
