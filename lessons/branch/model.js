/* A journey is an ordered word of left/right choices, not a random trial. */
const BranchModel = (() => {
  const count=s=>1+s.seed%3;
  const create=(seed=0)=>({version:1,seed,route:[],progress:0,reference:null,record:null});
  const arrival=route=>route.reduce((sum,side)=>sum+side,0);
  function vertices(route){let k=0;return [{row:0,slot:0},...route.map((side,i)=>({row:i+1,slot:k+=side}))];}
  function choose(s,depth,side){
    if(!Number.isInteger(depth)||depth<0||depth>=count(s)||depth>s.route.length||(side!==0&&side!==1))return false;
    if(s.record)s.reference=s.record.slice();
    s.route=s.route.slice(0,depth).concat(side);s.progress=depth/count(s);return true;
  }
  function inspect(s,p){s.progress=Math.max(0,Math.min(s.route.length/count(s),p));if(s.progress===1)s.record=s.route.slice();}
  function plan(s){while(s.route.length<count(s))s.route.push(s.route.length%2);}
  function relation(s){if(!s.reference||s.route.length!==count(s)||s.progress!==1)return null;return s.route.every((x,i)=>x===s.reference[i])?'same-route':arrival(s.route)===arrival(s.reference)?'same-arrival':'different-arrival';}
  function restore(v){
    if(v?.version!==1||!Number.isSafeInteger(v.seed)||v.seed<0)return create();const n=count(v);
    const bits=a=>Array.isArray(a)&&a.every(x=>x===0||x===1),full=a=>a===null||bits(a)&&a.length===n;
    if(!bits(v.route)||v.route.length>n||!Number.isFinite(v.progress)||v.progress<0||v.progress>v.route.length/n||!full(v.reference)||!full(v.record))return create();
    return{version:1,seed:v.seed,route:v.route.slice(),progress:v.progress,reference:v.reference?.slice()??null,record:v.record?.slice()??null};
  }
  return{create,count,arrival,vertices,choose,inspect,plan,relation,restore};
})();
if(typeof module!=='undefined')module.exports=BranchModel;
