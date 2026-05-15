// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  compatibilityDate: '2024-07-04',
  srcDir: 'app/',
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true
      }
    }
  },
  runtimeConfig: {
    public: {
      ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
      ollamaModel: process.env.OLLAMA_MODEL || 'qwen-940mx'
    }
  }
})
