import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

// A local delivery reminder, not product authorization. The Work's checkouts
// live under its startup directory's repos/; inspect them even after a cd.
function check(input) {
  if (input.tool_name !== "mcp__talgent__advance_intent_status" || input.tool_input?.status?.trim() !== "In Review") return {};
  const project = process.env.CLAUDE_PROJECT_DIR || input.cwd;
  if (!project) throw new Error("Missing project directory");
  const root = resolve(project);
  const candidates = new Set([root, resolve(input.cwd || root)]);
  const repos = join(root, "repos");
  if (existsSync(repos)) {
    for (const entry of readdirSync(repos, { withFileTypes: true })) {
      if (entry.isDirectory()) candidates.add(join(repos, entry.name));
    }
  }
  const deadline = Date.now() + 8_000;
  for (const directory of candidates) {
    if (!existsSync(join(directory, ".git"))) continue;
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("Repository check timed out");
    const diff = execFileSync("git", ["-C", directory, "status", "--porcelain=v1", "-z", "--untracked-files=normal"], {
      encoding: "utf8", timeout: remaining, stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    });
    if (diff) return deny("Repository changes remain. Handle the code diff and review this Intent's workspace cleanup before moving to In Review, then retry. Check that code and final Artifacts have been delivered, following the delivering-intent guidance.");
  }
  return {};
}

function deny(reason) {
  return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } };
}

try {
  process.stdout.write(JSON.stringify(check(JSON.parse(readFileSync(0, "utf8")))));
} catch {
  // Do not expose Git output, paths or file content in hook failures.
  process.stdout.write(JSON.stringify(deny("Could not check repository changes. Resolve the local check failure before moving this Intent to In Review, then retry.")));
}
