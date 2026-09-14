const SameModel = (() => {
  const cases=[[[1,0,2],[0,2,1]],[[0,2,1],[2,1,0]],[[2,1,0],[1,0,2]]];
  const identity=[0,1,2],compose=(a,b)=>a.map(x=>b[x]);
  const equal=(a,b)=>a.every((x,i)=>x===b[i]);
  const create=(seed=0)=>({version:1,seed,choice:0,progress:0});
  const chain=s=>cases[s.seed%cases.length];
  const target=s=>compose(...chain(s));
  function choices(s){const [a,b]=chain(s),out=[compose(b,a),identity];out.splice(1+s.seed%2,0,target(s));return out;}
  const solved=s=>equal(choices(s)[s.choice],target(s));
  function restore(v){return v?.version===1&&Number.isInteger(v.seed)&&v.seed>=0&&Number.isInteger(v.choice)&&v.choice>=0&&v.choice<3&&Number.isFinite(v.progress)&&v.progress>=0&&v.progress<=1?{version:1,seed:v.seed,choice:v.choice,progress:v.progress}:create();}
  return{cases,identity,compose,equal,create,chain,target,choices,solved,restore};
})();
if(typeof module!=='undefined')module.exports=SameModel;
