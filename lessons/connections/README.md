# Connections

One editable relation appears as a graph and a matrix. Begin with three vertices
and one undirected edge. Later examples introduce a directed cycle, a four-cycle,
and a directed fork with a loop. Shape and color identify each vertex in both
representations. Columns are sources and rows are destinations: `A[dst][src]`.
This agrees with the column-vector convention of the earlier permutation maps.

Select two vertices or drag from one to another to toggle their connection.
Select a vertex twice to toggle its loop. Tap any matrix cell to edit the same
relation. Undirected connections fill mirrored entries; directed connections can
be edited separately. Switching to undirected takes the symmetric OR closure,
preserving every existing connection. Switching back retains both arcs.

A bounded probe traces the chosen arc and its source-column → cell → destination-row
route. The scrubber inspects this correspondence; it does not change the graph.
Empty or present entries are binary. Loops contribute one diagonal entry. This
is a relation matrix, not a degree formula or a multigraph with parallel edges.

Keyboard activation of the native vertex/cell buttons makes every graph edit
available without dragging. Escape clears a partial endpoint choice. Cancellation
discards a preview; a successful drag commits once. Snapshots preserve the whole
relation, direction mode, focus, example, and inspection phase.

Local checks enumerate all 512 directed relations on three vertices, compare
edge sets with basis-vector action, exercise symmetric closure and loops, and
test editing/restore/interruptions in the exported document. Graph and matrix
stack at narrow widths to preserve 48-pixel cell targets. This requires scrolling
on a short screen. Real browser layout and touch feel need device validation.

Read this folder, `../../AUTHORING.md`, and the optional `src/relation-board.*`
geometry helper. The host has no graph-specific logic.
Reference: [Adjacency matrix](https://mathworld.wolfram.com/AdjacencyMatrix.html).
Many texts put sources in rows; this lesson explicitly uses the transpose of
that convention so matrix action and composition remain consistent across lessons.
