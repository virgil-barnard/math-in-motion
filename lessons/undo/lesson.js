(() => {
  const M=UndoModel,K=MotionKit,R=MotionRoutes;let s=M.create(),dragTile=null;
  const set=p=>{s.progress=p;};
  function choose(index){if(index===s.choice)return;view.tween(s.progress,0,set,340,()=>{s.choice=index;view.render();view.tone(index);});}
  function describe(){return s.progress<1?'Choose a lower routing tile, then follow all three shapes through the two mechanisms.':M.solved(s)?'All three shapes have returned to their original tracks. The second mechanism undoes the first.':'The shapes have not all returned to their original tracks. Try another lower tile.';}
  const view=K.create({title:'Undo',description:'The upper routing mechanism rearranges three shapes. Choose or drag a small routing tile into the lower mechanism, then play or scrub. Faint outlines at the outputs mark the original arrangement. A true undo restores every input. The lower tiles are three different operations.',glyph:R.card([2,0,1]),progress:()=>s.progress,describe,snapshot:()=>({...s}),restore:v=>{s=M.restore(v);},
    render(v){
      const box={x:0,y:v.h*.10,w:v.w,h:v.h*.62},chain=[M.target(s),M.choices(s)[s.choice]];
      let body=R.drawing(chain,s.progress,box,{ghosts:[0,1,2],complete:s.progress===1&&M.solved(s)}),items=[];
      for(let i=0;i<3;i++){const p=R.point(chain,i,s.progress,box);body+=K.shape(K.shapes[i],p.x,p.y,11,K.C[i]);}
      const gap=Math.min(94,v.w*.28);
      M.choices(s).forEach((p,i)=>items.push({key:`choice-${i}`,kind:'choice',x:dragTile?.choice===i?dragTile.x:v.w/2+(i-1)*gap,y:dragTile?.choice===i?dragTile.y:v.h*.89,art:R.card(p),selected:s.choice===i,label:`Candidate ${i+1}. Routes input tracks to ${p.map(x=>x+1).join(', ')}. Select it or drag it into the lower mechanism.`}));
      v.paint(body,items);v.examples(s.seed%M.targets.length,M.targets.length);
    },
    play(){if(s.progress===1)view.tween(1,0,set,500,()=>view.tween(0,1,set,2600));else view.tween(s.progress,1,set,2600*(1-s.progress),()=>{if(M.solved(s))view.tone(3);});},
    rewind(){view.tween(s.progress,0,set,550);},scrub:set,example(){s=M.create(s.seed+1);},activate(key){if(key.startsWith('choice-'))choose(Number(key.split('-')[1]));},
    down(key){return key.startsWith('choice-')?{choice:Number(key.split('-')[1])}:null;},
    move(d,p){dragTile={choice:d.choice,x:K.clamp(p.x,32,view.w-32),y:K.clamp(p.y,28,view.h-28)};view.announce('Release the routing tile inside the lower mechanism.');},
    up(d,p){dragTile=null;if(p.x>view.w*.07&&p.x<view.w*.93&&p.y>view.h*.4&&p.y<view.h*.72)choose(d.choice);},
    cancel(){dragTile=null;},nudge(key,dir){if(key.startsWith('choice-'))choose((s.choice+dir+3)%3);}
  });view.start();
})();
