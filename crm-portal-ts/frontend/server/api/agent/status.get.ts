import fs from 'fs';
import path from 'path';

export default defineEventHandler((event) => {
  const rootDir = path.resolve(process.cwd(), '../../');
  const pidFile = path.join(rootDir, '.agent.pid');
  const logFile = path.join(rootDir, 'agent.log');
  
  let isRunning = false;
  let logs = '';

  if (fs.existsSync(pidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf-8'));
      process.kill(pid, 0); 
      isRunning = true;
    } catch (e) {
      isRunning = false;
    }
  }

  if (fs.existsSync(logFile)) {
    // Read last 2000 characters
    const content = fs.readFileSync(logFile, 'utf-8');
    logs = content.slice(-2000);
  }

  return { isRunning, logs };
});
