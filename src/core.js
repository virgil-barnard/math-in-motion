/* Exact finite models and deterministic geometry. No browser dependencies. */
const MotionMath = (() => {
  const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
  const mix = (a, b, t) => t === 0 ? a : t === 1 ? b : a + (b - a) * t;
  const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
  const point = (a, b, t) => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) });
  function random(seed) {
    let value = (seed + 1) >>> 0;
    return () => { value = (Math.imul(1664525, value) + 1013904223) >>> 0; return value / 4294967296; };
  }
  function shuffled(values, seed) {
    const out = values.slice(), rng = random(seed);
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  const row = (i, n, left = .2, right = .8) => n === 1 ? .5 : mix(left, right, i / (n - 1));
  const CASES = [[2, 2], [3, 3], [3, 4], [4, 3], [4, 4]];
  function pairing(seed = 0) {
    const [a, b] = CASES[seed % CASES.length];
    const tokens = Array.from({ length: Math.max(a, b) }, (_, i) => ({
      id: i, shape: seed > 3 && i % 2 ? 'diamond' : 'circle', active: i < a,
      x: i < a ? row(i, a, a >= 4 ? .19 : .25, a >= 4 ? .81 : .75) : .5,
      y: i < a ? .25 + (i % 2) * .025 : .43
    }));
    const sockets = Array.from({ length: b }, (_, i) => ({ id: i, x: row(i, b, .22, .78), y: .67 }));
    return { kind: 'pairing', seed, tokens, sockets, links: seed === 0 ? { 0: 0 } : {}, progress: seed === 0 ? 1 : 0, selected: null, layout: 0 };
  }
  function reservePoint(state, token) {
    const pool = state.tokens.filter(t => !t.active);
    return { x: row(pool.findIndex(t => t.id === token.id), pool.length, .32, .68), y: .88 };
  }
  function pairPoint(state, token) {
    if (!token.active) return reservePoint(state, token);
    const id = state.links[token.id];
    const target = state.sockets.find(s => s.id === id);
    return target ? point(token, target, smooth(state.progress)) : { x: token.x, y: token.y };
  }
  function connect(state, tokenId, socketId) {
    const token = state.tokens.find(t => t.id === tokenId);
    if (!token || !state.sockets.some(s => s.id === socketId)) return false;
    if (Object.entries(state.links).some(([id, socket]) => Number(id) !== tokenId && socket === socketId)) return false;
    token.active = true;
    state.links[tokenId] = socketId;
    state.selected = null;
    return true;
  }
  function putAway(state, tokenId) {
    const token = state.tokens.find(t => t.id === tokenId);
    if (!token) return;
    token.active = false;
    delete state.links[tokenId];
    state.selected = null;
  }
  function completePairing(state) {
    const active = state.tokens.filter(t => t.active);
    return active.length === state.sockets.length && active.every(t => state.links[t.id] !== undefined) && new Set(Object.values(state.links)).size === active.length;
  }
  function rearrangePairing(state) {
    state.layout++;
    const rng = random(state.seed * 83 + state.layout * 977);
    const active = state.tokens.filter(t => t.active);
    const order = shuffled(active.map(t => t.id), state.layout + state.seed * 19);
    active.forEach(t => { t.x = row(order.indexOf(t.id), active.length, .2, .8); t.y = .23 + rng() * .17; });
    const targets = shuffled(state.sockets.map(s => s.id), state.layout * 7 + state.seed);
    state.sockets.forEach(s => { s.x = row(targets.indexOf(s.id), targets.length, .19, .81); s.y = .61 + rng() * .13; });
    state.progress = 0;
  }
  const regionOf = token => (token.shape === 'circle' ? 1 : 0) | (token.filled ? 2 : 0);
  function membership(seed = 0) {
    const n = seed % 3 === 2 ? 6 : 4;
    const order = shuffled(Array.from({ length: n }, (_, i) => i), seed + 49);
    const tokens = Array.from({ length: n }, (_, i) => ({
      id: i, shape: i % 2 === 0 ? 'circle' : (seed % 2 ? 'triangle' : 'diamond'),
      filled: i % 4 < 2, size: 13 + ((seed + i) % 2) * 2,
      x: n === 4 ? row(order.indexOf(i), n, .17, .83) : row(order.indexOf(i) % 3, 3, .23, .77),
      y: n === 4 ? .86 : .75 + Math.floor(order.indexOf(i) / 3) * .17
    }));
    return { kind: 'membership', seed, tokens, progress: 0, selected: null, layout: 0 };
  }
  function lenses(w, h) {
    const r = Math.min(w * .275, h * .275);
    const y = h * .39, offset = r * .53;
    return { left: { x: w / 2 - offset, y }, right: { x: w / 2 + offset, y }, r };
  }
  function regionAt(x, y, w, h) {
    const g = lenses(w, h);
    const inside = c => Math.hypot(x * w - c.x, y * h - c.y) <= g.r + 1e-7;
    return (inside(g.left) ? 1 : 0) | (inside(g.right) ? 2 : 0);
  }
  function regionAnchor(region, w, h) {
    const g = lenses(w, h);
    if (region === 0) return { x: .5, y: (g.left.y + g.r + 45) / h };
    if (region === 1) return { x: (g.left.x - g.r * .44) / w, y: g.left.y / h };
    if (region === 2) return { x: (g.right.x + g.r * .44) / w, y: g.right.y / h };
    return { x: .5, y: g.left.y / h };
  }
  function memberTarget(state, token, w, h) {
    const group = state.tokens.filter(t => regionOf(t) === regionOf(token));
    const anchor = regionAnchor(regionOf(token), w, h);
    return { x: anchor.x, y: anchor.y + (group.findIndex(t => t.id === token.id) - (group.length - 1) / 2) * 48 / h };
  }
  function memberPoint(state, token, w, h) {
    const index = state.tokens.indexOf(token);
    const t = smooth(state.progress * (state.tokens.length + 1) / 2 - index / 2);
    return point(token, memberTarget(state, token, w, h), t);
  }
  function rebaseMembers(state, w, h) {
    const points = state.tokens.map(t => memberPoint(state, t, w, h));
    state.tokens.forEach((t, i) => Object.assign(t, points[i]));
    state.progress = 0;
  }
  function completeMembership(state, w, h) {
    return state.tokens.every(t => { const p = memberPoint(state, t, w, h); return regionAt(p.x, p.y, w, h) === regionOf(t); });
  }
  function rearrangeMembership(state) {
    state.layout++;
    const order = shuffled(state.tokens.map(t => t.id), state.seed + state.layout * 29);
    const n = state.tokens.length;
    state.tokens.forEach(t => {
      const i = order.indexOf(t.id);
      t.x = row(n === 4 ? i : i % 3, n === 4 ? 4 : 3, .18, .82);
      t.y = n === 4 ? .86 : .75 + Math.floor(i / 3) * .17;
    });
    state.progress = 0;
    state.selected = null;
  }
  const identity = [0, 1, 2];
  const compose = (first, second) => first.map(destination => second[destination]);
  const validPermutation = p => p.length === 3 && p.every(x => Number.isInteger(x) && x >= 0 && x < 3) && new Set(p).size === 3;
  function composition(seed = 0) {
    const cases = [[[1, 0, 2], [0, 2, 1]], [[0, 2, 1], [2, 1, 0]], [[1, 2, 0], [1, 0, 2]]];
    const pair = cases[seed % cases.length];
    return { kind: 'composition', seed, gates: pair.map((p, i) => ({ id: i, perm: p.slice(), active: true })), progress: 0, selected: 0, predictions: {}, previous: null };
  }
  const gatePermutation = gate => gate.active ? gate.perm : identity;
  const result = state => compose(gatePermutation(state.gates[0]), gatePermutation(state.gates[1]));
  function route(state, input) {
    const middle = gatePermutation(state.gates[0])[input];
    return [input, middle, gatePermutation(state.gates[1])[middle]];
  }
  function routePoint(state, input, progress = state.progress) {
    const lanes = route(state, input), xs = [.22, .5, .78];
    const y = mix(.10, .82, clamp(progress));
    let x = xs[lanes[0]];
    if (y >= .22 && y <= .42) x = mix(xs[lanes[0]], xs[lanes[1]], smooth((y - .22) / .2));
    else if (y > .42 && y < .52) x = xs[lanes[1]];
    else if (y >= .52 && y <= .72) x = mix(xs[lanes[1]], xs[lanes[2]], smooth((y - .52) / .2));
    else if (y > .72) x = xs[lanes[2]];
    return { x, y };
  }
  function swapGates(state) { state.previous = state.progress === 1 ? result(state) : null; state.gates.reverse(); state.progress = 0; state.predictions = {}; }
  function toggleGate(state, id) { state.previous = state.progress === 1 ? result(state) : null; const gate = state.gates.find(g => g.id === id); gate.active = !gate.active; state.progress = 0; state.predictions = {}; }
  return { clamp, mix, smooth, point, random, shuffled, row, pairing, pairPoint, connect, putAway, completePairing, rearrangePairing, membership, regionOf, regionAt, regionAnchor, lenses, memberTarget, memberPoint, rebaseMembers, completeMembership, rearrangeMembership, identity, compose, validPermutation, composition, gatePermutation, result, route, routePoint, swapGates, toggleGate };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = MotionMath;
