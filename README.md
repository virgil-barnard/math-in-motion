# Mathematics in Motion

Nine wordless mathematical experiences, connected by a growing constellation.
Every lesson is an independent offline document. The catalog offers suggested
paths and cross-connections; every experience is available immediately.

**Open `docs/collection.html` for the entire collection in one file.** It needs
no server, account, internet connection, external font, or runtime package.
For GitHub Pages, use the lightweight `docs/index.html` and its adjacent lessons.

Version **0.3.0** adds Connections, Through, and Fold: graph/matrix editing,
composition by tracing intermediate routes, and rigid square faces folding into
a cube. Each addition is its own lesson folder, discovered by the existing host.

| Document | Discovery | Try |
|---|---|---|
| `correspondence.html` | Every object can have a partner | Pair, rearrange, and repair unequal collections |
| `membership.html` | One object can satisfy two rules | Sort into one, both, or neither region |
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

The constellation control opens the map. Each geometric preview opens its
lesson. Solid paths suggest what builds on what, while dotted paths connect
related ideas. The next control suggests a continuation. A small dot means
visited, not mastered. New groups become available when a catalog exceeds nine
lessons; the data model allows overlapping subject contexts.

Opening the map pauses a lesson. Returning restores its state for the current
session. Refreshing begins fresh. Visits are saved locally when the browser
allows it. No analytics or learner accounts are present.

The visible learning surface has no written words, numerals, scores, or subject
menus. Native controls retain accessible names and descriptions. Use play,
rewind, or the range to inspect motion. The lower tile-stack control introduces
another example. Optional sound starts muted and is muted when navigating.

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

This delivery prepares the files. It does not create a repository or publish a
site.

## Design and evidence

- [Architecture and navigation](notes/architecture.md)
- [Design philosophy](notes/design.md)
- [Authoring contract](AUTHORING.md)
- [Curriculum charter](curriculum/plan.md)
- [Future probability lesson](notes/probability.md)
- [Validation and limitations](evidence/validation.md)

Automated gates cover models, input events, snapshots, and packaging. Vector
scene inspections come from actual drawing output. They are not browser
screenshots. The earlier collection received positive desktop-app feedback;
real browser/iframe integration, touch feel, accessibility conformance, and
learner observations remain separate checks for this release.
