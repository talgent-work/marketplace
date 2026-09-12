import fs from "node:fs";
import path from "node:path";

for await (const _chunk of process.stdin) {
  // Drain the hook payload so a large Stop input cannot block the caller.
}

const agentSessionId = clean(process.env.TALGENT_AGENT_SESSION_ID);
const executionId = clean(process.env.TALGENT_EXECUTION_ID);
const proof = clean(process.env.TALGENT_EXECUTION_PROOF);
const controlplaneAddress = clean(process.env.TALGENT_CONTROLPLANE_ADDRESS);
const orchestratorAddress = clean(process.env.TALGENT_ORCHESTRATOR_ADDRESS);
let projectId = "";

try {
  if (!agentSessionId || !executionId || !proof || !controlplaneAddress || !orchestratorAddress) {
    throw new Error("Candidate finalization check is missing native Session configuration");
  }
  const response = await fetch(`${orchestratorAddress.replace(/\/+$/, "")}/orchestrator.v1.MailboxService/GetExecutionContext`, {
    method: "POST", headers: requestHeaders(), body: "{}", signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`GetExecutionContext returned HTTP ${response.status}`);
  const scope = await response.json();
  if (scope?.sessionId !== agentSessionId || scope?.executionId !== executionId || !clean(scope?.projectId)) {
    throw new Error("Candidate finalization scope does not match the native Session");
  }
  if (scope.purpose !== "work") process.exit(0);
  projectId = scope.projectId;
  const candidates = await listAllCandidates(controlplaneAddress, projectId, agentSessionId);
  const blockingCandidate = candidates.find((candidate) =>
    blockingState(candidate?.state) !== ""
  );
  if (blockingCandidate) {
    const state = blockingState(blockingCandidate.state);
    process.stdout.write(`${JSON.stringify({
      decision: "block",
      reason: blockingReason(state, clean(blockingCandidate.candidateId) || "unknown"),
    })}\n`);
  }
} catch (error) {
  logFailedOpen(error);
}

async function listAllCandidates(address, currentProjectId, currentAgentSessionId) {
  const candidates = [];
  const seenPageTokens = new Set();
  let pageToken = "";

  for (;;) {
    const body = {
      projectId: currentProjectId,
      agentSessionId: currentAgentSessionId,
      pageSize: 50,
      ...(pageToken ? { pageToken } : {}),
    };
    const response = await fetch(
      `${address.replace(/\/+$/, "")}/projectasset.v1.ProjectAssetKnowledgeService/ListCandidates`,
      {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) {
      throw new Error(`ListCandidates returned HTTP ${response.status}`);
    }

    const page = await response.json();
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      throw new Error("ListCandidates returned a malformed response");
    }
    const pageCandidates = Object.hasOwn(page, "candidates") ? page.candidates : [];
    if (!Array.isArray(pageCandidates)) {
      throw new Error("ListCandidates returned a malformed response");
    }
    candidates.push(...pageCandidates);

    const nextPageToken = clean(page.nextPageToken);
    if (!nextPageToken) {
      return candidates;
    }
    if (seenPageTokens.has(nextPageToken)) {
      throw new Error("ListCandidates repeated a page token");
    }
    seenPageTokens.add(nextPageToken);
    pageToken = nextPageToken;
  }
}

function requestHeaders() {
  return {
    "content-type": "application/json",
    "connect-protocol-version": "1",
    "x-talgent-session-id": agentSessionId,
    "x-talgent-execution-id": executionId,
    "x-talgent-execution-proof": proof,
  };
}

function blockingState(value) {
  if (value === 1) {
    return "awaiting_review";
  }
  if (value === 2) {
    return "awaiting_author_response";
  }
  const normalized = clean(value)
    .toLowerCase()
    .replace(/^candidate_state_/, "");
  return normalized === "awaiting_review" || normalized === "awaiting_author_response"
    ? normalized
    : "";
}

function blockingReason(state, candidateId) {
  if (state === "awaiting_author_response") {
    return `Candidate ${candidateId} is awaiting your response. Read the Wiki Maintainer feedback, then call knowledge.submit_candidate with a new Revision or knowledge.withdraw_candidate before ending this session.`;
  }
  return `Candidate ${candidateId} is still in normal review. Check the mailbox for the Wiki Maintainer outcome, or call knowledge.withdraw_candidate if it should no longer proceed, before ending this session.`;
}

function logFailedOpen(error) {
  const logPath = process.env.TALGENT_PLUGIN_HOOK_LOG ||
    "/tmp/talgent-runtime-hooks.log";
  const record = {
    timestamp: new Date().toISOString(),
    level: "warn",
    event: "candidate_finalization_check_failed_open",
    projectId,
    agentSessionId,
    error: error instanceof Error ? error.message : String(error),
  };

  try {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, `${JSON.stringify(record)}\n`);
  } catch {
    // The Candidate check is fail-open even when its warning sink is unavailable.
  }
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}
