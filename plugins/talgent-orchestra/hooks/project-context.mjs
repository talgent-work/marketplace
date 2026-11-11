import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Orchestra's product context for a Work of a Project, beside the core
// product the core runtime plugin gives every Work. On a Cloud every Work of
// a Project is created with its Project's knowledge mounted read-only and a
// Personal Work has none, so the mount tells them apart, as it does for the
// knowledge index; on a Managed Computer, which has no mount,
// TALGENT_PROJECT_ID names the Work's Project. A Work without a Project gets
// nothing, even when this plugin is installed in it.
const plugin = process.env.CLAUDE_PLUGIN_ROOT || join(import.meta.dirname, "..");
const project = process.env.TALGENT_PROJECT_ID || "";
// The Cloud mount path applies only in a Cloud sandbox, whose Work root is
// /workspace.
const cloud = (process.env.TALGENT_WORK_ROOT || "/workspace") === "/workspace";
const knowledge = process.env.TALGENT_KNOWLEDGE_ROOT || (cloud ? "/workspace/knowledge" : "");
const references = join(plugin, "references");

if (project || (knowledge && existsSync(knowledge))) {
  let context = readFileSync(join(references, "orchestra.md"), "utf8");
  context += `\nThe flow files named above are in ${join(references, "flows")}/.\n`;
  process.stdout.write(context);
}
