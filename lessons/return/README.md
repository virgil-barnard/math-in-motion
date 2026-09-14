# Return

The discovery is a shared return built from separate cycles. Directly drag any
shape around its ring. Either ring controls the common action. Turn backward,
cross the angle boundary, and release at a settled move. Tapping advances one
move; arrow keys on a shape move forward or backward. The range inspects time,
and the example control introduces the next case.

Cases: one 2-cycle, one 3-cycle, disjoint cycles of lengths 2 and 3, 2 and 4,
then 3 and 4. The fixed outlines preserve identity at the starting slots. At
integer moves each token occupies `(identity + moves) mod cycleLength`.
The first shared return is the least common multiple, checked independently
by repeatedly rotating labelled arrays. The non-coprime example defeats the
incorrect product rule.

Continuous phase is a presentation parameter. Only integer moves denote
permutation states. The scrubber wraps when direct turning traverses a full
common period; object motion stays continuous. State stores signed phase,
case seed, and version. Pointer cancellation and navigation during a drag
restore its starting phase. Release settles, and reduced motion skips automatic
interpolation. Geometry is recomputed from the stage, not stretched from a
fixed desktop coordinate system.

Read only this folder and `../../AUTHORING.md` for local changes. Shared helper:
`../../src/lesson-kit.js`. Tests: `node lessons/return/lesson.test.cjs` and the
Return cases in `tests/interaction.cjs`. Real touch feel remains unverified.
