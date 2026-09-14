const assert=require('node:assert/strict'),M=require('./model.js');let checks=0;
for(const counts of M.cases){
  let first=1;
  // Independent repeated application to distinct labelled objects.
  const original=counts.map(n=>Array.from({length:n},(_,i)=>i));
  const rotating=original.map(xs=>xs.slice());
  for(;;first++){
    rotating.forEach(xs=>xs.unshift(xs.pop()));
    if(rotating.every((xs,j)=>xs.every((v,i)=>v===original[j][i])))break;
    assert(first<100);checks++;
  }
  assert.equal(M.period(counts),first);checks++;
  for(let t=-2*first;t<=2*first;t++)for(const n of counts){
    const positions=Array.from({length:n},(_,i)=>M.slot(i,t,n));
    assert.equal(new Set(positions).size,n);assert.equal(M.atHome(t,n),positions.every((x,i)=>x===i));checks+=2;
  }
}
assert.equal(M.period([2,4]),4);assert.equal(M.period([2,3]),6);checks+=2;
for(const [a,b,expected] of [[Math.PI-.1,-Math.PI+.1,.2],[-Math.PI+.1,Math.PI-.1,-.2]]){assert(Math.abs(M.angularDelta(a,b)-expected)<1e-12);checks++;}
assert.deepEqual(M.restore({phase:NaN}),M.create());checks++;
console.log(JSON.stringify({lesson:'return',checks,passed:true}));
