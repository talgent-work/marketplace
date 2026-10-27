import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The product context a session starts with: the core product for every Work,
// and Orchestra's for a Work of a Project. Every Work of a Project is created
// with its Project's knowledge mounted read-only and a Personal Work has none,
// so the mount tells them apart, as it does for the knowledge index.
const plugin = process.env.CLAUDE_PLUGIN_ROOT || join(import.meta.dirname, "..");
const knowledge = process.env.TALGENT_KNOWLEDGE_ROOT || "/workspace/knowledge";
const references = join(plugin, "references");

let context = readFileSync(join(references, "product.md"), "utf8");
if (existsSync(knowledge)) {
  context += "\n" + readFileSync(join(references, "orchestra.md"), "utf8");
  context += `\nThe flow files named above are in ${join(references, "flows")}/.\n`;
}
process.stdout.write(context);
