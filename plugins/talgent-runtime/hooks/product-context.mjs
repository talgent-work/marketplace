import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The product context a session starts with: the core product for every Work,
// and Orchestra's for a Work of a Project. On a Cloud every Work of a Project
// is created with its Project's knowledge mounted read-only and a Personal
// Work has none, so the mount tells them apart, as it does for the knowledge
// index; on a Managed Computer, which has no mount, TALGENT_PROJECT_ID names
// the Work's Project.
const plugin = process.env.CLAUDE_PLUGIN_ROOT || join(import.meta.dirname, "..");
const project = process.env.TALGENT_PROJECT_ID || "";
// The Cloud mount path applies only in a Cloud sandbox, whose Work root is
// /workspace.
const cloud = (process.env.TALGENT_WORK_ROOT || "/workspace") === "/workspace";
const knowledge = process.env.TALGENT_KNOWLEDGE_ROOT || (cloud ? "/workspace/knowledge" : "");
const references = join(plugin, "references");

let context = readFileSync(join(references, "product.md"), "utf8");
if (project || (knowledge && existsSync(knowledge))) {
  context += "\n" + readFileSync(join(references, "orchestra.md"), "utf8");
  context += `\nThe flow files named above are in ${join(references, "flows")}/.\n`;
}
process.stdout.write(context);
