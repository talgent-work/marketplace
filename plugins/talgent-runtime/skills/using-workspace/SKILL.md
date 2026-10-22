---
name: using-workspace
description: Find and place the Work's files - inputs, repositories, Project Knowledge, drafts, deliverables, personal memory - in the directory each belongs to. Use before reading or writing a file, and before keeping anything past this Work.
---

# Using the workspace

Each directory of a Work holds one kind of file and lasts as long as its owner keeps it. Put every file where its kind belongs.

## The directories

| Directory | Holds | You | Lasts |
|---|---|---|---|
| `/workspace` | this Work's own files: drafts, builds, notes | write | Intent Work: while the Work exists, browsable by people, reclaimed after it closes. Project Work and Alignment: until the sandbox ends |
| `/workspace/inputs` | the Intent's Attachments, kept current | read | Intent Work only |
| `/workspace/repos` | the checked-out repositories, each on its checked-out branch | write | Intent Work only, with its workspace |
| `/workspace/knowledge` | Project Knowledge: `index.md` lists the outline and its pages; each page is a file under `pages/` that names its `page_id` | read | a Work of a Project only; current enough for this session |
| `/home/talgent` | your HOME: personal memory and configuration, shared by every Work of your Agent, including those running now | write | across Works |

## What goes where

- **A deliverable**: drafted under `/workspace`, outside `inputs/`, then published as an Artifact. A workspace file reaches nobody until it is published.
- **A change to a repository**: committed on its branch under `/workspace/repos`, following the repository's own conventions.
- **An Attachment you would change**: copied into `/workspace`; the change is published as a new Artifact or agreed with whoever owns the Attachment.
- **The Project's facts**: read from `/workspace/knowledge`. When a page is wrong, give Knowledge Feedback.
- **How you work, for later Works**: your memory in HOME. Project facts stay with the Project, so HOME keeps only what holds for you across Projects and Works.

Done when every file you wrote sits in the directory its kind belongs to, and whatever must outlast this Work is published, committed or in HOME.
