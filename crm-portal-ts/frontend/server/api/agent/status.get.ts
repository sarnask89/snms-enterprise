import fs from 'fs';
import path from 'path';
import { createError } from 'h3';

export default defineEventHandler(() => {
  const agentApiEnabled = process.env.NUXT_ENABLE_AGENT_API === 'true'

  if (!agentApiEnabled) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Agent API is disabled'
    })
  }

  const rootDir = path.resolve(process.cwd(), '../../')
  const pidFile = path.join(rootDir, '.agent.pid')
  const logFile = path.join(rootDir, 'agent.log')

  let isRunning = false
  let logs = ''

  if (fs.existsSync(pidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf-8'))
      process.kill(pid, 0)
      isRunning = true
    } catch {
      isRunning = false
    }
  }

  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, 'utf-8')
    logs = content.slice(-2000)
  }

  return { isRunning, logs }
})
