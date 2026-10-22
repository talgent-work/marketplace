import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The Project Knowledge index from the Work's read-only mount, printed when a
// session starts, resumes or is compacted. Pages beyond the budget are
// counted and left to the index file, so a large Project cannot crowd out the
// Work's own context. A Work without a Project has no mount and gets nothing;
// an unreadable mount says so rather than failing the session.
const root = process.env.TALGENT_KNOWLEDGE_ROOT || "/workspace/knowledge";
const budget = Number(process.env.TALGENT_KNOWLEDGE_INDEX_BYTES) || 8_000;

// The index writes the nature as a quoted string.
function unquote(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value.replace(/^"|"$/g, "");
  }
}

function knowledgeIndex(root, budget) {
  if (!existsSync(root)) return "";
  const file = join(root, "index.md");
  if (!existsSync(file)) return "# Project Knowledge\n\nNo knowledge yet: no Intent has reached Done.\n";
  let lines;
  try {
    lines = readFileSync(file, "utf8").split("\n");
  } catch {
    return `# Project Knowledge\n\nProject Knowledge is unavailable right now: ${file} could not be read.\n`;
  }
  let nature = "";
  const end = lines[0] === "---" ? lines.indexOf("---", 1) : -1;
  if (end > 0) {
    for (const line of lines.slice(1, end)) {
      if (line.startsWith("nature: ")) nature = unquote(line.slice("nature: ".length));
    }
    lines = lines.slice(end + 1);
  } else if (lines[0] === "---") {
    // An unterminated header: skip it up to the title.
    const title = lines.findIndex((line) => line.startsWith("# "));
    lines = title < 0 ? [] : lines.slice(title);
  }
  const out = [];
  let used = 0, more = 0, headed = false;
  for (const line of lines) {
    if (!headed && line.startsWith("# ")) {
      out.push(line, "", `Its pages are files under ${root}; the links below are relative to it.`);
      if (nature) out.push(`This Project is ${nature}.`);
      headed = true;
      continue;
    }
    if (line.startsWith("- ")) {
      const cost = Buffer.byteLength(line) + 1;
      if (more || used + cost > budget) {
        more++;
        continue;
      }
      used += cost;
    }
    out.push(line);
  }
  if (more) out.push("", `${more} more pages are listed in ${file}.`);
  return out.join("\n").replace(/\n*$/, "\n");
}

process.stdout.write(knowledgeIndex(root, budget));
