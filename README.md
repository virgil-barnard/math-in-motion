# Mathematics in Motion

Eleven wordless mathematical experiences, connected by a growing constellation.
Every lesson is an independent offline document. The catalog offers suggested
paths and cross-connections; every experience is available immediately.

**Open `docs/collection.html` for the entire collection in one file.** It needs
no server, account, internet connection, external font, or runtime package.
For GitHub Pages, use the lightweight `docs/index.html` and its adjacent lessons.

Version **0.5.0** adds Bundle. Move a capsule and every object inside moves
with it. Pull one object out, then regroup the same collection in another way.
The first encounter has two objects; the second adds a third. The timeline
retraces the latest change, including a direct drag, and preserves the distinction
between replaying history and undoing a mathematical operation.

The four-encounter opening stays small. Bundle joins the full constellation and
works independently as `docs/bundle.html` or through `#bundle`. The previous
transition polish remains: lessons restore before appearing, maps remember their
positions, and all experiences share the same inspection control.

| Document | Discovery | Try |
|---|---|---|
| `correspondence.html` | Every object can have a partner | Pair, rearrange, and repair unequal collections |
| `membership.html` | One object can satisfy two rules | Sort into one, both, or neither region |
| `bundle.html` | Several objects can move as one unit | Drag the capsule; unpack one shape and regroup the same collection |
| `branch.html` | Different journeys can meet at the same arrival | Guide a bead through open rings; return and compare another journey |
| `composition.html` | Order can change an operation's result | Swap the routing mechanisms and trace every shape |
| `return.html` | Separate cycles can return together | Drag any shape around its ring; either ring drives both |
| `undo.html` | An operation can restore another's inputs | Choose or drag a lower routing tile, then inspect all inputs |
| `same.html` | Different constructions can have the same action | Match a two-operation construction with a single operation |
| `connections.html` | A relation can appear as lines or cells | Join two shapes or edit their matrix cell; switch direction mode |
| `through.html` | Complete routes combine through intermediate objects | Edit adjacent connections; inspect the resulting shapes or brightness |
| `fold.html` | Faces can move while their shared edges stay joined | Drag the glowing fold handle; drag the object to orbit the view |

All filenames in the table are under `docs/`. `docs/foundations.html` preserves
the original three-lesson collection. Its original regression checks remain.

## Exploring the collection

The opening path offers Correspondence, Membership, Branch, and Return. Each
geometric preview opens its lesson. The next control follows this small sequence,
then invites exploration of the full constellation. It never uses visit counts
as evidence that someone is ready for advanced material.

The constellation control beneath the opening path reveals all eleven lessons,
paged in groups of nine. Solid paths suggest what builds on what; dotted paths
connect related ideas. The path control returns to the opening sequence. Every
lesson is immediately available, including through its direct URL fragment.
A small dot means visited, not mastered. `#start` opens the small path; `#map`
opens the complete constellation; `#branch` opens Branch directly.

Opening the map pauses a lesson. Returning restores its state for the current
session. Refreshing begins fresh. Visits are saved locally when the browser
allows it. No analytics or learner accounts are present.

The visible learning surface has no written words, numerals, scores, or subject
menus. Native controls retain accessible names and descriptions. Use play,
rewind, or the range to inspect motion. The lower tile-stack control introduces
another example. Optional sound starts muted and is muted when navigating.

In Bundle, drag an unoccupied part of the capsule boundary to carry its contents.
Drag an object into free space to unpack it, or onto another object or capsule
to join. For a selection-based path, choose a shape and then its open ring or a
different object. Arrow keys move the focused object or capsule. Play and rewind
inspect the latest change; they do not produce additional copies of the shapes.
The new [author packet](lessons/bundle/README.md) specifies the partition model,
gestures, history semantics, and validation limits.

In Branch, drag the bead toward either open ring or tap the ring. Tapping the
bead demonstrates one step and stops. After a completed journey, return to the
start and make different choices. The dashed trail records the previous journey.
The second example lets left-then-right and right-then-left meet. Playback follows
the same chosen route; it does not generate random outcomes.

In Return, start with a 2-cycle, then try a 3-cycle, 2-and-3, 2-and-4, and 3-and-4.
Drag any shape in either direction, or focus it and use arrow keys. Releasing
settles at a whole move. The scrubber can wrap as a hand-driven mechanism passes
a full period; the objects continue smoothly. Reduced motion skips automatic
interpolation, while direct inspection remains available.

Undo and Same test all three inputs. Matching a single input is insufficient.
The animation between discrete states is a presentation, not a new fractional
operation in the finite mathematical model.

Connections and Through use source columns and destination rows throughout.
Connections has editable binary cells; Through computes the result of two
relations and lets each cell reveal its intermediate identities. Its brightness
view counts routes over the ordinary nonnegative integers. It does not assign
probabilities or use finite-field arithmetic. Narrow layouts stack the two
representations and allow scrolling to retain large touch targets.

Fold begins with a single hinge, then an open box, then a cube. The glowing
edge grip folds; the surrounding object area turns the view. The familiar
scrubber also controls folding. Filled and hollow shape marks identify the six
rigid faces. This is one family of hinged square nets, ready for a later branch
into other polyhedra. The mathematics is exact; real browser CSS 3D compositing
and touch feel remain unverified in this environment.

## Add a lesson without loading the whole project

Read [AUTHORING.md](AUTHORING.md), then one relevant lesson folder.

```bash
python3 new_lesson.py orbit-patterns --title "Orbit patterns" --after return
```

The new draft is excluded from navigation until finished. A manifest and complete
lesson document are the required runtime boundary; a pure model, local view,
checks, glyph, and short author packet make future work self-contained. The
optional shared kit handles native controls and animation lifecycle. The host
has no list of lesson-specific mathematical implementations.

When ready, change the draft's status and run the local gate:

```bash
python3 check.py
```

Python and Node standard libraries are sufficient for development. They are not
needed by someone opening the finished HTML. The gate builds all exports,
checks mathematical models and generated scripts, tests the catalog protocol
and auto-discovery, and verifies offline packaging.

## Publish through GitHub Pages

Commit this project to the intended repository. Configure Pages to deploy from
the chosen branch's **/docs** folder. The entry is `docs/index.html`; independent
lessons and the complete downloadable collection sit alongside it. Rebuild and
commit `docs/` when changing source. A custom Actions workflow is unnecessary.
[GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

The project is maintained at [virgil-barnard/math-in-motion](https://github.com/virgil-barnard/math-in-motion).
Changes are proposed through pull requests with rebuilt offline exports. Merging
a pull request and configuring Pages remain repository-owner actions.

## Design and evidence

- [Architecture and navigation](notes/architecture.md)
- [Design philosophy](notes/design.md)
- [Aesthetic review and transition design](notes/continuity.md)
- [Missing encounters and the next lesson designs](curriculum/next-encounters.md)
- [Encounter design and the next hypotheses](notes/encounters.md)
- [Authoring contract](AUTHORING.md)
- [Curriculum charter](curriculum/plan.md)
- [Future probability lesson](notes/probability.md)
- [Validation and limitations](evidence/validation.md)

Automated gates cover models, input events, snapshots, and packaging. Vector
scene inspections come from actual drawing output. They are not browser
screenshots. The earlier collection received positive desktop-app feedback;
real browser/iframe integration, touch feel, accessibility conformance, and
learner observations remain separate checks for this release.
