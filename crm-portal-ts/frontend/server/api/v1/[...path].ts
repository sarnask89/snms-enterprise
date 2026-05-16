import { createError, getRequestURL, getRouterParam, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing API path'
    })
  }

  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const baseUrl = String(config.apiBase || 'http://127.0.0.1:8080').replace(/\/+$/, '')
  const targetUrl = `${baseUrl}/api/v1/${path}${requestUrl.search}`

  return proxyRequest(event, targetUrl)
})
