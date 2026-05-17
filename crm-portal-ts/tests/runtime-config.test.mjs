import assert from 'node:assert/strict'
import test from 'node:test'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const runtimeConfigModule = await import(pathToFileURL(join(projectRoot, 'dist/runtime_config.js')).href)

test('validateRuntimeConfig rejects insecure production defaults', () => {
  assert.throws(
    () =>
      runtimeConfigModule.validateRuntimeConfig({
        CRM_ENV: 'production',
        CRM_PORTAL_TS_SESSION_SECRET: 'replace-with-long-random-secret',
        CRM_ENCRYPTION_KEY: 'replace-with-base64-key',
        CRM_ADMIN_PASSWORD: 'replace-me'
      }),
    /CRM_PORTAL_TS_SESSION_SECRET, CRM_ENCRYPTION_KEY, CRM_ADMIN_PASSWORD/
  )
})

test('validateRuntimeConfig accepts explicit production secrets', () => {
  assert.doesNotThrow(() =>
    runtimeConfigModule.validateRuntimeConfig({
      CRM_ENV: 'production',
      CRM_PORTAL_TS_SESSION_SECRET: 'prod-session-secret',
      CRM_ENCRYPTION_KEY: 'base64-like-but-explicit',
      CRM_ADMIN_PASSWORD: 'Admin123!'
    })
  )
})
