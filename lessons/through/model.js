/* Two relations compose as C = B A, with destination rows and source columns. */
const ThroughModel = (() => {
  const n=3,blank=()=>Array.from({length:n},()=>Array(n).fill(0));
  const cases=[{a:[[0,0],[0,1],[1,1],[2,2]],b:[[0,2],[1,2],[2,0]]},{a:[[0,1],[1,2],[2,0]],b:[[0,2],[1,0],[2,1]]},{a:[[0,0],[0,1],[0,2],[1,2],[2,0]],b:[[0,0],[1,0],[2,0],[2,2]]}];
  function create(seed=0){const c=cases[seed%cases.length],s={version:1,seed,a:blank(),b:blank(),focus:[0,seed%cases.length===1?0:seed%cases.length===2?0:2],selected:null,progress:0,heat:false};for(const [i,j] of c.a)s.a[j][i]=1;for(const [i,j] of c.b)s.b[j][i]=1;return s;}
  const witnesses=(s,src,dst)=>Array.from({length:n},(_,k)=>k).filter(k=>s.a[k][src]&&s.b[dst][k]);
  const product=s=>Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>Array.from({length:n},(_,k)=>s.b[r][k]*s.a[k][c]).reduce((x,y)=>x+y,0)));
  function toggle(s,layer,src,dst){const m=layer===0?s.a:s.b;m[dst][src]=1-m[dst][src];s.selected=null;s.progress=0;}
  function restore(v){
    const valid=i=>Number.isInteger(i)&&i>=0&&i<n,mat=m=>Array.isArray(m)&&m.length===n&&m.every(row=>Array.isArray(row)&&row.length===n&&row.every(x=>x===0||x===1));
    if(v?.version!==1||!Number.isSafeInteger(v.seed)||v.seed<0||!mat(v.a)||!mat(v.b)||!Number.isFinite(v.progress)||v.progress<0||v.progress>1||typeof v.heat!=='boolean'||!Array.isArray(v.focus)||v.focus.length!==2||!v.focus.every(valid)||(v.selected!==null&&(!Array.isArray(v.selected)||v.selected.length!==2||!v.selected.every(valid))))return create();
    return{version:1,seed:v.seed,a:v.a.map(r=>r.slice()),b:v.b.map(r=>r.slice()),focus:v.focus.slice(),selected:v.selected?.slice()??null,progress:v.progress,heat:v.heat};
  }
  return{n,cases,create,witnesses,product,toggle,restore};
})();
if(typeof module!=='undefined')module.exports=ThroughModel;
