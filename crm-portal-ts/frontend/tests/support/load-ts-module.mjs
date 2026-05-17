import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'
import ts from 'typescript'

export async function importTypeScriptModule(relativePathFromFrontendRoot) {
  const frontendRoot = process.cwd()
  const absolutePath = resolve(frontendRoot, relativePathFromFrontendRoot)
  const source = await readFile(absolutePath, 'utf8')

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler
    },
    fileName: basename(absolutePath)
  })

  const tempDir = await mkdtemp(join(tmpdir(), 'crm-portal-ts-'))
  const tempPath = join(tempDir, basename(relativePathFromFrontendRoot, '.ts') + '.mjs')
  await writeFile(tempPath, transpiled.outputText, 'utf8')

  return await import(pathToFileURL(tempPath).href)
}
