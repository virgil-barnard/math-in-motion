const assert=require('node:assert/strict'),M=require('./model.js');let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
// Enumerate ordered edges and join their endpoints, independently of dot products.
for(let bits=0;bits<512;bits++)for(const second of [0,1,84,98,273,341,511]){
  const pairs=b=>Array.from({length:9},(_,i)=>[i%3,Math.floor(i/3)]).filter((_,i)=>b&(1<<i));
  const first=pairs(bits),last=pairs(second),s=M.create();
  s.a=Array.from({length:3},(_,r)=>Array.from({length:3},(_,c)=>+first.some(([x,y])=>x===c&&y===r)));
  s.b=Array.from({length:3},(_,r)=>Array.from({length:3},(_,c)=>+last.some(([x,y])=>x===c&&y===r)));
  const routes=[];for(const [src,mid] of first)for(const [next,dst] of last)if(mid===next)routes.push({src,mid,dst});
  const result=M.product(s);
  for(let src=0;src<3;src++)for(let dst=0;dst<3;dst++){
    const expected=routes.filter(r=>r.src===src&&r.dst===dst).map(r=>r.mid).sort();
    eq(M.witnesses(s,src,dst),expected);eq(result[dst][src],expected.length);
  }
}
eq(M.product(M.create(1)),[[1,0,0],[0,1,0],[0,0,1]]);
eq(M.witnesses(M.create(),0,2),[0,1]);eq(M.witnesses(M.create(2),0,0),[0,1,2]);
const s=M.create();M.toggle(s,0,0,1);eq(M.witnesses(s,0,2),[0]);M.toggle(s,1,0,2);eq(M.witnesses(s,0,2),[]);
for(const bad of [null,{}, {...s,a:[[1]]},{...s,b:[[0,0,0],[0,.5,0],[0,0,0]]},{...s,focus:[0,3]},{...s,heat:1},{...s,selected:[0,-1]}])eq(M.restore(bad),M.create());
const t=M.restore(s);t.a[0][0]=0;eq(s.a[0][0],1);
console.log(JSON.stringify({lesson:'through',checks,passed:true}));
