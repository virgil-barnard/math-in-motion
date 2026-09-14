/* A finite collection, a partition, positions, and one inspectable gesture.
   Positions interpolate; membership changes only at recorded boundaries. */
const BundleModel=(()=>{
  const LIMIT=256,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const copy=value=>JSON.parse(JSON.stringify(value));
  const count=seed=>2+seed%2;
  const canonical=groups=>groups.map(g=>[...g].sort((a,b)=>a-b)).filter(g=>g.length).sort((a,b)=>a[0]-b[0]);
  function validFrame(frame,n){
    if(!frame||!Array.isArray(frame.points)||frame.points.length!==n||!Array.isArray(frame.groups))return false;
    if(!frame.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1)))return false;
    const used=new Set();
    for(const group of frame.groups){
      if(!Array.isArray(group)||!group.length)return false;
      for(const id of group){if(!Number.isInteger(id)||id<0||id>=n||used.has(id))return false;used.add(id);}
    }
    return used.size===n;
  }
  function create(seed=0){
    seed=Number.isSafeInteger(seed)&&seed>=0?seed%2:0;
    const points=seed?[[.28,.3],[.62,.3],[.66,.85]]:[[.33,.43],[.67,.43]];
    return{version:1,seed,record:[{points,groups:seed?[[0,1],[2]]:[[0,1]]}],cursor:0};
  }
  function restore(value){
    if(value?.version!==1||!Number.isInteger(value.seed)||value.seed<0||value.seed>1||!Array.isArray(value.record)||!value.record.length||value.record.length>LIMIT||!value.record.every(f=>validFrame(f,count(value.seed)))||typeof value.cursor!=='number'||!Number.isFinite(value.cursor)||value.cursor<0||value.cursor>value.record.length-1)return create();
    return{version:1,seed:value.seed,record:value.record.map(f=>({points:copy(f.points),groups:canonical(f.groups)})),cursor:value.cursor};
  }
  function current(s){
    const i=Math.floor(s.cursor),a=s.record[i],b=s.record[Math.min(i+1,s.record.length-1)],t=s.cursor-i;
    return{points:a.points.map((p,id)=>p.map((v,k)=>v+(b.points[id][k]-v)*t)),groups:copy(a.groups)};
  }
  const groupOf=(frame,id)=>frame.groups.find(g=>g.includes(id));
  const refinement=(a,b)=>canonical(a.flatMap(g=>b.map(h=>g.filter(id=>h.includes(id)))));
  function regroup(frame,id,target=null){
    const out=copy(frame),source=groupOf(out,id),destination=target===null?null:groupOf(out,target);
    if(!source||(target!==null&&!destination)||source===destination)return out;
    out.groups=out.groups.map(g=>g.filter(x=>x!==id));
    if(destination)out.groups[frame.groups.findIndex(g=>g.includes(target))].push(id);
    else out.groups.push([id]);
    out.groups=canonical(out.groups);return out;
  }
  function translate(frame,ids,dx,dy){
    const out=copy(frame);if(!ids.length||!ids.every(id=>Number.isInteger(id)&&id>=0&&id<frame.points.length)||!Number.isFinite(dx)||!Number.isFinite(dy))return out;
    dx=clamp(dx,-Math.min(...ids.map(id=>frame.points[id][0])),1-Math.max(...ids.map(id=>frame.points[id][0])));
    dy=clamp(dy,-Math.min(...ids.map(id=>frame.points[id][1])),1-Math.max(...ids.map(id=>frame.points[id][1])));
    for(const id of new Set(ids)){out.points[id]=[clamp(frame.points[id][0]+dx),clamp(frame.points[id][1]+dy)];}
    return out;
  }
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function begin(s){return{version:1,seed:s.seed,record:[current(s)],cursor:0};}
  function reserve(s,amount=1){
    while(s.record.length+amount>LIMIT){
      const last=s.record.length-1;s.record=s.record.filter((_,i)=>i===0||i===last||i%2===1);s.cursor=s.record.length-1;
    }
  }
  function append(s,frame){
    if(!validFrame(frame,count(s.seed)))return false;
    const clean={points:copy(frame.points),groups:canonical(frame.groups)};
    if(same(s.record.at(-1),clean))return false;
    // Keep both endpoints when thinning an unusually long gesture. Ordinary
    // gestures retain every sample; the record stores geometry, not elapsed time.
    reserve(s);
    s.record.push(clean);s.cursor=s.record.length-1;return true;
  }
  function animate(s,to,steps=20){
    const result=begin(s),from=result.record[0],between=refinement(from.groups,to.groups);
    for(let i=1;i<=steps;i++)append(result,{points:i===steps?copy(to.points):from.points.map((p,id)=>p.map((v,k)=>v+(to.points[id][k]-v)*i/steps)),groups:i===steps?to.groups:between});
    result.cursor=0;return result;
  }
  const seek=(s,p)=>{s.cursor=clamp(Number.isFinite(p)?p:0)*(s.record.length-1);};
  const progress=s=>s.record.length>1?s.cursor/(s.record.length-1):0;
  return{LIMIT,copy,canonical,count,validFrame,create,restore,current,groupOf,refinement,regroup,translate,same,begin,reserve,append,animate,seek,progress};
})();
if(typeof module!=='undefined')module.exports=BundleModel;
