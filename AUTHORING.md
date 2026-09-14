# Add one mathematical mechanism

This is the small context packet for a future author or coding agent. Read this
file and one relevant lesson folder. You do not need every lesson in context.

## Portable document contract, version 1

Each ready lesson has a folder under `lessons/` with these files:

| File | Responsibility |
|---|---|
| `lesson.json` | Stable ID, title for adults/assistive technology, glyph, document entry, context tags, and learning connections |
| `entry.html` | Complete independent HTML, optionally assembled using local include directives |
| `glyph.svg` | A small geometric preview, recognizable from the actual mechanism |
| `model.js` | Pure mathematical model and versioned serializable state, where a model is needed |
| `lesson.js` | The lesson's rendering and interactions |
| `lesson.test.cjs` | Independent mathematical checks and relevant counterexamples |
| `interaction.test.cjs` | Optional local exported-document interaction checks, declared in the manifest |
| `README.md` | Intended discovery, gesture semantics, invariants, acceptance checks, and limitations |

The first three lessons are compatible document packages over the existing
foundation engine. Their shared implementation remains in `src/app.js` and
`src/core.js`; new lessons do not extend those switches. All subsequent lessons
have separate models and views and use the small optional author kit.

## Start a lesson

```bash
python3 new_lesson.py orbit-patterns --title "Orbit patterns" --after return
```

This creates a **draft**, invisible to navigation. Replace its seed mechanism
with the intended mathematics. Add meaningful checks in `lesson.test.cjs`, write
its README, and set `status` to `ready` in `lesson.json`. Then run:

```bash
python3 check.py
```

The builder discovers the folder, validates its references and suggested path,
adds its preview to the catalog, creates its independent document, and embeds
it in the downloadable collection. There is no central list of lesson IDs to
edit. `order` is a stable display preference, not an age or ability rank.

## Manifest

```json
{
  "contract": 1,
  "status": "ready",
  "id": "orbit-patterns",
  "title": "Orbit patterns",
  "summary": "A concise accessible description of the discovery.",
  "order": 20,
  "builds_on": ["return"],
  "related": ["membership"],
  "contexts": ["groups", "geometry"],
  "entry": "entry.html",
  "glyph": "glyph.svg",
  "interaction_checks": ["interaction.test.cjs"]
}
```

IDs must match folders. Dependencies must exist among ready lessons. `builds_on`
must be acyclic; it suggests an encounter order and never locks access. A
`related` edge is undirected and can be declared from either endpoint: adding a
new connection does not require editing another lesson. Tags can overlap.

Optional `opening_order` is a unique nonnegative integer that deliberately places
a lesson in the small opening path. Omit it for normal library additions. The
opening sequence is editorial guidance, distinct from dependency edges and age
or mastery. The next control follows this sequence and opens the full constellation
at its end. Other lessons remain immediately accessible in the full map or by
URL. Adding an ordinary lesson still requires no host or registry changes.

The gate runs the manifest's `checks` (default `lesson.test.cjs`) and optional
`interaction_checks`. Both are repository-confined paths. Keep a new lesson's
interaction checks in its own folder; no central lesson list needs editing.

## Assembly and runtime boundaries

An include looks like `<!-- @include ../../src/lesson-kit.css -->`, inside a
style element. JavaScript includes go inside script elements. Includes are
resolved relative to their file and must remain within this repository;
recursive includes are rejected. The final document has no includes or imports.

`src/lesson-stage.html`, `src/lesson-kit.css`, and `src/lesson-kit.js` are optional
shared primitives. The kit provides native controls, keyed touch targets,
pointer capture, animation cancellation, quiet optional audio, accessible
announcements, and snapshot integration. It has no catalog or domain knowledge.
`src/routes.js` is an optional mathematical drawing primitive, not a lesson.
`src/relation-board.js` and its CSS provide shared graph/matrix drawing geometry.
Their convention is destination rows and source columns, consistent with the
earlier permutation maps. Renderer-independent state stays local to each lesson.
For another renderer, write a complete document and use just the bridge.

Kit callbacks are illustrated completely by `lessons/return/lesson.js`:
`render(view)`, `describe()`, `progress()`, `snapshot()`, `restore(state)`,
`play()`, `rewind()`, `scrub(p)`, `example()`, and optional `settle`, `step`,
`activate`, `nudge`, `down`, `move`, `up`, `cancel`, `escape`. The optional
`nudge(key,direction,keyName)` receives the original arrow key as its third
argument when horizontal and vertical actions differ. Progress is normalized to
[0,1]. The lesson owns the mathematical interpretation of that interval.
`view.paint(svgBody, items)` preserves native button identity between frames.
`view.tween(from,to,setter,duration,after)` respects reduced motion.

## Host bridge

Put the stable lesson ID on `<html data-lesson="orbit-patterns">`, include
`src/bridge.js`, and call `MotionBridge.connect({snapshot, restore, pause})` once
the document is ready. `pause()` must stop animations, cancel live gestures,
and suspend ongoing audio. Snapshots contain only JSON data and a version.
Validate restored data. Do not serialize DOM, audio, or GPU objects.

The host exchanges `ready`, `restore`, `restored`, `pause`, `paused`, and `state`
messages on the `mathematics-in-motion/v1` channel. Both sides check the message's
source window; the host checks the lesson ID. Pause and restoration replies
carry the matching request ID. The bridge advertises `acknowledgesRestore` in
`ready`, pauses embedded documents before readiness, and acknowledges restoration
after the synchronous restore hook and pause have finished. Rendering should
establish the inspectable state synchronously; asynchronous asset loading belongs
before `connect()`. Call `changed()` after a meaningful state change if maintaining
an additional recent snapshot is useful.

The host pauses the outgoing document before navigation, with a 180 ms fallback.
It prepares the incoming document at its stage dimensions, transparent and inert,
while keeping the previous view visible. Only after restoration is acknowledged
does it fade out the old surface, swap, and fade in the new one. At most two
documents are mounted during preparation; only the arrived lesson is interactive.
Opening the map pauses and keeps the current document. Changing lessons removes
the old document at the handoff. A six-second readiness timeout retains the
previous view and offers retry. Older v1 bridges use ordered `restore` then
`pause` messages; the correlated `paused` reply confirms the restore completed.

The catalog owns navigation fades; embedded lessons should avoid competing
whole-document entrance motion. Reduced motion removes these fades. Rapid
navigation cancels pending work; focus moves only after arrival. Each map scope
remembers its page, scroll, and chosen node. The small optional kit and foundation
engine share `src/timeline.css`, a native inspection control with no domain logic.

Snapshots last for the current collection session; refresh starts fresh.
Only visits are saved locally, with failure handled when storage is unavailable.
This is not an assessment or a learner profile.

These are trusted first-party documents. The iframe provides DOM/runtime
isolation, not a security boundary for arbitrary third-party code. Its current
sandbox enables scripts and same-origin behavior. A later WebGPU lesson must
verify secure-context and feature requirements and offer the appropriate CPU
fallback. The current eleven lessons need neither a GPU API nor network access;
Fold uses the browser's ordinary CSS 3D compositor.

## The two delivery forms

- `docs/index.html`: small catalog plus adjacent independent lesson documents.
  This is the GitHub Pages entry. It also works when the whole docs folder is
  kept together locally; no server or runtime fetch API is needed.
- `docs/collection.html`: catalog and every ready lesson embedded in one file.
  Share this when the recipient should only need one download.
- `docs/<id>.html`: a single lesson, independent of its host and siblings.

## Acceptance before ready

Read `notes/encounters.md` when designing a new discovery. State the first
gesture, its visible consequence, and what one contrasting example reveals.
A second representation should answer a question the first encounter has made
meaningful. Treat this as a design hypothesis that needs observation.

One screen introduces one discoverable relationship. Identities survive motion;
color has a shape or other non-color counterpart. Direct gestures update the
actual model. Keyboard controls can make the same choices. Cancellation,
navigation, resizing, and reduced motion do not corrupt the model. Rewind of
history is not presented as a mathematical inverse unless it is one.

Write checks against a separate oracle or enumeration. Test non-coprime cases
for common multiples, every input for equality of finite functions, and both
orders when checking an inverse. Verify the generated document's scripts, not
only the source. Keep mathematical correctness, device interaction, and learner
understanding as distinct kinds of evidence.
