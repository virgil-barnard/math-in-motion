/* Disjoint cycles. Real phase is animation time; only integer moves are permutations. */
const ReturnModel = (() => {
  const cases=[[2],[3],[2,3],[2,4],[3,4]];
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const period=counts=>counts.reduce(lcm,1);
  const mod=(x,n)=>(x%n+n)%n;
  const atHome=(phase,n)=>Math.abs(phase-Math.round(phase))<1e-7&&mod(Math.round(phase),n)===0;
  const slot=(identity,moves,n)=>mod(identity+moves,n);
  const angularDelta=(before,after)=>Math.atan2(Math.sin(after-before),Math.cos(after-before));
  const create=(seed=0)=>({version:1,seed,phase:0});
  const counts=s=>cases[mod(s.seed,cases.length)];
  function progress(s){const n=period(counts(s)),p=mod(s.phase,n);return Math.abs(p)<1e-8&&Math.abs(s.phase)>1e-8?1:p/n;}
  function restore(value){
    if(value?.version!==1||!Number.isInteger(value.seed)||value.seed<0||!Number.isFinite(value.phase)||Math.abs(value.phase)>1e6)return create();
    return{version:1,seed:value.seed,phase:value.phase};
  }
  return{cases,gcd,lcm,period,mod,atHome,slot,angularDelta,create,counts,progress,restore};
})();
if(typeof module!=='undefined')module.exports=ReturnModel;
