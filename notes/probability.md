# Future experience: paths into probability

Status: planned, not implemented in the first collection.

A stream of small grains falls from one source, meets a triangular arrangement of pegs, and accumulates in bins. The learner can release one grain, follow its encounters, pause, scrub its recorded path, and then release many. Accumulated outcomes gradually make a distribution visible.

The familiar objects, routes, and destination rings from the first lessons become grains, branching paths, and collection bins. This is a deliberate continuation of the same visual language.

## First encounter

Begin with very few rows and a single grain. Let the learner follow one path into a destination. Then reveal other paths into the same destination. With two binary choices, the middle bin has two possible paths while either outer bin has one.

A larger sample can accumulate in front of faint expected-height outlines. Keep observed counts and the theoretical reference visually distinct. A small sample need not resemble the reference closely, and adding more samples need not reduce every discrepancy monotonically.

The first view needs no formula or written probability. Exact numerical and mathematical descriptions can be available in author notes or a separate advanced inspection view.

## Keep two models distinct

**Ideal branching.** Each of n encounters makes an independent right/left choice with fixed probability p of going right. Animate the chosen route through the pegs. A grain's destination K has the binomial distribution:

P(K = k) = binomial(n, k) p^k (1 - p)^(n - k), for k = 0, …, n.

After N completed ideal trials, the expected number in bin k is N times that probability. For equal branch probabilities, the path counts are a row of Pascal's triangle. The binomial distribution uses a fixed success probability across trials. [NIST reference](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm)

**Physical collisions.** Integrate gravity and contact dynamics for grains and pegs, with declared restitution, friction, initial conditions, and any grain-to-grain collisions. Geometry, momentum, interactions, and boundary effects can correlate successive encounters. A physical simulation must not silently be forced to produce the ideal binomial distribution.

The ideal model provides exact probabilities. The physical model provides an experiment whose outcomes can be measured and compared with a reference under stated assumptions. A later comparison can make the difference between a model and an observed process part of the lesson.

## Later controls and connections

Introduce one change at a time: rows of pegs, branch bias, sample size, or a physical property. Use reproducible random seeds and recorded states so scrubbing inspects the same experiment rather than resampling its past. Rewind is history replay, not reversal of dissipative physics.

Deterministic permutation routing can become stochastic routing. Repeated composition then connects to transition matrices, path counting, random walks, convolution, and appropriate diffusion limits. Finite binomial distributions should not be presented as exactly continuous normal distributions.

## Acceptance before implementation is considered complete

- Confirm exact small cases against enumerated paths in the ideal model.
- Check conservation of grains through release, transit, and arrival.
- Preserve the distinction between completed trials and grains still in flight.
- Expose finite-sample fluctuations without promising that every added grain improves agreement.
- Record enough information to reproduce a trajectory and a complete run.
- Keep input controls, rendered grain counts, and performance appropriate to the device.
- Test whether a learner anticipates a more likely destination in a new arrangement, using nonverbal choices.

This experience belongs after the learner has encountered correspondence, routes, and composition. Its first version should remain small enough that every branch can be followed by eye.
