# Talgent Plugin Marketplace

This repository is the authoritative distribution source for Talgent's built-in
Claude Code plugins. The platform synchronizes this marketplace independently of
application and sandbox image releases. It does not vendor the official Anthropic
plugins; use `anthropics/claude-plugins-official` as a separate marketplace.

Plugin development sources live under `plugins/` in `jacexh/talgent`. Its
`Publish Marketplace` workflow checks out this repository independently, copies
changed plugin packages, increments their declared versions, and publishes a
commit plus per-plugin version tags. It does not update a submodule pointer.
Manual dispatch selects a source branch, tag or commit and defaults to dry-run.
Versions use only `x.y.z`: development/test publications increment `z`; changes
merged to `master` increment `y` and reset `z` to zero. An already tested package
is promoted to its formal version once; repeating the completed publication skips.
The catalog commit and its `<plugin>-v<x.y.z>` tags are pushed atomically.

The platform checks declared Plugin versions during incremental synchronization.
Unchanged versions reuse the retained publication. Publish a new version when
changing a package; force-refresh does not overwrite conflicting content under an
existing source, slug and version identity. Existing Works keep their fixed release.
