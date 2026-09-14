/* A[destination][source] is one directed arc, consistent with column vectors. */
const ConnectionsModel = (() => {
  const cases=[{n:3,directed:false,edges:[[0,1]]},{n:3,directed:true,edges:[[0,1],[1,2],[2,0]]},{n:4,directed:false,edges:[[0,1],[1,2],[2,3],[3,0]]},{n:4,directed:true,edges:[[0,1],[0,2],[1,3],[2,3],[3,3]]}];
  function create(seed=0){const c=cases[seed%cases.length],s={version:1,seed,directed:c.directed,matrix:Array.from({length:c.n},()=>Array(c.n).fill(0)),selected:null,focus:c.edges[0].slice(),progress:0};for(const [a,b] of c.edges){s.matrix[b][a]=1;if(!c.directed)s.matrix[a][b]=1;}return s;}
  function toggle(s,src,dst){s.matrix[dst][src]=1-s.matrix[dst][src];if(!s.directed)s.matrix[src][dst]=s.matrix[dst][src];s.focus=[src,dst];s.selected=null;s.progress=0;}
  function direct(s,on){if(!on)for(let r=0;r<s.matrix.length;r++)for(let c=r+1;c<s.matrix.length;c++)s.matrix[r][c]=s.matrix[c][r]=+(s.matrix[r][c]||s.matrix[c][r]);s.directed=on;s.selected=null;s.progress=0;}
  function arcs(s){const out=[];for(let src=0;src<s.matrix.length;src++)for(let dst=0;dst<s.matrix.length;dst++)if(s.matrix[dst][src])out.push([src,dst]);return out;}
  function restore(v){
    if(v?.version!==1||!Number.isSafeInteger(v.seed)||v.seed<0||typeof v.directed!=='boolean')return create();
    const n=cases[v.seed%cases.length].n,valid=i=>Number.isInteger(i)&&i>=0&&i<n;
    if(!Array.isArray(v.matrix)||v.matrix.length!==n||!v.matrix.every(row=>Array.isArray(row)&&row.length===n&&row.every(x=>x===0||x===1))||!Number.isFinite(v.progress)||v.progress<0||v.progress>1||(v.selected!==null&&!valid(v.selected))||!Array.isArray(v.focus)||v.focus.length!==2||!v.focus.every(valid))return create();
    if(!v.directed&&v.matrix.some((row,r)=>row.some((x,c)=>x!==v.matrix[c][r])))return create();
    return{version:1,seed:v.seed,directed:v.directed,matrix:v.matrix.map(row=>row.slice()),selected:v.selected,focus:v.focus.slice(),progress:v.progress};
  }
  return{cases,create,toggle,direct,arcs,restore};
})();
if(typeof module!=='undefined')module.exports=ConnectionsModel;
