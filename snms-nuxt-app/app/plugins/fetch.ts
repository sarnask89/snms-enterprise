import { ofetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie('auth_token')

  globalThis.$fetch = ofetch.create({
    onRequest({ options }) {
      if (token.value) {
        options.headers = options.headers || {}
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${token.value}`)
        } else if (Array.isArray(options.headers)) {
          options.headers.push(['Authorization', `Bearer ${token.value}`])
        } else {
          options.headers.Authorization = `Bearer ${token.value}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
      }
    }
  })
})
