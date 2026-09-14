# Make a question before introducing its notation

Design revision for version 0.4.0, prompted by feedback that the graph/matrix
experience arrived abruptly and felt confusing. The earlier positive visual
feedback remains useful, but visual appeal did not establish a natural learning
progression. This revision changes the opening and builds one smaller encounter.

## The hypothesis

A representation becomes easier to approach when it answers a question someone
has already encountered through action. The first scene should establish an
object, an available action, and a perceivable consequence. Repetition and
contrast can then make a relationship worth remembering. A second notation can
help preserve, compare, or reuse that relationship.

The graph/matrix study simultaneously introduced relation editing, matrix
orientation, and correspondence between two views. Each is a plausible lesson
in its own right. They remain available as later studies; the default opening
now offers a smaller sequence of familiar actions. The folding studies also
remain in the full constellation, ready for a spatial path with more groundwork.

This is a design hypothesis. Neither a small interface nor the absence of words
establishes understanding or an age at which a learner will discover its meaning.

## A small budget for each encounter

| Stage | What the learner can do | What the author should establish |
|---|---|---|
| Handle | Touch a visible object or destination | The still scene makes a useful gesture discoverable |
| Repeat | Perform the same action again | Identity and the rule survive the repetition |
| Contrast | Change one choice or arrangement | A tempting but overgeneral rule has a visible counterexample |
| Remember | Keep a trace or compare an earlier construction | The record has a purpose before a new notation appears |
| Reuse | Treat a familiar mechanism as a unit | New complexity is built from actions whose consequences are known |

These are authoring questions, not mandatory screens or a five-step tutorial.
Do not add an unfamiliar gesture and an unfamiliar representation at the same
moment. Direct controls should remain visible at rest. A deliberate tap may
show one bounded action. Idle motion should not be required to explain where
to touch. Keep animations reversible and leave time for anticipation.

## Branch: the concrete experiment

The first scene contains one bead, one fork, and two open rings. Dragging or
selecting a ring carries the bead along the corresponding rail. Tapping the
bead demonstrates a single step and comes to rest. It is a complete encounter
with choice and consequence before any larger lattice appears.

The next example repeats the same fork. Return after a completed journey and
try another way. The earlier route remains as a faint dashed trace. Left then
right and right then left visibly reunite. The one-fork example supplies a
contrast: some different journeys have different arrivals. A third example
repeats the same action once more. No diagram-to-matrix translation is required.

There is only one live bead. A trace is a record of its journey. Playback and
scrubbing follow the same choices. A random outcome is not regenerated when time
is moved backward or forward. In fact, this lesson has no randomness at all.

For an author, the precise map takes a word of left/right choices to the pair
(number of left steps, number of right steps). Concatenating words adds those
pairs. Distinct words can therefore have the same image; exchanging adjacent
left/right steps preserves the arrival. Later, the sizes of these groups of
journeys become useful counts. This is a bridge toward equivalence, many-to-one
maps, combinatorics, and probability, without asking the first scene to teach
all of those subjects.

## What to observe next

Record observations in ordinary notes, with no learner score or inferred mastery:

- Does the learner act on the bead or its destinations without narration?
- Does returning lead to a deliberate different choice, rather than only replay?
- Does the dashed trace help a comparison, or become another unexplained symbol?
- Can the learner anticipate a reunion before moving, then find one in a changed example?

Discovering a control, imitating an action, predicting an outcome, and transferring
a relationship are different observations. Change the design in response to
where the explanation stops carrying its meaning. The next release should be
shaped by these observations, including adult confusion, rather than by lesson
count alone.

## Where the small mechanism can lead

1. **Remember several journeys.** Let a few deliberately chosen paths collect
   in their arrival places. Distinguish repeating a journey from finding a new
   possible journey. This supplies the question that path counts answer.
2. **Release the choice.** Introduce repeated sampled journeys, then an expected
   profile under an explicitly specified independent-branch model. A separate
   physical collision model can later test how geometry and momentum change it.
3. **Build a record.** When a learner needs to remember many connections, unfold
   a grid from an already familiar set of endpoints, one entry at a time. Only
   then bring back the simultaneous graph/matrix study.
4. **Change the kind of combination.** Ordinary counts can accumulate; pairs in
   a parity mechanism can cancel. Keep their arithmetic distinct before moving
   toward coding theory and finite fields.
5. **Return to space.** Begin with rigid movement in the plane, shared boundaries,
   and one hinge before polyhedral incidence and spatial transformations.

These are candidate directions, not a fixed age ladder or implemented features
of this release. We will choose a next encounter that earns its own small step.

## Keep the software equally small

Branch is a complete local lesson with its own model, geometry, view, tests,
manifest, and author packet. The shared kit is unchanged. Optional manifest
`opening_order` selects the short default path. The complete dependency and
conceptual graph remains available behind the constellation control. Ordinary
lesson additions require no central ID registry and do not automatically crowd
the opening. Cross-lesson exchange of learner-built mechanisms can wait until
a concrete pair of lessons needs a small, typed shared object.
