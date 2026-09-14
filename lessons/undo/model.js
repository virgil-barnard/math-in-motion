const UndoModel = (() => {
  const permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const targets=[[1,2,0],[1,0,2],[2,0,1],[2,1,0]];
  const compose=(a,b)=>a.map(x=>b[x]);
  const inverse=p=>p.map((_,i)=>p.indexOf(i));
  const equal=(a,b)=>a.every((x,i)=>x===b[i]);
  const create=(seed=0)=>({version:1,seed,choice:0,progress:0});
  const target=s=>targets[s.seed%targets.length];
  function choices(s){const correct=inverse(target(s)),wrong=permutations.filter(p=>!equal(p,correct));const out=[wrong[s.seed%wrong.length],wrong[(s.seed+2)%wrong.length]];out.splice(1+s.seed%2,0,correct);return out;}
  const result=s=>compose(target(s),choices(s)[s.choice]);
  const solved=s=>equal(result(s),permutations[0]);
  function restore(v){return v?.version===1&&Number.isInteger(v.seed)&&v.seed>=0&&Number.isInteger(v.choice)&&v.choice>=0&&v.choice<3&&Number.isFinite(v.progress)&&v.progress>=0&&v.progress<=1?{version:1,seed:v.seed,choice:v.choice,progress:v.progress}:create();}
  return{permutations,targets,compose,inverse,equal,create,target,choices,result,solved,restore};
})();
if(typeof module!=='undefined')module.exports=UndoModel;
