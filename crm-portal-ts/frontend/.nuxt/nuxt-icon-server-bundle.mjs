function createRemoteCollection(fetchEndpoint) {
  let _cache
  return async () => {
    if (_cache)
      return _cache
    const res = await fetch(fetchEndpoint).then(r => r.json())
    _cache = res
    return res
  }
}

export const collections = {
  'heroicons': () => import('@iconify-json/heroicons/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'lucide': () => import('@iconify-json/lucide/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'simple-icons': () => import('@iconify-json/simple-icons/icons.json', { with: { type: 'json' } }).then(m => m.default),
}