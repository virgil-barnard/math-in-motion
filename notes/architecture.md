# A growing language of mechanisms

Implemented in version 0.5.0: eleven independent lesson documents, a generated
constellation menu, a local authoring contract, and a single-file collection
alongside the lightweight Pages edition. Branch and Bundle extend the local lesson boundary.
The catalog now separates a small opening path from the complete constellation.

## The curriculum is a graph

The public learning map has two distinct relations. `builds_on` is an acyclic
suggestion about encounter order. `related` is an undirected connection between
ideas and can cross branches. Context tags are many-to-many; they do not assign
each lesson to a single subject or age.

A Hasse diagram represents a partial order through its cover relations. That
is a useful model for a view of ordered dependencies, but does not express all
the relationships wanted here. Our map therefore retains the difference
between suggested progression and conceptual connection. It is a navigation
proposal, not a claim that mathematical understanding has one fixed order.
[Hasse diagrams](https://mathworld.wolfram.com/HasseDiagram.html).

The initial map shows four encounters selected through optional `opening_order`
metadata: Correspondence, Membership, Branch, and Return. The next control follows
that authored sequence, then opens the complete constellation. Visiting a lesson
is never used to infer readiness for an advanced successor. The opening sequence
is a navigation suggestion, not a prerequisite proof or an age classification.

A constellation control reveals every ready lesson. Solid paths carry suggested
dependencies; dotted paths carry conceptual connections. All lessons and direct
links remain open. A path control returns to the small opening. No lesson state
is erased by changing map scope. Hashes preserve `#map` for the full constellation
and add `#start` for the opening. The opening list is discovered from manifests;
there is no lesson-ID list in the host. Duplicate or invalid opening orders fail
the build. Catalogs without explicit opening metadata fall back to their first
four ordered entries.

The generic layout supports groups of at most nine lessons and up to three
nodes per row, reduced to two on narrow screens. Additional groups remain reachable through paging. A 24-lesson
synthetic catalog exercises reachability without changing host code. Context
tags are already in the data model; context browsing, focused neighborhood
views, and richer adult search are future navigation work. They are not
implemented controls in this release. Add them when the catalog actually
needs them, preserving the small learner-facing choice set.

## A lesson is a portable document

The catalog knows a lesson's ID, glyph, accessible description, relationships,
and filename. It does not know its equations, objects, renderer, or internal
state structure. Each leaf can be opened and shared by itself.

At build time, the catalog discovers manifests in lesson folders. It checks
paths, IDs, missing relationships, and cycles. Source includes produce complete
documents with no runtime imports. At run time, the host exchanges a small readiness/pause/snapshot protocol with
isolated lesson documents. It briefly prepares an inert incoming iframe beside
the paused outgoing iframe, then removes the outgoing document at the handoff.

This boundary supports SVG and CSS 3D today, and canvas or WebGPU later, without
making every lesson inherit the same scene engine. The optional kit handles
common controls and interruption behavior; it does not contain lesson-specific
branches. The original foundation trio retains its existing shared engine
behind the same document interface. Further edits to those three experiences
may still require reading that engine. New lessons do not.

Only the arrived lesson accepts input. Opening the map pauses the current lesson;
changing lessons saves its JSON state and waits for the next document to restore
before replacing the visible surface. Returning restores that state. State lasts through navigation in this session, while a
refresh begins fresh. Only the visited-node set uses local storage. Sound is
muted on navigation and does not start automatically on restoration.

Navigation uses a 110 ms exit and 180 ms arrival fade. Reduced motion skips both.
Readiness is bounded by a six-second timeout; a failed incoming document leaves
the previous view available. Rapid navigation cancels staging and unfinished
fades. Older cached bridges acknowledge an ordered restore-then-pause exchange.
Each map scope keeps its own page and parent scroll position. The iframe retains
its internal scroll when returning from the map; destroyed documents restore
mathematical state, not an arbitrary internal viewport. See
[Continuity review](continuity.md) for the aesthetic decisions and device checks.

Transparent preparation uses native [inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert)
to exclude the incoming surface from input and focus. The host also supplies
pointer blocking and accessible visibility state. The
[reduced-motion preference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
is observed both in CSS and during navigation. These platform semantics do not
substitute for browser and assistive-technology validation of our implementation.

The one-file edition embeds all ready documents. The Pages entry stays small
and opens adjacent documents. Both are produced from the same sources. This
separates convenient single-download sharing from future catalog growth.

## The gesture is part of the mathematics

In Return, a drag is interpreted as angular displacement around the selected
cycle. Successive angles are unwrapped across the branch cut, and each cycle's
length converts rotation to the shared number of moves. Either cycle drives
both. A central dead zone avoids an unstable angle near the hub. Backward turns
are allowed, and release settles to the nearest integer action. Pointer capture
keeps the gesture attached when a finger leaves the original target.
[Pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture).

The interpolation is motion between permutations, not a new fractional
permutation in the lesson's finite group. Settled configurations are exact.
The five examples are 2, 3, 2-and-3, 2-and-4, and 3-and-4 cycles. The 2-and-4
case matters: multiplying periods is not the general shared-return rule.

Undo compares the composite against identity on every one of its three inputs.
Same compares two different constructions on all three inputs. The two copies
of the input set in Same are paired experiments; they are not newly created
members of one conserved collection. Playback can be paused and scrubbed, and
changing a selected operation first returns the probes to their starting
positions.

## Bridges between representations

Connections uses editable source-column/destination-row entries, matching the
existing column-vector permutation convention. Undirected mode is symmetric;
directed mode exposes the two orientations separately. Self-loops have a single
presence mark on the diagonal. Both direct endpoint gestures and matrix edits
change the same binary relation. A trace ties the source column to its cell and
the destination row, alongside the corresponding graph arc.

Through separates the source, intermediate, and destination sets into three
columns. Its computed matrix shows one intermediate shape per two-step route.
The brightness option uses a fixed count scale. The learner sees a small finite
sum before needing numerals or a multiplication formula. Result cells select
an inspection; editing the input relations changes their counts.

Fold owns a separate exact 3D model and CSS-plane renderer. Shared unit edges
remain attached through all rotations. The direct grip follows the projected
folding trajectory, while dragging the surrounding surface orbits the camera.
The two-face opening is intentionally small. The later cube example coordinates
four wall hinges, then closes a lid. More polyhedra and editable nets are future
work. The CSS 3D container stays opaque and unfiltered to preserve compositing.

All three additions carry their own mathematical and exported-event checks.
The check runner now discovers optional interaction-check paths in manifests,
so adding a lesson does not require editing a central interaction registry.

## A smaller encounter before another representation

Branch begins with one bead and one fork. The next example repeats that action,
then keeps an earlier journey as a dashed trace. Two different sequences can
meet at the same arrival. Its pure model distinguishes the current path, the
last completed path, and the comparison trace; a timeline only inspects an
existing path. Direct dragging projects onto the same curved rails used for
playback. The first tap demonstrates one bounded action. There is no idle hint
loop, stochastic generator, histogram, or new renderer dependency.

The user reported that graph/matrix representations arrived too abruptly.
`notes/encounters.md` records this design correction and the next hypotheses.
The existing studies remain useful later destinations while simpler experiences
build the questions that their representations can answer.

## What we build toward

The recurring pattern is identity through change. Objects acquire partners,
belong to overlapping regions, travel through transformations, return in
cycles, and reveal inverse and equivalent constructions. This supplies a
sequence of encounters before notation becomes necessary.

Connections now exposes a finite relation as both paths and a matrix. Through
composes two relations, showing intermediate identities before a brightness view
of their counts. Its inverse-permutation example returns to the identity from
Undo. The arithmetic is ordinary nonnegative-integer addition and multiplication;
probability weights and finite-field sums remain distinct future interpretations.
Fold begins a spatial branch with rigid hinges, an open box, and a cube.
Branching routes can later lead to probability and path counting. Shift-and-combine operations can lead to convolution, polynomial
multiplication, and finite-field reduction. Successively finer partitions and
accumulation can later support limits and analysis with the required concepts
made explicit. These are intended connections, not completed lessons.

The probability peg board remains specified in `probability.md`. Its ideal
independent-branch model and its physical collision model must stay distinct.

The current reuse is between lesson documents, visual conventions, and author
primitives. Moving a learner-built operation from one lesson into another is
not yet implemented. When that becomes useful, introduce a small typed
operation format with explicit domain, codomain, action, and basis where needed.
For example, a finite permutation can cross the boundary as its complete
mapping. Probability weights and finite-field coefficients require distinct
types and arithmetic. Avoid a universal operation framework before a concrete
pair of lessons needs to exchange such an object.

## Evidence and the next observation

The build, finite models, input events, pause/restore protocol, and offline
exports have automated checks. Vector scenes are rendered from the actual
lesson drawing output for inspection. They are not browser screenshots.
The user reported enjoying the earlier collection in the desktop application.
The new iframe integration and direct-touch feel still need real browser/device
testing. No learner study or accessibility conformance result is claimed.

Observe whether a learner discovers that either cycle can be turned, predicts
a return before moving, and transfers that expectation from 2-and-3 to 2-and-4.
That is more informative than recording how long a colorful animation held
attention. The design should invite exploration without making every gesture
an assessment.
