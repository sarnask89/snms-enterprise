import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const repoRoot = join(projectRoot, '..')

async function readText(...parts) {
  return await readFile(join(...parts), 'utf8')
}

test('ci workflow runs the release gate and container smoke for crm-portal-ts', async () => {
  const [packageJsonText, smokeScript, workflowText] = await Promise.all([
    readText(projectRoot, 'package.json'),
    readText(projectRoot, 'scripts', 'container-smoke.mjs'),
    readText(repoRoot, '.github', 'workflows', 'crm-portal-ts-release-gate.yml')
  ])

  const packageJson = JSON.parse(packageJsonText)
  assert.equal(packageJson.scripts['container:smoke'], 'node scripts/container-smoke.mjs')
  assert.equal(packageJson.scripts['verify:ci'], 'npm run verify:release && npm run container:smoke')

  assert.match(smokeScript, /docker", \["--version"\]/)
  assert.match(smokeScript, /docker", \[\.\.\.composeArgs, "up", "-d", "--build"\]/)
  assert.match(smokeScript, /health\/ready/)
  assert.match(smokeScript, /api\/v1\/module-status/)
  assert.match(smokeScript, /down", "-v"/)

  assert.match(workflowText, /working-directory:\s*crm-portal-ts/)
  assert.match(workflowText, /npm ci/)
  assert.match(workflowText, /npm ci --prefix frontend/)
  assert.match(workflowText, /npm run verify:ci/)
})
