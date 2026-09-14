# Through

Compose two finite relations through an intermediate set. Three columns contain
source, intermediate, and destination copies of the same three identities. The
first relation is `A[mid][src]`, the second `B[dst][mid]`. The result is `C = B A`
over the nonnegative integers. Each intermediate identity that completes a route
contributes one to `C[dst][src]`. Matrix columns are sources and rows destinations.

Select adjacent-column endpoints or drag between them to edit a relation.
Select a result cell to inspect all of its two-step routes. Selecting a source
and a final destination also focuses that result; it never adds a shortcut.
The result cells are computed selectors, not freely editable counts.

Each result cell first contains one tiny intermediate shape per route. A second
view encodes the count as brightness with a fixed zero-to-three scale. Full
brightness always means three routes, regardless of the other entries. Both
views retain native accessible counts and descriptions. The first example has
two alternatives, the second composes a permutation and its inverse, and the
third allows three alternatives through one source-destination pair.

Playback sends one probe down each alternative route. These are paired route
inspections, not particles splitting or conserved probabilities. A route does
not count twice just because it crosses another drawn line. This is ordinary
integer matrix multiplication; Boolean existence composition would threshold
positive counts to one, and finite-field multiplication would use its own sums.

Direct edits, cell selection, keyboard activation, Escape, cancellation, and
pause/restore are supported. The same optional relation-board geometry is used
as Connections. Narrow layouts stack the graph over the result matrix and may
scroll. Model checks independently join ordered edge sets for 3,584 relation
pairs and compare every result and witness. Exported-document event checks
exercise both editing routes, computed results, view switching, and restoration.
These do not establish actual browser or touch behavior.

The mathematical claim follows directly by counting choices of intermediate
vertex: each product `B[dst][k] A[k][src]` is one exactly when both edges exist;
the sum counts the distinct possible `k`. Read this folder and `../../AUTHORING.md`
for changes. The earlier Composition or Undo folder supplies useful context.
