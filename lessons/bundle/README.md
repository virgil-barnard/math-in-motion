# Bundle

Status: ready. The first encounter contains a circle and
square inside one capsule. Drag any unoccupied part of its boundary and both
contents receive the same displacement. Pull one shape out, or select it and
choose the open ring. The shapes remain individually identifiable. The second
encounter adds a triangle; regroup the same three objects as a different pair
and singleton, or as one bundle.

This is groundwork for units, grouping, decomposition, and treating a construction
as something that can itself be manipulated. It does not yet introduce numerical
addition, nested collections, or an assertion that two different partitions are
the same mathematical object.

## Exact model

There are two or three fixed identities. A pose contains their positions in a
normalized board and a partition of those identities. Every identity occurs
exactly once in exactly one nonempty block. Singleton blocks appear as free
objects; larger blocks have a capsule. Unpacking makes a singleton. Joining
moves one identity to the chosen object's block. Boundary movement translates
all members by one common vector and leaves other blocks fixed.

The two- and three-element domains have two and five partitions respectively.
The model's transfers can reach every partition. Different partitions retain
the same underlying collection; their equivalence relations can differ.
During a guided regrouping, only groups shared by both endpoints remain joined
in transit. These blocks are the nonempty intersections of the endpoint blocks.
This keeps an old capsule from stretching across the stage around a departing
object. Membership changes at recorded boundaries; it is never fractional.

`geometry.js` owns board projection, capsule geometry, safe translation, and
placement. A conservative normalized clearance keeps unrelated resting groups
separate, including after resizing. Whole-bundle drags stop at the first swept
rectangle contact instead of passing through another group. A dragged individual
can temporarily overlap a group while approaching it in a recorded gesture.
Beginning a new movement from that inspected overlap permits separation; it
does not implicitly join the groups. A dragged individual
can cross a capsule boundary to choose it; the target highlights before release.
On joining, contents arrange into a short row with stable identity order. Nearby
clear positions are preferred; a placement with no available room is rejected.

## Gestures and controls

- Drag the capsule boundary: move that block as one rigid unit.
- Drag an object: carry that individual; release over another object or capsule
  to join, or into empty space to leave it alone. A small pull released inside
  the original capsule returns to that group.
- Select an object, then an open ring: unpack into a visible free place.
- Select an object, then a different object's shape or capsule: join that block.
- Tap a capsule without a selected object: demonstrate one bounded translation.
- Arrow keys on a capsule move all its contents; arrow keys on an object unpack
  and move that object. Native button activation makes the same selections.
- Escape clears selection. Pointer cancellation, capture loss, resize, navigation,
  and a second input cannot leave a half-applied drag in the stored state.

The timeline retraces the **latest change**, including the sampled path of a
drag. It is disabled before a record exists. Play demonstrates a short movement
at first, then replays the stored change. Rewind returns to that record's input;
it is history inspection, not an inverse of a many-to-one grouping operation.
Starting another gesture branches from the inspected positions and the discrete
partition visible there. Selection alone does not replace the record.

A record contains at most 256 samples. Exceptionally long gestures are thinned
while preserving the first and latest pose; fine path detail can be lost. Time
on the scrubber parameterizes sample order, not measured gesture duration.
Snapshots retain the current example, latest record, and inspection cursor.
Restoration rejects missing/duplicated identities, invalid partitions, invalid
coordinates, excessive records, and incompatible versions. Reduced motion skips
programmatic interpolation while all direct controls remain available.

## Acceptance and observations

The mathematical test independently enumerates partitions from label assignments,
checks every transfer against an element-pair equivalence oracle, and verifies
conservation, common displacement, reachability, and snapshot isolation. Geometry
checks include swept contact, narrow target bounds, and three-object packing.
Exported-document checks cover grouping, unpacking, direct and keyboard movement,
replay, branching from inspection, and interruptions.

Observe whether a learner predicts that both contents will move when the boundary
moves, then deliberately changes which objects travel together. Watch whether the
boundary grip is found without hover and whether the selected object's open ring
makes unpacking discoverable. Dashed outlines and hollow marks are traces of the
previous pose, not additional members. They should help compare movement without
being mistaken for objects to collect.

This packet and one optional kit are sufficient context for local changes.
The collection discovers the manifest; the host contains no Bundle-specific code.
Precise SVG renders and event-harness checks do not establish real touch feel,
browser layout, accessibility conformance, or learning effectiveness.
