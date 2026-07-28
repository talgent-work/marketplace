import fs from "node:fs";
import path from "node:path";

for await (const _chunk of process.stdin) {
  // Drain the hook payload so a large Stop input cannot block the caller.
}

const runtimePurpose = clean(process.env.TALGENT_RUNTIME_PURPOSE);
if (runtimePurpose && runtimePurpose !== "work" && runtimePurpose !== "normal") {
  process.exit(0);
}

const projectId = clean(process.env.TALGENT_PROJECT_ID);
const workId = clean(process.env.TALGENT_WORK_ID);
const projectAssetAddress = clean(process.env.TALGENT_PROJECT_ASSET_ADDR);

try {
  if (!projectId || !workId || !projectAssetAddress) {
    throw new Error("Candidate finalization check is missing Project Knowledge runtime configuration");
  }

  const candidates = await listAllCandidates(projectAssetAddress, projectId, workId);
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

async function listAllCandidates(address, currentProjectId, currentWorkId) {
  const candidates = [];
  const seenPageTokens = new Set();
  let pageToken = "";

  for (;;) {
    const body = {
      projectId: currentProjectId,
      workId: currentWorkId,
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
    "x-talgent-service-id": "executor",
    ...optionalHeader(
      "x-talgent-runtime-instance-id",
      process.env.TALGENT_RUNTIME_INSTANCE_ID,
    ),
    ...optionalHeader(
      "x-talgent-runtime-purpose",
      process.env.TALGENT_RUNTIME_PURPOSE,
    ),
    ...optionalHeader(
      "x-talgent-runtime-owner-ref",
      process.env.TALGENT_RUNTIME_OWNER_REF,
    ),
  };
}

function optionalHeader(name, value) {
  const normalized = clean(value);
  return normalized ? { [name]: normalized } : {};
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
    workId,
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
