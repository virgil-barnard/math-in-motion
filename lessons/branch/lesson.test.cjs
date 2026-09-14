const assert=require('node:assert/strict'),M=require('./model.js'),G=require('./geometry.js');let checks=0;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},near=(a,b)=>{assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);checks++;};
for(let n=1;n<=3;n++){
  const arrivals=Array(n+1).fill(0);
  for(let bits=0;bits<2**n;bits++){
    const word=Array.from({length:n},(_,i)=>(bits>>i)&1),s=M.create(n-1);let displacement=0;
    for(let i=0;i<n;i++){M.choose(s,i,word[i]);M.inspect(s,(i+1)/n);displacement+=word[i]?1:-1;eq(M.vertices(s.route).at(-1),{row:i+1,slot:(displacement+i+1)/2});}
    eq(s.route,word);eq(s.record,word);eq(s.progress,1);eq(M.arrival(word),(displacement+n)/2);arrivals[(displacement+n)/2]++;
    const saved=M.restore(s);M.inspect(s,0);M.plan(s);eq(s.route,word);eq(s.record,saved.record);
    const reversed=word.slice().reverse();for(let i=0;i<n;i++){M.choose(s,i,reversed[i]);M.inspect(s,(i+1)/n);}
    eq(s.reference,word);eq(M.relation(s),word.join('')===reversed.join('')?'same-route':'same-arrival');
  }
  eq(arrivals,[[1,1],[1,2,1],[1,3,3,1]][n-1]);
}
const a=M.create(1);M.choose(a,0,0);M.inspect(a,1);eq(a.progress,.5);eq(a.record,null);M.plan(a);M.inspect(a,1);M.choose(a,0,1);M.choose(a,1,1);M.inspect(a,1);eq(M.relation(a),'different-arrival');
const before=M.restore(a);eq(M.choose(a,3,0),false);eq(M.choose(a,0,2),false);eq(a,before);
// Independent de Casteljau construction for the emitted cubic geometry.
function bezier(points,t){if(points.length===1)return points[0];return bezier(points.slice(1).map((p,i)=>({x:(1-t)*points[i].x+t*p.x,y:(1-t)*points[i].y+t*p.y})),t);}
for(const w of [260,320,736])for(const h of [370,500])for(let n=1;n<=3;n++){
  const g=G.layout(n,w,h);
  for(let row=0;row<=n;row++)for(let k=0;k<=row;k++){const p=g.point(row,k);assert(p.x>=32&&p.x<=w-32&&p.y>=32&&p.y<=h-32);checks++;}
  for(let row=0;row<n;row++)for(let k=0;k<=row;k++)for(const side of [0,1]){
    const a=g.point(row,k),b=g.point(row+1,k+side),dy=b.y-a.y,controls=[a,{x:a.x,y:a.y+.44*dy},{x:b.x,y:b.y-.44*dy},b];
    for(const t of [0,.1,.3,.5,.8,1]){const q=G.point(a,b,t),expected=bezier(controls,t);near(q.x,expected.x);near(q.y,expected.y);const inverse=G.nearest(a,b,q);assert(Math.sqrt(inverse.distance)<.01);checks++;}
  }
  for(let bits=0;bits<2**n;bits++){
    const route=Array.from({length:n},(_,i)=>(bits>>i)&1);for(const p of [0,.13,.5,.91,1]){const q=G.traveler(route,p,g),back=G.along(route,q,g);assert(Math.abs(back-p)<.001);checks++;}
    const q=G.traveler(route,1,g);near(q.x,w/2+route.reduce((x,b)=>x+(b?1:-1),0)*g.dx);
  }
}
for(const bad of [null,{}, {...M.create(),route:[2]},{...M.create(),progress:.2},{...M.create(),seed:-1},{...M.create(),reference:[0,1]},{...M.create(),record:[]},{...M.create(),progress:NaN}])eq(M.restore(bad),M.create());
const restored=M.restore(a);restored.route[0]=0;eq(a.route[0],1);
console.log(JSON.stringify({lesson:'branch',checks,passed:true}));
