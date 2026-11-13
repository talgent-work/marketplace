// The Project a Work was started in the name of, read from its Work Caller as
// TALGENT_WORK_CALLER names it on a Managed Computer: "<kind>:<id>", split at
// the first ":" after trimming, as the Talgent MCP Gateway reads the
// x-talgent-work-caller header. It is empty for any other Work Caller or a
// malformed value.
export function projectOfWorkCaller(value = process.env.TALGENT_WORK_CALLER) {
  const raw = (value || "").trim();
  const separator = raw.indexOf(":");
  if (separator < 0) {
    return "";
  }
  const kind = raw.slice(0, separator).trim();
  const id = raw.slice(separator + 1).trim();
  return kind === "project" && id ? id : "";
}
