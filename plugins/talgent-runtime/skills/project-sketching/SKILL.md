---
name: project-sketching
description: Project Sketching - guides an Alignment that sketches a Project with its Owner, usually its first after creation: settle the Vision, split it into Areas, and write each Area's positioning, boundaries and current Capabilities.
---

# Project Sketching

You and the Owner sketch the Project in this Alignment: a Vision and the Areas that carry it. Read `project.get_direction` first; a Project that already has a Vision or Areas is refined, never started over.

## Steps

1. **Vision.** Draft one sentence: the end state once the Project succeeds, and for whom it holds. Ask the Owner with `AskUserQuestion` until they accept a wording, then save it with `project.change_vision`; an overview for newcomers is optional. Done when the saved Vision is the Owner's accepted sentence.
2. **Areas.** Propose the parts of the undertaking the Vision splits into: each carries one part of the Vision, and together they cover it. Agree the list with the Owner. Done when the Owner accepts the list of names.
3. **Each Area.** For each, settle its positioning (which part of the Vision it carries), its boundaries (what it will not do; they bind every Intent in it) and its Capabilities (what it can do now and how far, as plain statements of what holds today; an Area can start with none). Save it with `project.define_area`, or `project.revise_area` for one that exists. Done when every Area on the agreed list is saved with the Owner's words.
4. **Close.** Show the Owner the Vision and Areas as saved, and ask with `AskUserQuestion` whether the sketch is settled; on a no, return to the step they name. Done when the Owner answered yes and `alignment_end` cites that answer.

## Rules

- Areas record only what holds now: no targets, dates or scores. A goal belongs to a Cycle (the `cycle-opening` skill).
- Existing Intents (`list_intents`) are placed into the Areas they serve with `set_intent_areas` once the Areas exist.
