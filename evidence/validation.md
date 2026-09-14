# Validation record — version 0.5.0

Bundle adds one independent lesson with two encounters: moving a pair as one
unit, then unpacking and regrouping a collection of three. The four-encounter
opening is unchanged. The new lesson is discovered through its manifest; no
host or shared interaction-kit code was changed.

`python3 check.py` completed successfully on 14 September 2026, using Python
and Node standard libraries. Full command output is `check-output.txt`.
`git diff --check` also passed. The checks execute generated-document scripts.

| Gate | Result |
|---|---|
| Build | Eleven ready lessons and fourteen HTML exports |
| Existing mathematical and geometry checks | 132,411 passed |
| Bundle partition, conservation, replay, and geometry | 2,973 passed |
| Existing exported lesson interactions | 704 passed |
| Bundle exported interactions | 81 passed |
| Catalog navigation and document protocol | 214 passed |
| Transition lifecycle | 40 passed |
| Manifest and build contract | 16 passed |
| Offline inspection | All fourteen HTML files passed |

Totals: 135,384 model/geometry checks and 1,039 DOM/event/message assertions,
plus contract and packaging gates. Enumeration produces many assertions; these
counts are not coverage percentages or evidence of educational effectiveness.

## New mathematical evidence

The test constructs the partitions of two and three identities independently
from label assignments. Every unpack/join transfer is compared with an
independent element-pair equivalence oracle. The operations reach all two or
five partitions. Every identity remains present exactly once; regrouping can
change the equivalence relation while preserving the underlying collection.

Translations preserve member-to-member displacement, including at the board
edge, and keep nonmembers fixed. The intermediate blocks in a guided regrouping
are checked against the intersection of the two endpoint equivalence relations.
Replay conserves identities and ends at the exact target. Snapshot round trips,
invalid-state recovery, copy isolation, and bounded long-gesture records are
covered separately.

Geometry checks cover first swept contact with an unrelated object, permitted
oblique motion, whole-path separation, and packing two or three objects. Native
target bounds and separation are checked at 260, 280, 320, 390, and 736-pixel
stage widths and at 370/500-pixel heights. These are geometry calculations,
not measurements of a browser's rendered layout.

## New interaction evidence

The exported lesson scripts exercise boundary dragging, individual unpacking,
rejoining by direct drop or selection, the open-ring destination, and regrouping
three identities as a different pair or one full bundle. A small pull released
inside its original capsule returns to the original group. After regrouping,
moving the new pair leaves its former partner in place.

Other checks cover sampled-path replay, keyboard movement, reduced motion,
editing during inspection (including an approach that temporarily overlaps a
clearance region), snapshot restoration, pointer cancellation, capture
loss, Escape, navigation during a drag, second-pointer exclusion, and resize
interruption. The shared test harness gained an explicit resize callback helper;
its observers still run only when a test requests that simulated event.

## Visual review and limits

Scene SVGs from the actual drawing output were rasterized with Inkscape and
inspected. Desktop scenes show the initial capsule, moved pair and its trace,
unpack destination, unpacked objects, regrouped pair, and full bundle. Narrow
scenes show the pair, third object, regrouped pair, and three-object bundle.
Representative SVGs are under `evidence/scenes/bundle-*.svg`.

The capsule uses an explicit SVG fill opacity so that its translucent material
also renders correctly in the vector inspection tool. Filled shapes denote the
current identities; faint dashed boundaries and hollow marks record the earlier
pose. Whether those traces help a young learner distinguish grouping from
quantity remains an observation question in the lesson's author packet.

The browser preview route remains unavailable in this environment; no alternate
route was used. Scene renders and the DOM harness do not validate browser layout,
CSS interpolation, real iframe integration, native focus, actual touch, or
accessibility conformance. This release does not claim learner-study results or
an age-specific benefit. Device review should focus on grabbing the capsule
boundary, pulling and dropping an individual, and scrubbing the latest gesture.

The latest gesture is bounded to 256 samples. Unusually long paths are thinned
with their endpoints retained, so fine path detail can be lost. The timeline
represents sample order rather than the original gesture's elapsed time.
Journeys, Record, and the peg-board probability simulation remain planned work.
