const assert=require('node:assert/strict'),M=require('./model.js'),G=require('./geometry.js');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const close=(a,b)=>Math.abs(a-b)<1e-9;
const equivalent=(groups,i,j)=>groups.some(g=>g.includes(i)&&g.includes(j));
// Enumerate equivalence relations by assigning labels, independently of the model.
function partitions(n){const out=new Map();for(let code=0;code<n**n;code++){let k=code;const labels=Array.from({length:n},()=>{const v=k%n;k=Math.floor(k/n);return v;}),blocks=[];for(let label=0;label<n;label++){const ids=labels.flatMap((v,id)=>v===label?[id]:[]);if(ids.length)blocks.push(ids);}blocks.sort((a,b)=>a[0]-b[0]);out.set(JSON.stringify(blocks),blocks);}return[...out.values()];}
for(const n of [2,3]){
  const all=partitions(n);check(all.length===(n===2?2:5),'independent partition enumeration has the expected size');
  const initial=M.current(M.create(n-2));
  for(const groups of all){
    const frame={points:initial.points,groups};
    for(let id=0;id<n;id++)for(const target of [null,...Array.from({length:n},(_,i)=>i)]){
      const frozen=JSON.stringify(frame),out=M.regroup(frame,id,target);
      check(M.validFrame(out,n),'every transfer conserves every identity exactly once');
      check(JSON.stringify(frame)===frozen,'transfer does not mutate its input');
      for(let i=0;i<n;i++)for(let j=0;j<n;j++){
        let expected;
        if(i===j)expected=true;
        else if(target===id)expected=equivalent(groups,i,j);
        else if(i===id||j===id){const other=i===id?j:i;expected=target===null?false:equivalent(groups,other,target);}
        else expected=equivalent(groups,i,j);
        check(equivalent(out.groups,i,j)===expected,'group relation agrees with an independent element-pair oracle');
      }
    }
    for(const other of all){const meet=M.refinement(groups,other);for(let i=0;i<n;i++)for(let j=0;j<n;j++)check(equivalent(meet,i,j)===(equivalent(groups,i,j)&&equivalent(other,i,j)),'groups kept during transit are exactly those shared by both endpoints');}
    for(const group of groups)for(const dx of [-2,-.13,0,.17,2])for(const dy of [-2,0,.21,2]){
      const out=M.translate(frame,group,dx,dy);check(M.validFrame(out,n),'bounded translation stays inside the board');
      check(JSON.stringify(out.groups)===JSON.stringify(groups),'translation preserves the partition');
      for(const i of group)for(const j of group)check(close(out.points[i][0]-out.points[j][0],frame.points[i][0]-frame.points[j][0])&&close(out.points[i][1]-out.points[j][1],frame.points[i][1]-frame.points[j][1]),'every content receives the same displacement, including at an edge');
      for(let i=0;i<n;i++)if(!group.includes(i))check(JSON.stringify(out.points[i])===JSON.stringify(frame.points[i]),'unrelated contents stay in place');
    }
  }
  const reachable=new Map([[JSON.stringify(initial.groups),initial]]),queue=[initial];
  while(queue.length){const p=queue.shift();for(let id=0;id<n;id++)for(const target of [null,...Array.from({length:n},(_,i)=>i)]){const q=M.regroup(p,id,target),key=JSON.stringify(q.groups);if(!reachable.has(key)){reachable.set(key,q);queue.push(q);}}}
  check(reachable.size===all.length,'unpacking and joining can reach every partition of the collection');
}
const s=M.create(1),before=M.current(s),transferred=M.regroup(before,1,2);
const to=G.nearestPlacement(transferred,[1,2],[.65,.8]);check(to&&G.separated(to),'regrouped contents can be placed without swallowing an unrelated object');
const record=M.animate(s,to);check(record.cursor===0,'a demonstration starts at the recorded input');
for(const p of [0,.023,.25,.5,.8,.999,1]){M.seek(record,p);const frame=M.current(record);check(M.validFrame(frame,3),'replay has a complete partition at every inspection point');check(frame.points.length===3,'interpolation does not duplicate or remove objects');}
check(JSON.stringify(M.current(record))===JSON.stringify(to),'last replay frame is the exact target');
M.seek(record,.423);const inspected=M.current(record),branch=M.begin(record);check(JSON.stringify(M.current(branch))===JSON.stringify(inspected),'editing can branch from the inspected positions and discrete grouping');
const restored=M.restore(record);check(JSON.stringify(restored)===JSON.stringify(record),'versioned snapshot preserves the entire latest gesture and cursor');restored.record[0].points[0][0]=.99;check(record.record[0].points[0][0]!==.99,'restored snapshots do not alias their inputs');
for(const invalid of [null,{}, {...record,version:9},{...record,seed:2},{...record,cursor:Infinity},{...record,cursor:-1},{...record,record:[]},{...record,record:[{points:[[0,0],[1,1],[.5,.5]],groups:[[0,1],[1,2]]}]},{...record,record:[{points:[[NaN,0],[1,1],[.5,.5]],groups:[[0,1,2]]}]}])check(JSON.stringify(M.restore(invalid))===JSON.stringify(M.create()),'malformed snapshots recover to the first encounter');
const long=M.create();for(let i=0;i<1200;i++){const f=M.current(M.create());f.points[0][1]=.1+.8*(i%100)/100;M.append(long,f);}
check(long.record.length<=M.LIMIT&&long.record.length>1,'long gestures have a bounded record');check(JSON.stringify(long.record[0])===JSON.stringify(M.create().record[0]),'thinning retains the original pose');check(close(long.record.at(-1).points[0][1],.892),'thinning retains the latest pose');
// Whole-bundle motion cannot tunnel through the third object.
const d=G.shift(before,[0,1],0,1);check(Math.abs(d[1]-.145)<1e-7,'continuous collision stops at the first contact with the singleton');
for(let i=0;i<=100;i++){const moved=M.translate(before,[0,1],d[0]*i/100,d[1]*i/100);check(G.separated(moved),'the entire permitted sweep keeps unrelated bundles separate');}
for(const delta of [[-2,0],[2,0],[0,-2],[.7,.8],[-.8,.5],[.5,-.7]]){
  const safe=G.shift(before,[0,1],...delta),moved=M.translate(before,[0,1],...safe);
  check(G.separated(moved),'oblique and boundary-constrained translations preserve separation');
  check(M.validFrame(moved,3),'resolved geometry stays in the normalized domain');
}
for(const w of [260,280,320,390,736])for(const h of [370,500]){
  const board=G.board(w,h);
  for(const n of [2,3]){
    const frame={points:Array.from({length:n},()=>[.5,.5]),groups:[Array.from({length:n},(_,i)=>i)]};
    for(const desired of [[0,0],[1,1],[.5,.5]]){
      const packed=G.nearestPlacement(frame,frame.groups[0],desired),r=G.capsule(packed,packed.groups[0],board);
      check(r.x>=0&&r.y>=0&&r.x+r.w<=w&&r.y+r.h<=h,'capsule boundary stays within the smallest stage');
      const points=packed.points.map(p=>G.pixel(p,board));for(let i=0;i<n;i++){const p=points[i];check(p.x>=24&&p.x<=w-24&&p.y>=24&&p.y<=h-24,'native object target fits');for(let j=i+1;j<n;j++)check(Math.hypot(p.x-points[j].x,p.y-points[j].y)>=48,'objects in a bundle retain separate touch targets');}
    }
  }
}
console.log(JSON.stringify({lesson:'bundle',suite:'partition, conservation, replay, and geometry',checks,passed:true}));
