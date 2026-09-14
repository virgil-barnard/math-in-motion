# Branch

First encounter: one warm bead, one fork, two open rings. Drag the bead to a
ring or select the ring. Tapping the bead demonstrates one step and stops.
Return by touching the starting well or the completed bead, or use rewind.
The same chosen journey remains available to the scrubber and play control.
There is no automatic motion on entry or idle hint loop.
The timeline is dimmed until a first branch exists to inspect; a deliberate
choice or play demonstration makes it available.

Later examples repeat the same fork twice and then three times. A dashed trail
remembers the previous completed journey. Try left then right, return, and try
right then left: different journeys meet at the same arrival. Three forks allow
three different orders of one right turn to meet again. The one-fork example
provides the contrast: its different choices have different arrivals.

## Exact meaning

The domain is binary words of lengths one, two, or three, with 0 = left and
1 = right. After row r, a prefix with k right choices reaches lattice location
(r,k), drawn at x = center + (2k-r) times the horizontal step. The order of
choices describes the journey; their sum determines its arrival. The discrete
moves are fixed. Curved rails and continuous motion are presentation geometry.
They do not simulate gravity, collisions, probability, or random decisions.

`route` stores the current chosen prefix. `progress` cannot exceed that prefix.
`record` is the latest completed journey; `reference` is the completed journey
retained when an edit begins. It remains dashed when the edited journey finishes.
Neither trail is an additional bead. The same live bead moves throughout.
Revisiting or scrubbing a journey does not count as a new random trial. Play
fills an unfinished route with a fixed alternating demonstration, then follows
it. Replaying a completed route keeps its choices exactly.

## Gestures and interruption

Available rings are native 56-pixel controls; the bead has a 64-pixel target.
A halo around the bead and the highlighted outgoing rails remain visible at rest.
Dragging projects onto one of the two available curved rails. Releasing past
halfway settles at the next junction; releasing earlier cancels the edit.
Dragging backward from a completed journey inspects its recorded trail.
At an intermediate junction, dragging upward backtracks along the existing path.
Keyboard left/right chooses a branch, up backtracks, and down demonstrates the
next step. Every ring is also keyboard activatable. Escape, pointer cancellation,
and navigation restore a tentative gesture's original complete state.

Reduced motion skips automatic interpolation. Explicit dragging and scrubbing
remain available. Every replay is bounded and returns to idle. Resize recomputes
the geometry and cancels an unfinished drag through the shared kit.

## Evidence and open questions

`lesson.test.cjs` independently enumerates walks by signed displacement, checks
all choice words and arrival multiplicities, compares route histories, and
validates state restoration. A separate de Casteljau construction checks the
curved geometry and inverse projection. `interaction.test.cjs` executes generated
HTML scripts for taps, direct drags, keyboard alternatives, cancellation, replay,
reunion, and target bounds. Vector scenes inspect the drawing output. These are
not browser, accessibility-conformance, or real-device results.

The observation to seek is whether a learner deliberately returns and changes
a route, then anticipates a shared arrival in a fresh arrangement. Discovering
the controls and making a mathematical prediction are separate observations.
A second notation or a probability histogram would obscure this first question.

Read this folder and `../../AUTHORING.md`. Only the optional lesson kit and bridge
are shared. Counting all journeys, biased random choices, and physical peg-board
motion belong to later encounters with their own stated models.
