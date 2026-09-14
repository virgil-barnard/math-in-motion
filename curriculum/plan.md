**Mathematics in Motion — a wordless design charter and initial plan**

Planning draft 0.7 · 14 September 2026

The learner enters a small mathematical environment and discovers its rules through action. Objects, relationships, and transformations carry the explanation. The central design task is to make those rules perceivable, controllable, and reusable across unfamiliar examples.

The working prototype now implements correspondence, membership, Branch, composition, Return, Undo, Same, Connections, Through, and Fold as ten related wordless experiences. Version 0.4.0 introduces a four-encounter opening path and places the graph/matrix and spatial studies in the complete constellation, following feedback that they arrived too abruptly. Return supports directly turning either cycle. Connections links graph editing with a shape-header matrix. Through reveals composition by inspecting intermediate routes. Fold opens a spatial branch with a hinge, an open box, and a cube. The combined collection and independent HTML exports accompany this charter. Mathematical and exported-script checks pass; the earlier collection received positive desktop-app feedback. The new browser/iframe integration, real touch-device checks, and learner observations remain outstanding.

Version 0.2.0 established a portable lesson-document contract; version 0.3.0 extends it with three locally implemented lessons and discoverable interaction checks. A lesson folder owns its model, view, glyph, metadata, checks, and short author packet; the build discovers ready folders automatically. The original foundation trio remains behind its existing shared engine, while new lessons are independent modules. The small catalog distinguishes acyclic suggested progression from undirected conceptual connections. All lessons are available immediately. A visited marker is not an assessment. See `AUTHORING.md` and `notes/architecture.md` in the source package for the implemented boundary and future growth decisions.

This revision establishes a wordless learner surface as the direction for the series. The written charter is for authors, collaborators, and adult readers. The project remains a proposed collection of independent HTML experiences, eventually published together through a GitHub Pages repository. Its educational effectiveness has not yet been established.

The 0.4.1 continuity pass keeps the ten lessons and adds no new curriculum nodes.
The immediate content priorities are specified in [Next encounters](next-encounters.md):
Bundle, Journeys, and Record, with conservation first made clearer within the
existing Correspondence experience if observation warrants it. This smaller plan
is the current implementation guide; the subject directions below remain a charter.

**1. Build a language of actions.**

A learner should be able to encounter the same relationship through several appearances: pairing discs with openings, pairing two collections, pairing inputs with outputs, and eventually recognizing a bijection or an invertible transformation. The conceptual continuity comes from the relationship and its behavior.

The first experiences should require no written words, reading, spoken instructions, or typing. The first pilot also needs no numerals or equations. Titles and mathematical names in this document are authoring references. Optional numerical coefficient views can still support later investigations, including the existing finite-field work; their presence must not become a prerequisite for exploring the underlying mechanism.

There is no automatic transition to a text-heavy lesson as the mathematics becomes more sophisticated. Depth should grow through composition, variation, constraints, and connections. Formal commentary can accompany the collection in separate author or reader materials.

The ambition is communication across spoken languages. Each visual convention still needs to earn its place: a border, connector, gesture, or hollow shape has to reveal its meaning through consistent behavior. Removing text does not establish that an interface is immediately intelligible to everyone.

**2. Separate the learner surface from its supporting descriptions.**

| Layer | Purpose | Content |
|---|---|---|
| Learner surface | Discover and act on a relationship | Objects, spatial arrangements, connections, restrained motion, direct controls |
| Authoring description | Specify exactly what the experience means | Domains, operations, conventions, invariants, prerequisites, counterexamples, validation |
| Access semantics | Make the same mathematical action available through other means | Semantic controls, assistive descriptions, keyboard operation, equivalent representations |
| Adult documentation | Support observation and connect the experience to formal mathematics | Notes, sources, physical counterparts, suggested connections, limitations |

Visible learner controls must not depend on text labels or unfamiliar icons. Nonvisual accessible names remain available. Adult documentation must not be needed to make the primary visual interaction usable.

An accompanying adult can participate through shared attention, demonstration, and imitation. Adult narration is not part of the intended explanation mechanism. Record when adult help is needed so that it informs the next design revision.

**3. Use a small, consistent visual grammar.**

This is an initial vocabulary to investigate, not a claim that these conventions are innate.

| Visual behavior | Mathematical role | Design obligation |
|---|---|---|
| One persistent object | An identifiable element | Track it through movement; do not silently replace it |
| A collection with stable members | A finite set or another explicitly chosen collection | Specify whether identity, multiplicity, order, or position matters |
| A connection that stays attached | A relation or correspondence | Make its endpoints and any direction discoverable |
| A manipulable transformation | An operation on a stated domain | Show the relevant input changing into its output |
| Output connected to another input | Composition | Make intermediate states and order observable |
| Different constructions brought into correspondence | Equivalence with respect to a chosen property | Reveal what is equal and what is allowed to differ |
| A return to an earlier state | A cycle or identity action | Preserve enough identity to recognize the return |
| A visible unmatched part | Failure of a proposed correspondence | Keep the witness available for inspection and repair |
| Finer subdivision with an explicit residual | Approximation and error | Preserve the distinction between refinement and reaching a limit |

Color should have a stable mathematical role within an experience. It must not be the only way to identify a category or state. Position can express magnitude in a measurement lesson and be irrelevant in a set lesson; the mechanism must make that distinction apparent.

Recurring interaction patterns can connect subjects, but a single gesture does not need to mean every kind of mathematical operation.

**4. Make motion inspectable and mathematically honest.**

The learner should be able to stop at any point, move a small amount, and retrace the transformation. Prefer a handle, track, or movable object whose position directly controls the relevant process. The visible response should follow the gesture immediately. A separate timeline is useful when inspecting a sequence; it need not be the default control for every experience.

Separate three things in the model: mathematical state, the operation being represented, and the visual progress of a transition. For finite mathematics, moving continuously between two discrete states does not create intermediate field elements or fractional membership. Objects in transit can remain visible while the mathematical states occur at clearly distinguishable resting positions.

Replaying history is also different from applying an inverse. A bijection can be undone from its output. A many-to-one operation cannot recover its input uniquely without additional information. If a history control reconstructs that information, preserve its visible provenance; do not make it look as though the output alone determined the reconstruction.

A continuous deformation is not automatically a mathematical proof. A finite animation needs a specified domain, and a general argument needs a reason that applies throughout that domain. Infinite processes, quantified claims, and proof dependencies are open design problems for the advanced wordless grammar. Their representation needs explicit development and review.

Use mechanical behavior where it explains a dependency. A decorative gear should not imply a ratio, conservation law, or reversibility that the mathematics does not have. Distinguish a camera movement from changing the object itself.

**5. Aim for quiet precision.**

The first screen should contain very few objects and one evident opportunity for action. Introduce a second adjustable quantity only when varying it reveals a useful distinction. New complexity should grow from something the learner has already manipulated.

Use generous space around the mathematical objects, sufficient contrast, and large effective touch targets. A restrained palette and precise alignment can support elegance without making essential features faint or difficult to touch. Start with roughly 44–48 CSS pixel effective touch targets, then revise through device checks and observation.

Object identity should remain visible through transformations. Avoid teleports, unexplained duplication, occlusion that hides the key relationship, and scene changes that erase the comparison. Keep pauses and stable endpoints. Sound may reinforce an event but should carry no indispensable information.

Feedback should be a consequence that can be inspected: a part remains unmatched, a path reaches a different destination, or a construction fits. Exploration can continue immediately. A score is not needed to communicate any of these outcomes.

**6. Begin with correspondence.**

The first complete pilot should investigate one-to-one pairing despite changes in arrangement. Begin with two objects and two destinations; introduce three and then a single unmatched object after the interaction is understood. These are initial design choices to test, not age norms.

A small motion study can show three discs, three open rings, and their persistent connections. Scrubbing spreads the discs and brings each into its ring. All three pairings survive. This study demonstrates a possible visual behavior; it does not yet test whether a child can construct a correspondence.

The complete pilot should develop that behavior into an experiment:

| Episode | Visible event and available action | Author interpretation |
|---|---|---|
| First contact | One object visibly approaches an opening; the learner can control and retrace the movement | Establish the affordance through its effect |
| Construct | Several objects and openings remain available; the learner makes the pairings | One-to-one assignment |
| Rearrange | Spread, gather, or move the objects while retaining their connections | Arrangement changes while cardinality and pairing remain |
| Contrast | One extra object or opening remains after pairing | A visible witness to unequal finite cardinalities |
| Repair | Move a visible spare object into or out of the collection | Change membership to restore a complete correspondence |
| Transfer | Present a different arrangement and then different shapes; remove the demonstrated connections | Reconstruct the relationship without copying the original trajectories |

Any valid complete pairing should work. Avoid making a particular color, shape, left-to-right order, or memorized route the hidden answer. A small supply of visible spare objects makes changes of membership traceable.

Support both dragging and selecting an object followed by a destination. A mistake in touch precision should not be interpreted as a mistake about the relation.

A physical counterpart uses a few objects and places to put them. The same correspondence can then be constructed away from the original display.

**7. Give each experience a concrete acceptance contract.**

| Criterion | Requirement | Useful evidence |
|---|---|---|
| Wordless entry | The primary action and its consequences can be discovered without reading or a required spoken prompt | Observe first contact and record any help needed |
| One relationship | Specify one central relationship in the author brief | A changed example isolates that relationship |
| Meaningful control | A deliberate action changes something mathematically relevant | The learner can inspect and deliberately reproduce the effect |
| Stable referents | Preserve object identity and relevant membership through transitions | Trace every item through the important steps |
| Inspectable motion | Permit pause, scrubbing, and inspection of stable states | The same state can be reached predictably from either direction of inspection |
| Honest interpretation | Record the meaning of space, color, shape, motion, and any mechanical constraint | Check that the depiction introduces no false mathematical property |
| Nonverbal prediction | Allow a choice or construction before revealing the result when useful | Prediction is not supplied by the animation itself |
| Informative contrast | Include a changed assumption or a visible failure case | The learner can inspect what prevents the proposed relationship |
| Transfer | Change incidental appearance while preserving the underlying task | Success survives a new arrangement, shape, or physical version |
| Accessible action | Support equivalent input methods and perception of relevant differences | Touch, keyboard, alternate pointer input, and motion checks |
| Honest scope | Separate a worked example, an exhaustive finite result, and a general claim | The author brief identifies which is actually established |
| Reproducible release | Preserve exact arithmetic or stated approximation assumptions in the exported file | Focused mathematical checks and actual exported-file inspection |

Multiple linked representations are valuable when the transition itself is the lesson. They are not mandatory simultaneous panels on a first-contact screen. An object can move into another representation while preserving its identity.

**8. Take early reasoning seriously and test what the design enables.**

A relevant experiment found that children aged 24–30 months could use learned size-change relations to select interventions for new problems. Its procedure included adult interaction and spoken prompts; it does not establish the effectiveness of a completely wordless screen experience. It does support investigating relational thinking at this age. [Goddu, Yiu, and Gopnik, Causal relational problem solving in toddlers](https://www.alisongopnik.com/Papers_Alison/Yiu,%20Goddu%20&%20Gopnik%20Cognition.pdf)

The project's working hypothesis is that carefully chosen visual and causal interactions can let learners encounter mathematical structure with fewer language demands. That hypothesis should guide small experiments.

Separate several kinds of observation: discovering a control, enjoying a response, copying an action, predicting an outcome, and transferring a relationship. Each tells us something different. Repeated successful transfer is more useful evidence of the intended abstraction than completing the original animation.

Use nonverbal tasks such as selecting a destination before movement, building a missing connection, or repairing a changed arrangement. Vary position and appearance so that accidental cues do not give the answer. Record help and motor difficulties separately from conceptual choices. A small initial observation round can identify design problems; it cannot establish general effectiveness or a ceiling on a child's reasoning.

**9. Organize the curriculum by recurring relationships.**

The names below belong in the catalogue metadata and authoring materials. They need not appear on the learner surface.

| First accessible relationship | Further investigations | Later mathematics |
|---|---|---|
| Pairing and an unmatched remainder | Cardinality, one-to-one maps, counting constructions | Bijections, combinatorics, finite and infinite cardinality |
| Membership and shared membership | Union, intersection, complement within a fixed universe | Sets, logic, partitions, equivalence classes, quotients |
| Connections and routes | Direction, composition, reachability, tables of pairs | Graph theory, relation algebra, Boolean matrices |
| Rearranging without losing identity | Permutations, inverse actions, cycles | Groups, symmetry, group actions, representations |
| Repeating and returning | Equal steps, remainders, common cycles | Divisibility, gcd, congruence, modular inverses |
| Tiling and regrouping | Arithmetic, place value, multiplication, division | Distributivity, polynomials, convolution, linear maps |
| Measuring and subdividing | Units, fractions, ratios, signed quantities | Real functions, change, accumulation, calculus |
| Preserving and violating checks | Redundancy, parity, distance between messages | Linear codes, syndromes, finite-field codes |
| Refining with a visible discrepancy | Approximation, bounds, sequences | Limits, continuity, convergence, real analysis |

Arithmetic, geometry, measurement, probability, and data remain substantial strands. They require their own development; structural connections do not replace their prerequisites. “All tiers” is the long-term scope of the collection, not a claim of complete curriculum coverage.

The routes to calculus and finite fields can develop separately. They can reconnect through transformations, convolution, interpolation, and approximation when the appropriate prerequisites are available.

**10. Build three small pilots before expanding the visual vocabulary.**

| ID | Author title | Primary action | Central relationship | Fresh case |
|---|---|---|---|---|
| W01 | Correspondence | Pair objects and vary their arrangement | Complete one-to-one pairing | New positions and shapes; one unmatched object |
| W02 | Membership | Move stable objects among visibly demonstrated selection regions | Membership in one, both, or neither of two sets | A new object satisfying both rules |
| W03 | Composition | Connect two routing mechanisms and trace objects through them | The second action receives the first action's output | Reorder two distinct routing mechanisms |

For W02, begin by demonstrating one rule, then add a second. The overlap represents shared membership of the same object. It must not duplicate that object. A visible selection rule can be based on a simple attribute, but the child must be able to infer the rule from examples and counterexamples.

For W03, two mechanisms can permute three tracks: one swaps the first pair of tracks and the other swaps the second pair. Their composition is a permutation, and reversing their order changes the result. This gives composition and order a precise mechanical interpretation with persistent objects. Start with one mechanism before introducing the second.

Subsequent studies can introduce cycles, tile regrouping, measurement, and parity. Their order should follow demonstrated entry skills. Age labels should not lock access.

The first prototype collection now includes W01 construction, rearrangement, unmatched cases, reserve edits, and fresh examples; W02 two-predicate membership with a scrubbable sorting demonstration; and W03 composition, order changes, bypass, and output prediction. The earlier inline correspondence study remains a separate exploration of motion and appearance. Whether learners transfer the intended relationships still requires observation.

**11. Carry this grammar into relations, matrices, and finite fields.**

Relations can be represented by connections and by a grid of ordered pairs. A transition between the two should track an actual connection into its cell. Boolean composition should visibly expose the intermediate point that witnesses a connection. The order of operations and the row/column convention belong in the exact model.

On a fixed universe, union of relations corresponds to entrywise OR; intersection to AND; complement to NOT relative to all possible ordered pairs; converse to transpose; identity to the diagonal; and composition to Boolean matrix multiplication. Reachability by repeated composition introduces a separate question from paths of exactly a specified length.

Two distinct two-step routes illustrate an important boundary: their existence is true in Boolean arithmetic, their number is two in ordinary counting, and their count is zero modulo two. The final zero must retain the visible evidence that routes existed. These are different arithmetic interpretations of the same arrangement.

| Operator experience | Possible visual mechanism | Mathematical condition to preserve |
|---|---|---|
| Polynomial multiplication | Tile shifted coefficient vectors and combine aligned contributions | Ordinary multiplication is bilinear; fixing one factor gives a linear map |
| Convolution matrix | Track shifted copies into columns of an operator | Basis order and boundary convention determine the matrix |
| Polynomial reduction | Route higher-degree contributions back through the modulus relation | Reduction is linear for a fixed modulus over the coefficient field |
| Extension-field multiplication | Combine convolution with reduction | The quotient is a field when the defining polynomial is irreducible over the base field |
| Multiplication by a fixed field element | Transform all basis directions and assemble their images | The resulting matrix represents a linear map over the base field |
| Division and inverse | Undo an invertible multiplication map | A nonzero field multiplier is invertible; a general ring element need not be |
| Frobenius | Track the p-th power map; later use a normal basis to expose rotation | Over GF(p^n), this map is linear over GF(p); rotation depends on the chosen basis and convention |
| Trace and norm | Connect an element's multiplication matrix to its trace and determinant | Field trace is additive and base-field linear; field norm is multiplicative and is generally not a linear map |
| Change of basis | Move coordinates between descriptions while preserving the transformation | The multiplication matrices are related by similarity |

For the finite-field visualizations, a color index must not imply a natural order or Euclidean magnitude on field elements. A heat view needs a consistent encoding, and exact coefficient inspection can remain an optional view in advanced experiences.

Do not identify GF(p^n), for n greater than one, with integer arithmetic modulo p^n. Reducible polynomial quotients provide useful counterexamples with noninvertible multipliers.

The existing Galois in Motion HTML preserves substantial advanced mathematical work. Its written guide and dense interface belong to that exploration's current design. This charter does not silently convert it into a wordless early-learning lesson. Its next adaptation should isolate one mechanism at a time.

**12. Let the continuous strand develop its own meaning.**

Measurement should establish a unit and a quantity before a visual length is used as a number. Fractions can appear through equal subdivisions that preserve the whole. Signed change needs a visible direction convention.

Accumulation can be explored by moving a boundary and tracking how the accumulated quantity responds. Rate of change can connect a small input movement with the resulting output movement. A later experience can refine the interval and reveal where a proposed local relationship succeeds or fails.

A finite subdivision remains finite. A sharper picture does not establish continuity, differentiability, completeness, or convergence. A corner, a jump, or a persistent error can expose a boundary to an apparent pattern. Real-analysis experiences need to develop the meaning of arbitrary refinement and assumptions before claiming to communicate a general limit argument.

These are design research tasks. The finite-field and real strands may share operator representations while having very different notions of arithmetic, distance, order, and convergence.

**13. Keep the implementation small and portable.**

GitHub Pages can serve the proposed static HTML, CSS, and JavaScript collection, with publication from a configured branch or an Actions workflow. [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) · [Publishing source options](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Use maintainable shared source and generate independent one-file lessons. A downloaded lesson should retain its complete experiment without a network connection, parent page, account, API key, remote font, or CDN library. Use relative links for the collection.

| Proposed repository location | Purpose |
|---|---|
| curriculum/plan.md | This charter |
| curriculum/lessons.json | IDs, concepts, entry skills, prerequisites, related experiences, status |
| src/lessons/ | Mathematical models and interactions |
| src/shared/ | Small, demonstrated common interaction and rendering components |
| build.py | Standard-library build and self-contained exports |
| tests/ | Focused mathematical and interaction checks |
| evidence/ | Review findings and actual release checks |
| docs/index.html | Combined wordless collection and visual navigation; branch publishing entry point |
| docs/correspondence.html, docs/membership.html, docs/composition.html | Independent HTML experiences |
| notes/ | Adult and author descriptions |
| GitHub Pages branch source | The prototype can publish from /docs; a custom workflow is optional later |

Keep the mathematical model separate from visual layout and animation progress. Compute a scrubbed frame from the current input and progress value; do not rely on accumulating frame-by-frame mutations that change the result after repeated scrubbing.

A mathematical operation can produce an inspectable sequence of states or contributions. The renderer controls how that sequence is revealed. This separation makes it possible to change appearance without changing the underlying example.

Use exact arithmetic for finite fields and relevant finite structures. Use declared approximations and error assumptions where real-valued computation is involved. Extract shared components only after actual lessons demonstrate the common need.

The learner-facing catalogue can use previews of each mechanism. Accessible names and adult metadata remain available without becoming visible reading requirements. Distinguish prerequisites from related concepts; the graph of connections can be richer than the progression graph.

**14. Keep access and reduced motion within the design.**

Every dragging task should have an equivalent simple pointer action, such as selecting an object and then its destination. This is also a W3C accessibility recommendation. [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

Keep native keyboard-operable controls and nonvisual accessible names. Meaningful differences should survive removal of color. Assistive descriptions should expose the same objects and operations, rather than merely describe an image.

The learner controls instructional motion. Provide meaningful stable states and a stepwise or low-motion way to inspect the same transformation. Respect reduced-motion preferences. W3C's pause/stop guidance is a useful baseline for moving content. [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

The visual surface is the focus of this project. Equivalent modalities need their own attention; a wordless visual language should not be described as automatically accessible to every learner.

**15. Use one concise authoring brief and four kinds of evidence.**

| Brief field | Specify before implementation |
|---|---|
| Intended relationship | What the learner can construct or anticipate; necessary entry skills |
| Exact mathematics | Objects, domain, operation, invariants, conventions, and scope |
| Visual grammar | Meaning of each perceivable feature and how that meaning is introduced |
| Primary action | Gesture, controlled quantity, feedback, and alternative input |
| Motion semantics | Valid states, transition paths, scrubbing, and any inverse/history distinction |
| Nonverbal episode | Demonstration, independent action, contrasting case, transfer |
| Access and physical connection | Perception and input alternatives; a physical counterpart where useful |
| Verification | Independent mathematical reasoning, interaction checks, device inspection, observation limits |

Mathematical checks establish correctness of operations. Interaction checks establish that controls affect the intended state. Presentation and access checks establish that the exported experience can be perceived and operated. Learner observations investigate what people take from it. None substitutes for the others.

Inspect the exact exported HTML before publication. Check the actual devices and input methods available, including narrow screens and offline opening. Record unavailable checks explicitly. A blocked preview is an outstanding check, not a reason to mark the file as visually verified.

The current Galois exploration has arithmetic and script-execution checks from its prototype work. Rendered browser and mobile checks remain outstanding. The first wordless collection has 1,622 finite-model checks, 275 assertions in an exported-script event harness, and offline inspection of four exports. Its vector scenes were inspected separately. These are not actual browser, touch-device, accessibility-conformance, or learning-effectiveness checks.

**16. Proceed through small, reviewable milestones.**

| Milestone | Deliverable | Decision it enables |
|---|---|---|
| M01 — Establish the direction | Delivered: this charter, design notes, and an initial motion study | Assess whether the appearance and behavior express the intended design direction |
| M02 — Build W01 | Working prototype: construction, rearrangement, unmatched cases, reserve edits, new examples | Observe whether the mechanism communicates pairing without required narration |
| M03 — Observe and revise | Focused usability and nonverbal transfer observations | Improve the affordances and separate cue-following from the intended relationship |
| M04 — Build W02 and W03 | Working prototypes: membership and composition experiences | Test whether the developing visual grammar carries into another structure |
| M05 — Prepare the collection | Prepared: shared source, combined collection, independent exports, review evidence | Complete device checks, then publish the intended repository when requested |
| M06 — Extend the routes | Implemented: cycles, inverses, equality of action, relation matrices, route composition, and hinged cube folding; tiles, measurement, and parity remain planned | Grow from established interactions and actual prerequisites |

These milestones distinguish the working prototypes from the observation and publication work still ahead. No repository issues have been created and no publication has been performed. Use milestones until the first experiences establish realistic authoring and review effort.

The immediate target is a mechanism that a learner can discover, control, and use in a new situation. The ambition for the whole series is to preserve that quality as the mathematics becomes more powerful.


**17. Add a future probability experience using grains, pegs, and bins.**

A small stream of particles can fall from one source through a triangular array of pegs into collection bins. Begin with one path, then several paths reaching the same bin, then many accumulated outcomes. Let the learner release particles, inspect collisions, scrub a recorded trajectory, and compare observed bin heights with a visually distinct expected profile.

For an ideal model with n independent binary choices and a fixed probability p of going right, the final bin has binomial probabilities. After N completed trials, expected bin counts are N times those probabilities. Keep the assumptions and exact calculations in author notes; the first learner view needs only paths and accumulating grains. [NIST binomial-distribution reference](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm)

A genuine collision simulation needs a separate interpretation. Momentum, peg geometry, friction, and particle interactions can violate the ideal independent-choice model. Do not force the physical simulation to match a binomial histogram. Compare the models honestly and preserve the difference between a finite sample and an expectation.

This lesson continues the same grammar: deterministic routing becomes probabilistic branching; repeated composition becomes a random walk; later extensions can connect path counts, Pascal's triangle, convolution, stochastic matrices, and diffusion under appropriate assumptions. It is planned for a future lesson, not implemented in the first collection.

**18. Make the series feel cumulative through familiar structure.**

The shared design philosophy is identity through change and increasing power through composition. Keep the same material, destination shapes, connections, and inspection controls recognizable. Introduce complexity by combining familiar actions and then letting a whole mechanism become a movable object.

The first collection uses a dark, quiet field; warm objects; cool structural boundaries; fine attached connections; local rings of light; and optional restrained tones. The mathematical action remains the focus. Words stay in supporting documents and assistive descriptions.

The aspiration is lasting mathematical agency: a learner discovers that a relationship can survive changes in appearance and become a tool for understanding another situation. The next evidence to seek is successful nonverbal transfer to a fresh arrangement or a physical counterpart.


**19. Extend the collection through representation and structure.**

Version 0.3.0 adds three independent experiences without changing how a lesson
joins the library. Each folder owns its manifest, glyph, model, view, local
mathematical checks, exported interaction checks, and a short author packet.

| Experience | First encounter | Later variation | Bridge onward |
|---|---|---|---|
| Connections | Three shapes and one undirected line, mirrored as matrix cells | Directed arcs, four vertices, and self-loops; edit either representation | Relations, adjacency matrices, finite linear actions |
| Through | Two routes from one source to one destination through distinct shapes | Remove an edge; compose an inverse; switch route marks to brightness | Matrix multiplication, Boolean composition, path counts, later probability |
| Fold | Two rigid squares sharing one hinge | Open box, then a six-face net closing into a cube; orbit independently | Rigid transformations, polyhedra, incidence, symmetry |

These are small parallel branches. Spatial folding does not require a learner
to finish relation composition. The navigation therefore uses suggested acyclic
progression plus conceptual links, and every experience remains open.

A promising next encounter is repeated branching: one route becomes many
possible routes, then the peg-board lesson can compare counts with sampled
outcomes under explicit assumptions. A parallel spatial extension can expose
faces, edges, and vertices as an incidence structure, returning to Connections.
Parity and shift-and-combine mechanisms can then provide a careful bridge toward
coding theory, convolution, and polynomial arithmetic. These are design targets,
not features shipped in version 0.3.0.

Keep inspecting whether the interaction communicates its structure, whether a
learner can reverse or predict a change, and whether the same structure is
recognized in a different appearance. Wordless elegance is a design aim;
learning transfer remains something to observe.


**20. Let a representation answer an experienced question.**

Version 0.4.0 slows the opening to Correspondence, Membership, Branch, and Return.
The full constellation remains immediately available. Finishing the opening
invites exploration instead of automatically routing a visitor into a matrix
study. `opening_order` is optional local metadata; ordinary additions still
join the collection without editing a central registry.

Branch begins with one bead and one fork. Repeating that action allows different
journeys to reach the same arrival, with an earlier path retained as a dashed
trace. It introduces deliberate choice and comparison before random sampling,
path-count displays, or a second representation. Its first touch target is
visible while still, and a tap demonstrates only one bounded action.

The design hypothesis is that a learner should experience something worth
remembering or comparing before being offered a new symbolic record of it.
The original graph/matrix and folding ideas remain valuable destinations.
More gradual encounters can build their meaning. `notes/encounters.md` records
the critique, a small authoring budget, the exact mathematics under Branch, and
candidate directions toward counting, probability, parity, and spatial reasoning.

This revision is an implemented hypothesis supported by mathematical and input
checks. Its learning consequences still need observation. Feedback about
confusion is useful evidence for the next design decision.
