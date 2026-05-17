import { c as defineEventHandler } from '../../../_/nitro.mjs';
import fs from 'fs';
import path from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

const status_get = defineEventHandler((event) => {
  const rootDir = path.resolve(process.cwd(), "../../");
  const pidFile = path.join(rootDir, ".agent.pid");
  const logFile = path.join(rootDir, "agent.log");
  let isRunning = false;
  let logs = "";
  if (fs.existsSync(pidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(pidFile, "utf-8"));
      process.kill(pid, 0);
      isRunning = true;
    } catch (e) {
      isRunning = false;
    }
  }
  if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, "utf-8");
    logs = content.slice(-2e3);
  }
  return { isRunning, logs };
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
