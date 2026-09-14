const assert=require('node:assert/strict'),M=require('./model.js');let checks=0;
const matrix=p=>p.map((_,r)=>p.map(x=>+(x===r)));
const multiply=(a,b)=>a.map(row=>b[0].map((_,j)=>row.reduce((n,v,k)=>n+v*b[k][j],0)));
for(const p of M.permutations){const inv=M.inverse(p);assert.deepEqual(M.compose(p,inv),[0,1,2]);assert.deepEqual(M.compose(inv,p),[0,1,2]);checks+=2;}
for(let seed=0;seed<16;seed++){
  const s=M.create(seed);let solutions=0;
  for(let choice=0;choice<3;choice++){
    s.choice=choice;assert.deepEqual(matrix(M.result(s)),multiply(matrix(M.choices(s)[choice]),matrix(M.target(s))));checks++;
    if(M.solved(s))solutions++;
  }
  assert.equal(solutions,1);checks++;
}
console.log(JSON.stringify({lesson:'undo',checks,passed:true}));
