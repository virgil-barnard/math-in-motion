'use strict';
const assert = require('node:assert/strict');
const M = require('../src/core.js');
let checks = 0;
function check(value, message) { checks++; assert(value, message); }
function equal(a,b,message) { checks++; assert.deepEqual(a,b,message); }

// A relation is one-to-one throughout assignment, layout changes, and reserve edits.
for(let seed=0;seed<15;seed++){
  const s=M.pairing(seed);
  s.links={};
  const active=s.tokens.filter(t=>t.active);
  for(let i=0;i<Math.min(active.length,s.sockets.length);i++) check(M.connect(s,active[i].id,s.sockets[i].id),'free destination accepts a partner');
  const before={...s.links};
  if(active.length>1) check(!M.connect(s,active[1].id,s.sockets[0].id),'occupied destination rejects a second partner');
  equal(s.links,before,'an invalid assignment preserves the relation');
  for(let i=0;i<7;i++) {M.rearrangePairing(s);equal(s.links,before,'layout does not change pairings');}
  s.progress=1;
  for(const t of active) if(s.links[t.id]!==undefined) equal(M.pairPoint(s,t),{x:s.sockets[s.links[t.id]].x,y:s.sockets[s.links[t.id]].y},'paired endpoints coincide');
  if(active.length<s.sockets.length) check(M.connect(s,s.tokens.find(t=>!t.active).id,s.sockets.length-1),'reserve can supply a missing member');
  if(active.length>s.sockets.length) M.putAway(s,active.at(-1).id);
  check(M.completePairing(s),'each contrast case can be repaired');
  equal(new Set(Object.values(s.links)).size,Object.keys(s.links).length,'all links are injective');
  s.progress=0;
  for(const t of s.tokens){const p=M.pairPoint(s,t);check(p.x>=.08&&p.x<=.92&&p.y>=.08&&p.y<=.92,'unfolding a repaired case keeps every object on the stage');}
}

// Property membership is separate from placement. Shared membership has one token.
const sizes=[[280,320],[320,400],[390,500],[736,520],[980,700]];
for(let seed=0;seed<12;seed++){
  const s=M.membership(seed), ids=s.tokens.map(t=>t.id);
  for(const [w,h] of sizes){
    s.progress=1;
    for(const t of s.tokens){
      const expected=t.shape==='circle'?(t.filled?3:1):(t.filled?2:0);
      equal(M.regionOf(t),expected,'independent truth table');
      const p=M.memberPoint(s,t,w,h);
      equal(M.regionAt(p.x,p.y,w,h),expected,'demonstrated placement satisfies both predicates');
      check(p.x*w>=20&&p.x*w<=w-20&&p.y*h>=20&&p.y*h<=h-20,'resting objects fit the stage');
    }
    check(M.completeMembership(s,w,h),'demonstration completes a valid arrangement');
    equal(s.tokens.map(t=>t.id),ids,'no duplicate or lost identity');
  }
}

// Independent matrix multiplication checks permutation composition order.
const permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const matrix=p=>Array.from({length:3},(_,row)=>Array.from({length:3},(_,col)=>+(p[col]===row)));
const multiply=(a,b)=>a.map(row=>b[0].map((_,col)=>row.reduce((sum,value,k)=>sum+value*b[k][col],0)));
for(const a of permutations) for(const b of permutations){
  const result=M.compose(a,b);
  check(M.validPermutation(result),'composition stays bijective');
  equal(matrix(result),multiply(matrix(b),matrix(a)),'column-vector order is second times first');
  for(const c of permutations) equal(M.compose(M.compose(a,b),c),M.compose(a,M.compose(b,c)),'associativity');
}
const c=M.composition();equal(M.result(c),[2,0,1],'first routing order');
M.swapGates(c);equal(M.result(c),[1,2,0],'reversing order changes the result');
for(let seed=0;seed<9;seed++){
  const s=M.composition(seed);
  for(let i=0;i<3;i++){
    equal(M.routePoint(s,i,0),{x:[.22,.5,.78][i],y:.1},'input endpoint');
    const p=M.routePoint(s,i,1);
    check(Math.abs(p.x-[.22,.5,.78][M.result(s)[i]])<1e-12&&Math.abs(p.y-.82)<1e-12,'output agrees with the exact permutation');
  }
  s.gates.forEach(g=>M.toggleGate(s,g.id));equal(M.result(s),[0,1,2],'bypassing both mechanisms gives identity');
}
console.log(JSON.stringify({suite:'finite models',checks,passed:true}));
