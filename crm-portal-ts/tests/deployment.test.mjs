import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

async function readProjectFile(relativePath) {
  return await readFile(join(projectRoot, relativePath), 'utf8')
}

test('production deployment artifacts exist and wire backend, frontend, and reverse proxy', async () => {
  const [composeFile, backendDockerfile, frontendDockerfile, nginxConfig] = await Promise.all([
    readProjectFile('docker-compose.production.yml'),
    readProjectFile('Dockerfile'),
    readProjectFile('frontend/Dockerfile'),
    readProjectFile('ops/nginx/default.conf')
  ])

  assert.match(composeFile, /services:/)
  assert.match(composeFile, /backend:/)
  assert.match(composeFile, /frontend:/)
  assert.match(composeFile, /reverse-proxy:/)
  assert.match(composeFile, /CRM_PORTAL_TS_BACKEND_HOST_PORT:-8080/)
  assert.match(composeFile, /CRM_PORTAL_TS_PROXY_PORT:-80/)
  assert.match(composeFile, /CRM_PORTAL_TS_ENV_FILE:-\.env/)
  assert.match(composeFile, /NUXT_API_BASE:\s*http:\/\/backend:8080/)
  assert.match(composeFile, /NUXT_PUBLIC_API_BASE:\s*\/api\/v1/)
  assert.match(composeFile, /healthcheck:/)
  assert.match(composeFile, /health\/ready/)
  assert.match(composeFile, /health\/live/)

  assert.match(backendDockerfile, /npm run build/)
  assert.match(backendDockerfile, /CMD \["node", "dist\/main\.js"\]/)

  assert.match(frontendDockerfile, /RUN npm run build/)
  assert.match(frontendDockerfile, /CMD \["node", "\.output\/server\/index\.mjs"\]/)

  assert.match(nginxConfig, /location \/api\/ \{/)
  assert.match(nginxConfig, /proxy_pass http:\/\/backend:8080;/)
  assert.match(nginxConfig, /location = \/health \{/)
  assert.match(nginxConfig, /location \/health\/ \{/)
  assert.match(nginxConfig, /location \/ \{/)
  assert.match(nginxConfig, /proxy_pass http:\/\/frontend:3000;/)
})

test('frontend Nitro agent endpoints are disabled by default and require explicit enable flag', async () => {
  const [nuxtConfig, agentStartRoute, agentStatusRoute] = await Promise.all([
    readProjectFile('frontend/nuxt.config.ts'),
    readProjectFile('frontend/server/api/agent/start.post.ts'),
    readProjectFile('frontend/server/api/agent/status.get.ts')
  ])

  assert.match(nuxtConfig, /NUXT_API_BASE/)
  assert.doesNotMatch(nuxtConfig, /PORTAL_API_BASE/)

  assert.match(agentStartRoute, /NUXT_ENABLE_AGENT_API/)
  assert.match(agentStartRoute, /statusCode:\s*403/)
  assert.match(agentStatusRoute, /NUXT_ENABLE_AGENT_API/)
  assert.match(agentStatusRoute, /statusCode:\s*403/)
})
