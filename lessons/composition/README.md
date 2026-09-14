# Composition

Trace three inputs through two permutations. Change their order, bypass one, or predict an output. The exact model uses first-then-second composition, verified against column-vector matrix multiplication. Different order can change the output.

This portable lesson wraps the original shared foundation engine. Its source entry
includes `../../src/core.js`, `../../src/app.js`, and their shared styles.
Local work on its internals may require that engine; adding a new lesson does not.
See `../../AUTHORING.md`. Existing model and exported-event checks remain active.
