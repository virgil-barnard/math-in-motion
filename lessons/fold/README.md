# Fold

Start with two rigid square faces sharing a hinge. The next example is a
five-square cross that becomes an open box. The last adds a lid to the outer
north edge and closes into a cube. All faces retain their dimensions and marks.
Filled versus hollow circle, square, and triangle marks distinguish six faces.

Drag the glowing edge handle along its projected arc to fold. Drag elsewhere
over the object to orbit the view. Tap the handle for a quarter-stage advance;
arrow keys on the handle fold and unfold. Arrow keys on the view orbit and
change elevation. The small orbit control restores the original viewing angle
without changing the fold. Play, rewind, examples, and scrubbing remain familiar.

The exact model uses unit-square vertices rotated about shared edges. In the
cube example, four walls rise over the first 62% of the control interval, then
the lid closes. These are coordinated hinges, not a gravity, paper, or collision
simulation. The lid stays above the box during its closure. Intermediate stages
are genuine rigid geometries. The camera is orthographic, with fixed framing
during folding; camera movement recomputes the framing. Direct folding finds the
nearest point on the projected handle trajectory, with a slight continuity tie
break. Nearly edge-on trajectories can be harder to manipulate; orbit or use the
scrubber to inspect them. Cancellation restores the starting fold or camera.

Six CSS planes receive exact `matrix3d` transforms and share a `preserve-3d`
container. They remain opaque; the browser compositor resolves occlusion.
Do not add opacity, filters, isolation, or clipping to that container, because
grouping properties can flatten the scene. No external renderer or network
resource is needed. [MDN transform-style reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style).

Local checks verify edge lengths, diagonals, face area, coplanarity, every shared
hinge throughout motion, and the closed cube's 8 vertices, 12 paired edges, and
6 faces. They independently apply each emitted CSS matrix to the local square
corners and check the result against the model. Event checks cover grip dragging,
camera orbit, cancellation, keyboard controls, snapshots, and reduced motion.
Projected vector scenes are inspection aids; they do not test browser CSS 3D
compositing. Device checks remain outstanding.

This is one deliberately small family of hinged square nets. Arbitrary net
editing, other polyhedra, perspective cameras, and collision detection are future
lessons or extensions. Read this folder and `../../AUTHORING.md` for local work.
