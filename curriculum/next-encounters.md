# Fill the gaps between familiar actions

Planning revision for 0.5.0. Bundle is now implemented; the later encounters
remain designs, with no fixed age ladder. Keep the existing four-encounter opening small while the next
mechanisms are tried. A new module need not automatically join that opening.

The collection has strong destinations: composition, common returns, relations,
and folding. The missing groundwork is often a reason to reuse or record an
action. The first of the three proposed encounters, **Bundle**, is implemented.
**Journeys** and **Record** are next.
Each starts with something the learner can already touch.

## Before adding another module

Correspondence already lets a learner rearrange the same objects and repair
unequal collections. Its conservation idea should become more conspicuous in
an early example: spread a paired collection while the same links stay attached,
then contrast that with actually bringing another object out of reserve.
Do this within Correspondence if observation shows the distinction is unclear.
A separate “quantity stays the same” module would currently duplicate its work.

## Three concrete next encounters

| Priority and working title | First still scene and gesture | What persists | Contrasting encounter | Later use |
|---|---|---|---|---|
| 1 · Bundle (implemented) | Two recognizable objects sit in a fine transparent capsule. Drag its boundary and both travel together; pull one object out to unpack it. | Every individual identity remains visible | Regroup three objects as a pair and a singleton in two ways; unpack to compare the same underlying collection | Units, grouping, decomposition, and treating a construction as an object |
| 2 · Journeys | Start from Branch's familiar two-fork mechanism. Guide one bead; its completed route leaves a small geometric record at its arrival | The complete sequence of choices, not just the endpoint | Repeat the same route and highlight its existing record; choose a different route that arrives at the same place and add a distinct record | Many-to-one maps, equivalence classes, counting possibilities, then sampling |
| 3 · Record | Join one familiar source shape to one destination. Drag the completed link into a recording position; its endpoints become the headers of a single cell | The ordered source/destination pair | Add a second endpoint and compare one present connection with an absent one; later reverse a connection | Relations, Boolean matrices, directed graphs, and composition through witnesses |

### Bundle: one thing can contain several things

The boundary moves its contents; the contents remain individually available.
Begin with one capsule and two objects. Introduce regrouping only in a second
example. Avoid nesting, arithmetic signs, resizing, and automatic sorting in
the first scene. Use the existing drag, cancel, and rewind conventions.

The local model owns stable object IDs and a partition into groups. Moving,
grouping, and unpacking preserve the underlying collection. Regrouping changes
the partition; do not claim the resulting set of groups is identical. Never
silently duplicate an object when it enters a capsule. Check conservation and
disjoint membership through arbitrary operation sequences and interruption.

A useful observation: after moving the capsule, does the learner anticipate
where both contents will go? Can they deliberately make a new grouping? Merely
dragging the outline establishes control discovery, not the second idea.

### Journeys: remember enough to compare

Keep two forks until the four possible routes are inspectable. Their arrival
groups contain one, two, and one distinct routes. Three forks can later yield
groups of one, three, three, and one. Keep miniature route geometry in each
record so that two paths are distinguishable without relying on color or numerals.

This encounter collects **distinct possible routes**. Repeating an identical
route selects the record already present. A later sampling lesson must count
every trial, including repetitions, and visibly establish that different rule.
Do not introduce random choice or an expected profile on this first screen.

Keep the route set separate from the current bead's history. Scrubbing replays
the selected route and neither invents records nor counts another trial.
Independent enumeration should check route identity and arrival multiplicity.
Observe whether a learner seeks an unseen route or simply watches another pass.

### Record: make the grid answer a memory problem

Use a single source role and a single destination role first. The source becomes
a column header; the destination becomes a row header, consistent with existing
lessons. Scrubbing the recording motion makes the endpoint-to-cell relationship
inspectable. It changes how one relation is represented, not the relation itself.

Add a second source and destination only after one cell has meaning. Toggling
one cell should replay the corresponding connection. Keep counts, heat maps,
self-loops, and direction-mode switches for later examples or the existing
Connections lesson. Before a graph uses the same object set at both ends,
explicitly show an object taking both source and destination roles; repeated
header marks denote those roles, not extra vertices.

Check all relations on the tiny initial domain and verify round trips between
connection and cell representations. Observe whether a learner can find the
cell for a chosen connection before it lights up. That is stronger evidence
than following two simultaneous highlights.

## Subsequent branches

| Missing groundwork | Small next mechanism | Destination already present or planned |
|---|---|---|
| One action repeated as an equal step | Move one object by a fixed displacement; repeat and reverse it, then inspect a cyclic arrangement | A more gradual route into Return, composition, and periodicity |
| Counting trials versus counting possibilities | Release repeated recorded choices, then compare observed bins with the independent fair-choice model | Probability; later biased choices and a separate physical peg board |
| Two contributions cancelling | Pair matching contributions and inspect the remainder; use a visibly distinct combination rule | Parity, XOR, error detection, and binary linear maps |
| A coordinate unit and shifted copies | Slide one contribution along a row, then accumulate several shifted contributions | Convolution, polynomial multiplication, and their matrix representations |
| Reduction as an explicit rule | Trade a higher position for a fixed lower-position pattern and inspect repeated reductions | Quotient polynomial arithmetic; finite fields after a prime coefficient field and an irreducible modulus are established |
| Rigid motion and a shared boundary | Slide and turn one face, attach a second along an edge, then control one hinge | Fold, nets, polyhedral incidence, and symmetries |
| A measurable unit and an observable residual | Compare lengths or areas with equal units, accumulate strips, then refine the partition | Approximation, integration, limits, and eventually local rate of change |

The peg board remains a planned lesson, as requested. Begin with independent
branching so the expected bin counts have a specified model. In a later physical
simulation, collisions and momentum may change the distribution; compare the
models explicitly. A scrubber replays recorded trials rather than resampling.
See [Probability note](../notes/probability.md) for that distinction.

The finite-field route should eventually offer coefficient and heat views,
but the combination rule must stay visible when the representation changes.
Ordinary path counts, Boolean reachability, probability weights, and arithmetic
modulo a prime describe different operations on similar-looking arrays.
Convolution and reduction should have separate encounters before their matrix
forms are composed into a multiplication operator.

For analysis, give measurement and residual error their own foundations.
A finite animation can expose successive refinements; it cannot by itself
establish an infinite limit or a general proof. These remain explicit advanced
design problems, not promises attached to an early visual pattern.

## Scope for the next content release

Bundle now provides one capsule and a contrasting regrouping, with a local
model, geometry, view, and checks. See its [author packet](../lessons/bundle/README.md).
Its opening-path placement still needs observation. Prototype Journeys next,
then Record, keeping each encounter independently reviewable. Do not build a generic physics engine, cross-lesson state bus, or universal
renderer in advance. Promote a shared primitive when two concrete lessons need
the same behavior. See [AUTHORING.md](../AUTHORING.md) for the small module boundary.

For each encounter, record control discovery, deliberate variation, prediction,
and transfer to a changed example separately. Use those observations to decide
whether it belongs on an opening path and where another intermediate encounter
is needed. Progress is a clearer chain of meaning, not a larger lesson count.
