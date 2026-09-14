# Validation record — version 0.4.1

This release polishes navigation and shared controls across the existing ten
lessons. It adds no mathematical models or learner-facing curriculum nodes.
The aesthetic review and future encounter designs are author documents.

`python3 check.py` completed successfully on 14 September 2026, using Python
and Node standard libraries. Full command output is `check-output.txt`.
`git diff --check` also passed. The checks execute generated-document scripts.

| Gate | Result |
|---|---|
| Build | Ten ready lessons and thirteen HTML exports |
| Existing mathematical and geometry checks | 132,411 passed |
| Existing exported lesson interactions | 704 passed |
| Catalog navigation and document protocol | 214 passed |
| New transition lifecycle checks | 40 passed |
| Manifest and build contract | 16 passed |
| Offline inspection | All thirteen HTML files passed |

Totals: 132,411 model/geometry checks and 958 DOM/event/message assertions,
plus contract and packaging gates. Exhaustive small-domain enumeration produces
many assertions; these totals are not coverage percentages or learning evidence.

## What the new checks establish

The host retains its previous view while a measurable incoming document is
transparent and inert. Readiness alone is insufficient for arrival; a matching
restoration acknowledgement is required. The tests distinguish the outgoing
fade, the surface change, and the incoming fade, including when input and focus
are requested. Each settled navigation removes its obsolete document and timers.

Checks cover snapshots on revisit; stale windows, mismatched lessons and request
IDs; cancellation while loading, leaving, and arriving; a readiness timeout;
explicit load failure and retry; paired history events; reduced motion changing
mid-transition; page visibility changes; and independent map page/scroll memory.
Older cached v1 bridges use an ordered restore-then-pause exchange. Uncorrelated
state messages cannot reveal an older document prematurely.

The actual generated bridge is exercised with foundation, kit, Branch, and Fold
documents. It acknowledges the restored paused snapshot with the request ID.
The existing gesture, cancellation, geometry, and offline gates still pass.
The common timeline CSS is assembled into all exports by the builder; there is
no added runtime stylesheet request or dependency.

## Aesthetic review and limits

The opening path, Branch reunion, and Composition scene SVGs were rasterized with
Inkscape and inspected alongside the merged source. These scenes support the
judgment about palette, spacing, persistent shapes, and the difference in
conceptual density. They do not show browser-rendered host chrome or animations.
No new scene artwork was needed for this navigation release.

The public preview URL was blocked in this environment. No alternate browser
route was used. The DOM harness models events, styles assigned by JavaScript,
messages, focus requests, and scroll requests. It does not implement browser
layout, CSS interpolation, inert propagation, native focus, touch input, or real
iframe loading. Those properties remain unverified on devices. The timing values
are reviewable design choices, not measured performance results.

A browser review should inspect rapid map/lesson changes, return from a scrolled
map, reduced motion, keyboard focus, and the shared range control on a narrow
screen. Actual CSS 3D compositing in Fold remains a separate pre-existing limit.
No learner study, age-specific effectiveness result, or accessibility conformance
is claimed. Bundle, Journeys, Record, the peg board, and advanced branches remain
future designs; their descriptions do not count as implemented features.
