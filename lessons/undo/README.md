# Undo

The fixed upper routing mechanism permutes three inputs. Choose a lower tile,
or drag it into the lower mechanism, to construct an undo. Scrub or play the
same three shapes through both operations. Output outlines mark the original
arrangement. A successful candidate restores every input.

The model composes first then second; the independent check multiplies
permutation matrices in column-vector order (second matrix times first).
Tests verify inverses on both sides and exactly one correct candidate in each
set. New examples include a 3-cycle and self-inverse swaps. A paused playback
does not constitute an inverse; it is inspection of one construction.

Candidate buttons support native keyboard activation and arrows. Interrupted
dragging leaves the selected operation unchanged. Changing the operation first
returns the probe shapes to the start. State contains version, example seed,
candidate index, and normalized progress. Read this folder, `AUTHORING.md`,
and the optional routing primitive when changing this lesson.
