import { c as defineEventHandler, e as createError, r as readBody } from '../../../_/nitro.mjs';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
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

const start_post = defineEventHandler(async (event) => {
  const agentApiEnabled = process.env.NUXT_ENABLE_AGENT_API === "true";
  if (!agentApiEnabled) {
    throw createError({
      statusCode: 403,
      statusMessage: "Agent API is disabled"
    });
  }
  const body = await readBody(event);
  const target = body.target || "app";
  const rootDir = path.resolve(process.cwd(), "../../");
  const pidFile = path.join(rootDir, ".agent.pid");
  const logFile = path.join(rootDir, "agent.log");
  if (fs.existsSync(pidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(pidFile, "utf-8"));
      process.kill(pid, 0);
      return { status: "already_running", message: "Agent is already running." };
    } catch {
      fs.unlinkSync(pidFile);
    }
  }
  const scriptPath = path.join(rootDir, "translate_to_ts.py");
  const pythonPath = path.join(rootDir, ".venv", "Scripts", "python.exe");
  const out = fs.openSync(logFile, "w");
  const err = fs.openSync(logFile, "a");
  try {
    const child = spawn(pythonPath, [scriptPath, "--src", target, "--dest", "crm-portal-ts/src"], {
      cwd: rootDir,
      detached: true,
      stdio: ["ignore", out, err]
    });
    child.unref();
    if (typeof child.pid !== "number") {
      throw new Error("Agent process did not expose a valid pid");
    }
    fs.writeFileSync(pidFile, child.pid.toString());
    return { status: "started", message: `Agent started on target: ${target}` };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown agent startup error"
    };
  }
});

export { start_post as default };
//# sourceMappingURL=start.post.mjs.map
