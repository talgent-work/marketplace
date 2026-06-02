import fs from "node:fs";
import path from "node:path";

const chunks = [];
for await (const chunk of process.stdin) {
  chunks.push(Buffer.from(chunk));
}

const rawInput = Buffer.concat(chunks).toString("utf8");
let hookInput = rawInput;
try {
  hookInput = JSON.parse(rawInput);
} catch {
  // Keep the raw string when Claude Code changes hook payload shape.
}

const logPath = process.env.TALGENT_PLUGIN_HOOK_LOG || "/tmp/talgent-runtime-hooks.log";
const record = {
  timestamp: new Date().toISOString(),
  event: "skill_call",
  workId: process.env.TALGENT_WORK_ID || "",
  projectId: process.env.TALGENT_PROJECT_ID || "",
  sandboxId: process.env.TALGENT_SANDBOX_ID || "",
  hookInput,
};

fs.mkdirSync(path.dirname(logPath), { recursive: true });
fs.appendFileSync(logPath, `${JSON.stringify(record)}\n`);
