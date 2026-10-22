import { readFileSync } from "node:fs";

// Before a Turn ends, shows the Work's open Actions once so the Agent reports
// or keeps each. The list comes from the Gateway's list_open_actions tool in
// one stateless MCP request; the Credential Proxy adds the Work credential.
// A Turn always ends when the list cannot be read: this hook exits 0 on every
// path, since exit code 2 would hold the Turn.
async function review(input) {
  if (input.stop_hook_active) return null;
  const gateway = process.env.TALGENT_GATEWAY_ADDRESS?.replace(/\/+$/, "");
  if (!gateway) return null;
  const response = await fetch(`${gateway}/mcp`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "list_open_actions", arguments: {} } }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) return null;
  const { result } = await response.json();
  if (!result || result.isError) return null;
  const { actions } = JSON.parse(result.content[0].text);
  if (!actions?.length) return null;
  const listed = actions.map(a => `- ${JSON.stringify(a.purpose)} (${a.state}) — Decision ${JSON.stringify(a.conclusion)}: decision_id ${a.decision_id}, action_id ${a.action_id}`);
  return { decision: "block", reason: `This Work has ${actions.length} open Action(s) (talgent-runtime:deciding):\n${listed.join("\n")}` };
}

try {
  const held = await review(JSON.parse(readFileSync(0, "utf8") || "{}"));
  if (held) process.stdout.write(JSON.stringify(held));
} catch {
  // The Turn ends without review.
}
