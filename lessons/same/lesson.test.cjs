const assert=require('node:assert/strict'),M=require('./model.js');let checks=0;
for(let seed=0;seed<12;seed++){
  const s=M.create(seed),[a,b]=M.chain(s);let matches=0;
  for(let c=0;c<3;c++){
    s.choice=c;let equal=true;
    for(let input=0;input<3;input++)if(b[a[input]]!==M.choices(s)[c][input])equal=false;
    assert.equal(M.solved(s),equal);if(equal)matches++;checks++;
  }
  assert.equal(matches,1);checks++;
}
// Agreement on one input is insufficient: identity and a swap both fix track 3.
assert.equal([0,1,2][2],[1,0,2][2]);assert.equal(M.equal([0,1,2],[1,0,2]),false);checks+=2;
console.log(JSON.stringify({lesson:'same',checks,passed:true}));
