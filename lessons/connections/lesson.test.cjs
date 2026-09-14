const assert=require('node:assert/strict'),M=require('./model.js');let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
// Independent edge-set oracle: ordered pairs are (source, destination).
for(let bits=0;bits<512;bits++){
  const edges=[];for(let i=0;i<9;i++)if(bits&(1<<i))edges.push([i%3,Math.floor(i/3)]);
  const has=(src,dst)=>edges.some(([a,b])=>a===src&&b===dst);
  const s=M.create(1);s.matrix=Array.from({length:3},(_,dst)=>Array.from({length:3},(_,src)=>+has(src,dst)));
  eq(new Set(M.arcs(s).map(e=>e.join(','))),new Set(edges.map(e=>e.join(','))));
  for(let src=0;src<3;src++){
    // Applying an adjacency matrix to a basis vector marks its outgoing neighbors.
    const e=Array.from({length:3},(_,i)=>+(i===src));
    eq(s.matrix.map(row=>row.reduce((sum,x,i)=>sum+x*e[i],0)),[0,1,2].map(dst=>+has(src,dst)));
    for(let dst=0;dst<3;dst++){
      const t=M.restore(s);M.toggle(t,src,dst);
      eq(t.matrix,Array.from({length:3},(_,r)=>Array.from({length:3},(_,c)=>+(r===dst&&c===src?!has(c,r):has(c,r)))));
    }
  }
  M.direct(s,false);
  eq(s.matrix,Array.from({length:3},(_,dst)=>Array.from({length:3},(_,src)=>+(has(src,dst)||has(dst,src)))));
  for(let src=0;src<3;src++)for(let dst=0;dst<3;dst++){
    const t=M.restore(s),expected=s.matrix.map(row=>row.slice());expected[dst][src]=expected[src][dst]=1-expected[dst][src];M.toggle(t,src,dst);eq(t.matrix,expected);
  }
}
for(const bad of [null,{}, {...M.create(),matrix:[[1]]},{...M.create(),progress:NaN},{...M.create(),selected:-1},{...M.create(),focus:[0,5]},{...M.create(),matrix:[[0,1,0],[0,0,0],[0,0,0]]}])eq(M.restore(bad),M.create());
const copy=M.create(3),restored=M.restore(copy);restored.matrix[0][0]=1;eq(copy.matrix[0][0],0);
console.log(JSON.stringify({lesson:'connections',checks,passed:true}));
