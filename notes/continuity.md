# Aesthetic review and continuity — 0.4.1

The strongest part of the collection is its restraint: warm objects, cool
structures, precise shapes, and generous space. The opening path and Branch
feel like parts of the same instrument. The next improvement is continuity:
keeping a sense of place as the learner moves between independent documents,
and making a familiar control look familiar in every lesson.

This review uses the merged source and rasterized scene output, including the
opening path, Branch's reunion, and Composition. These are precise scene
illustrations, not browser screenshots. The public preview was blocked in this
environment. Timing, native focus, touch feel, and actual iframe composition
still need inspection in a browser.

## What the review found

| Observation | Consequence | Decision |
|---|---|---|
| Objects and rails already share a recognizable material | The collection has an identity without decorative scenery | Preserve the palette and geometric vocabulary |
| The host removed the outgoing document before the new one restored | A load could expose an empty stage or an initial state before the saved state | Keep the previous view until the next document acknowledges restoration |
| The catalog and embedded lessons repeated the lesson glyph | Two headers competed to identify the same place | Keep the host glyph; hide the embedded duplicate while retaining standalone headers |
| Foundation lessons and the author kit had different range controls | The same inspection action changed appearance | Share one thin track, warm handle, and generous native hit area |
| A long map could leave the parent page scrolled when a lesson opened | The next encounter could begin partway down its scene | Start lessons at the top; remember each map scope's page, scroll, and chosen node |
| Branch presents one local decision; Composition presents a whole machine | Visual consistency alone cannot carry the conceptual jump | Add small encounters that make grouping and records useful |

Keep essential handles clear at rest. The faintest rails and the example-stack
control deserve attention in device observation: can a learner find an action
without a hover cue? Use spacing and a small number of elements to create quietness.
Do not keep reducing contrast as a substitute for reducing complexity.

## The implemented transition

The header stays in place. Navigation pauses the outgoing lesson and obtains
its snapshot, with the existing 180 ms fallback. The next document is prepared
at its real stage dimensions, transparent and inert. The previous view remains
visible while this happens. A still outline around the header glyph indicates
loading; it does not introduce an idle animation.

Once restoration is acknowledged, the outgoing surface fades for **110 ms**.
At the midpoint the host changes the surface, updates its glyph, and sets the
appropriate scroll position. The incoming surface fades for **180 ms**, then
receives input and focus. Page and scope changes use the same short cadence.

These are initial timing choices to judge on devices. A navigation transition
marks a change of encounter; it does not imply a mathematical transformation
between unrelated objects. The lesson's own scrubber still owns mathematical
motion. Reduced motion removes the fades, including when the preference changes
during a transition. Backgrounding settles presentation and pauses the lesson.

Fast subsequent navigation cancels unfinished work. At most two documents are
mounted during preparation; the outgoing document is removed at the handoff.
A failed or unresponsive incoming document leaves the previous view usable and
offers a wordless retry control with an accessible explanation. A six-second
readiness timeout bounds the failure path. Older version-1 bridges remain usable
through an ordered restore-then-pause exchange.

No lesson-specific IDs, state interpretation, or renderer assumptions enter
this mechanism. SVG, CSS 3D, and future canvas lessons use the same boundary.
Session snapshots remain local to the collection; visits never imply mastery.

## The next design pass

1. Observe opening a lesson, returning to its map, and choosing a second lesson
   at phone and desktop sizes. Check whether the pause feels deliberate and
   whether the starting object is immediately apparent.
2. Observe whether the map glyph, next arrow, and example stack have distinct
   meanings through use. If they are confused, revise their behavior and geometry.
3. Give the full constellation a focused neighborhood view when additional
   branches justify it. Show a current encounter, a few nearby possibilities,
   and a route back. Keep the small opening available. Tags can support an adult
   index separately; a large pan-and-zoom graph need not become the first screen.
4. Introduce object transfer between lessons only when a specific pair needs
   it. A future reusable route or grouping should have a small typed format,
   version, validation, and independent meaning. A visual morph alone cannot
   establish that two lessons share the same mathematical object.

The next content proposals are in [Next encounters](../curriculum/next-encounters.md).
The organizing question remains: what stayed the same, and what can now be done
with it?
