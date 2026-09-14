# Validation record — version 0.4.0

The release adds one local lesson, Branch, and a smaller default opening path.
It responds to feedback that the graph/matrix study introduced too much at once.
The user has published the project to `virgil-barnard/math-in-motion`; this work
is prepared as a pull-request contribution, with the generated exports included.

`python3 check.py` completed successfully on 14 September 2026, using Python
and Node standard libraries. Full command output is `check-output.txt`.
`git diff --check` also passed. The checks execute generated-document scripts.

| Gate | Result |
|---|---|
| Build | Ten ready lessons and thirteen HTML exports |
| Existing mathematical and geometry checks | 129,469 passed |
| Branch model and geometry | 2,942 passed |
| Branch exported interactions | 74 passed |
| Existing exported lesson interactions | 630 passed |
| Catalog navigation and document protocol | 208 passed |
| Manifest and build contract | 16 passed |
| Offline inspection | All thirteen HTML files passed |

Totals: 132,411 model/geometry checks and 912 DOM/event/message assertions,
plus contract and packaging gates. Exhaustive small-domain enumeration produces
many assertions; these totals are not coverage percentages or learning evidence.

## New mathematical checks

Branch is compared with independent signed left/right walks for every binary
word of lengths one, two, and three. The resulting arrival multiplicities are
[1,1], [1,2,1], and [1,3,3,1]. Contrasts cover repeated identical journeys,
different journeys with equal arrivals, and different arrivals. Current routes,
completed records, and comparison traces remain distinct through edits and
restoration. Incomplete routes bound the available inspection interval.

The curved geometry is checked against a separate de Casteljau construction.
Projecting an exact rail point back to its parameter agrees within the stated
numerical tolerances. Node/target bounds cover 260, 320, and 736-pixel widths
and 370/500-pixel stage heights. Every discrete route endpoint is also checked
against independently accumulated signed displacement.

## New interaction and navigation checks

The generated Branch scripts exercise ring selection, one-step bead taps,
direct rail dragging, cancellation, keyboard choices, backward inspection,
recorded replay, pause during a drag, and reduced motion. Returning and choosing
right-then-left after left-then-right produces the same arrival with the earlier
route retained. The initial timeline is disabled until a path exists to inspect.
Every demonstration terminates; there is no idle hint animation.

The opening path is discovered from manifest metadata, contains fewer choices
than the catalog, and omits conceptual cross-links. The full constellation and
both real catalog pages remain reachable. Returning to the opening works without
replacing a lesson snapshot. Completing the opening invites the full map instead
of loading an advanced successor. Direct links and malformed-hash recovery are
covered, along with the existing stale-window and pause/restore checks.

The contract rejects duplicate, negative, and Boolean opening-order values.
An ordinary new lesson still joins the library without a host ID registry.
Existing lesson code and the optional shared interaction kit are unchanged.

## Visual inspection and limits

The one-fork desktop and narrow scenes, the two-journey reunion, the three-fork
narrow scene, and the opening path were rasterized from SVG with Inkscape and
inspected. SVG sources are in `evidence/scenes/`; `constellation-v04.svg` records
the updated full-map page. The old constellation scene remains as earlier evidence.

These are generated scene illustrations, not browser screenshots. The event
harness uses a small DOM model and does not implement full browser layout,
focus behavior, native pointer capture, real touch input, or iframe integration.
The session's local-browser preview route was blocked earlier; no alternative
browser-control route was used. Actual device feel and browser integration are
still unverified for the changes. The earlier positive desktop feedback does
not substitute for these checks.

No learner study, age-specific effectiveness result, or accessibility conformance
is claimed. The documented next observations concern affordance discovery,
deliberate comparison, prediction, and transfer. These are design questions.
Branch is deliberate routing, not a random trial or physical peg simulation.
The probability and advanced representation directions remain future work.
