---
name: cycle-opening
description: Cycle Opening - guides an Alignment that opens the Project's next Cycle with its Owner: set the Cycle Goal and Expected Capabilities, choose Intents from the pool or record new ones, then open the Cycle.
---

# Cycle Opening

A Cycle is the Project's next step toward its Vision, a small OKR: its Cycle Goal is the objective and its Expected Capabilities the key results. Read `project.get_direction` first: the Vision, the Areas with their Capabilities, and the Cycles so far. At most one Cycle is Open at a time; when one still is, review it first (the `cycle-review` skill).

## Steps

1. **Goal.** Propose what this step accomplishes toward the Vision, and a time window that starts after the previous Cycle ends. Ask the Owner with `AskUserQuestion` until they accept both. Done when the Owner accepted a goal and a window.
2. **Expected Capabilities.** For the Areas the goal moves, write the Capability statement each makes true when the Cycle ends, one that will be plainly true or false then. Agree them with the Owner. Done when each is accepted and names an existing Area.
3. **Plan.** Save the Cycle with `project.plan_cycle`, or `project.revise_cycle` when a Planned one exists for this step. A refusal for an overlapping window means another Cycle holds those dates: agree new dates. Done when the Cycle is saved as Planned with the accepted goal, window and Expected Capabilities.
4. **Intents.** Read the pool with `list_intents` and `cycle: "pool"`, and in a review the Intents carried over from the Cycle just ended, and propose those that deliver the Expected Capabilities; record the missing work with `create_intent`. Place the agreed Intents with `set_intent_cycle`. Done when every Expected Capability has at least one Intent in the Cycle, or the Owner accepted it without one.
5. **Open.** Ask the Owner with `AskUserQuestion` to confirm opening, then open it with `project.open_cycle`. Done when the Cycle is Open and `alignment_end` cites the Owner's confirmation.

## Rules

- No Intent field refers to the Cycle Goal or an Expected Capability; an Intent belongs to the Cycle and nothing more.
- Progress is read from the Intents when shown, never written down.
