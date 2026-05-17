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

test('frontend exposes Nuxt-native lint and typecheck tooling', async () => {
  const [frontendPackageJson, frontendNuxtConfig, frontendEslintConfig] = await Promise.all([
    readProjectFile('frontend/package.json'),
    readProjectFile('frontend/nuxt.config.ts'),
    readProjectFile('frontend/eslint.config.mjs')
  ])

  assert.match(frontendPackageJson, /"lint"\s*:\s*"eslint \."/)
  assert.match(frontendPackageJson, /"typecheck"\s*:\s*"nuxt typecheck"/)
  assert.match(frontendPackageJson, /"@nuxt\/eslint"/)
  assert.match(frontendPackageJson, /"vue-tsc"/)

  assert.match(frontendNuxtConfig, /['"]@nuxt\/eslint['"]/)
  assert.match(frontendNuxtConfig, /eslint:\s*\{/)

  assert.match(frontendEslintConfig, /withNuxt/)
  assert.match(frontendEslintConfig, /'\.\/\.nuxt\/eslint\.config\.mjs'/)
})
