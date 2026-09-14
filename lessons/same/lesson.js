(() => {
  const M=SameModel,K=MotionKit,R=MotionRoutes;let s=M.create();
  const set=p=>{s.progress=p;};
  function choose(i){if(i!==s.choice)view.tween(s.progress,0,set,350,()=>{s.choice=i;view.render();view.tone(i);});}
  function describe(){return s.progress<1?'Compare two constructions on identical sets of three inputs. Choose a single operation on the right to match the two operations on the left.':M.solved(s)?'Both constructions agree on every input. The single mechanism has the same action as the pair.':'The constructions disagree. At least one input finishes on a different track.';}
  const view=K.create({title:'Same',description:'Identical sets of three shapes travel through two constructions. The left uses two operations in succession. The right uses one chosen operation. Choose a lower tile and inspect all three outputs. Matching one example is not enough: these constructions must agree on every input in their three-element domain.',glyph:R.card([1,2,0]),describe,progress:()=>s.progress,snapshot:()=>({...s}),restore:v=>{s=M.restore(v);},
    render(v){
      const gap=v.w*.04,panel=(v.w-gap)/2,boxes=[{x:0,y:v.h*.12,w:panel,h:v.h*.60},{x:panel+gap,y:v.h*.12,w:panel,h:v.h*.60}],chains=[M.chain(s),[M.choices(s)[s.choice]]];
      let body='',items=[];const radius=v.w<450?7.8:11;
      boxes.forEach((box,j)=>{
        body+=R.drawing(chains[j],s.progress,box,{complete:s.progress===1&&M.solved(s),radius});
        for(let i=0;i<3;i++){const p=R.point(chains[j],i,s.progress,box);body+=K.shape(K.shapes[i],p.x,p.y,radius,K.C[i]);}
      });
      const spacing=Math.min(94,v.w*.28);
      M.choices(s).forEach((p,i)=>items.push({key:`choice-${i}`,kind:'choice',x:v.w/2+(i-1)*spacing,y:v.h*.89,art:R.card(p),selected:s.choice===i,label:`Candidate ${i+1}: routes input tracks to ${p.map(x=>x+1).join(', ')}.`}));
      v.paint(body,items);v.examples(s.seed%M.cases.length,M.cases.length);
    },
    play(){if(s.progress===1)view.tween(1,0,set,500,()=>view.tween(0,1,set,2900));else view.tween(s.progress,1,set,2900*(1-s.progress),()=>{if(M.solved(s))view.tone(3);});},
    rewind(){view.tween(s.progress,0,set,550);},scrub:set,example(){s=M.create(s.seed+1);},activate(key){if(key.startsWith('choice-'))choose(Number(key.split('-')[1]));},nudge(key,dir){if(key.startsWith('choice-'))choose((s.choice+dir+3)%3);}
  });view.start();
})();
