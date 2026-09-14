(() => {
  const M=BranchModel,G=BranchGeometry,K=MotionKit;let s=M.create(),g,held=false;
  const glyph=K.svg('<path d="M24 7v9C24 26 10 25 10 37M24 16c0 10 14 9 14 21" fill="none" stroke="#648896" stroke-width="1.5"/><circle cx="24" cy="7" r="4" fill="#eedbb6"/><circle cx="10" cy="39" r="5" fill="none" stroke="#83d6d1"/><circle cx="38" cy="39" r="5" fill="none" stroke="#83d6d1"/>');
  const ring=K.svg('<circle cx="24" cy="24" r="13" fill="#102230" fill-opacity=".55" stroke="#83d6d1" stroke-width="1.2"/><circle cx="24" cy="24" r="19" fill="none" stroke="#83d6d1" stroke-opacity=".15"/>');
  const copy=()=>JSON.parse(JSON.stringify(s)),set=p=>M.inspect(s,p),depth=()=>Math.min(M.count(s),Math.floor(s.progress*M.count(s)+1e-7));
  function describe(){const n=M.count(s),relation=M.relation(s),position=Math.round(s.progress*n*100)/100;return `${n} ${n===1?'fork':'forks'}. Journey at step ${position}. ${relation==='same-arrival'?'Different journeys, the same arrival.':relation==='same-route'?'The same journey was repeated.':relation==='different-arrival'?'These journeys have different arrivals.':s.progress===1?'Journey complete. Return to the start and try another way.':'Drag the warm bead toward either open ring, or select a ring.'}${s.reference?' The dashed trail remembers the previous completed journey.':''}`;}
  function choose(side){const i=depth();if(i>=M.count(s))return rewind();M.choose(s,i,side);view.tween(s.progress,(i+1)/M.count(s),set,620,()=>view.tone(side));}
  function rewind(){view.tween(s.progress,0,set,850);}
  function render(v){
    const n=M.count(s);g=G.layout(n,v.w,v.h);const at=G.traveler(s.route,s.progress,g),i=depth(),slot=M.arrival(s.route.slice(0,i));let body='',items=[];
    for(let row=0;row<n;row++)for(let k=0;k<=row;k++)for(const side of [0,1])body+=`<path d="${G.edge(g.point(row,k),g.point(row+1,k+side))}" fill="none" stroke="#648896" stroke-width="1.7" stroke-opacity=".22"/>`;
    for(let row=1;row<=n;row++)for(let k=0;k<=row;k++){const p=g.point(row,k);body+=`<circle cx="${p.x}" cy="${p.y}" r="${row===n?10:3}" fill="${row===n?'#102230':'#648896'}" fill-opacity=".22" stroke="#648896" stroke-opacity=".32"/>`;}
    if(s.reference){const p=g.point(n,M.arrival(s.reference));body+=`<path d="${G.trace(s.reference,1,g)}" fill="none" stroke="#b7a4e8" stroke-opacity=".58" stroke-width="2" stroke-dasharray="3 6"/><circle cx="${p.x}" cy="${p.y}" r="18" fill="none" stroke="#b7a4e8" stroke-opacity=".65" stroke-dasharray="3 5"/>`;}
    const trace=G.trace(s.route,s.progress,g);body+=`<path d="${trace}" fill="none" stroke="#eedbb6" stroke-opacity=".06" stroke-width="10"/><path d="${trace}" fill="none" stroke="#eedbb6" stroke-opacity=".9" stroke-width="2.2"/>`;
    if(i<n){for(const side of [0,1]){const p=g.point(i+1,slot+side);body+=`<path d="${G.edge(g.point(i,slot),p)}" fill="none" stroke="#83d6d1" stroke-opacity="${held?.55:.36}" stroke-width="1.8"/>`;items.push({key:`choice-${side}`,kind:'branch-choice',...p,art:ring,label:`Take the ${side?'right':'left'} branch at fork ${i+1}.`});}}
    const home=g.point(0,0);if(Math.hypot(at.x-home.x,at.y-home.y)>60)items.push({key:'home',kind:'branch-home',...home,art:K.svg('<circle cx="24" cy="24" r="12" fill="none" stroke="#eedbb6" stroke-opacity=".45"/><path d="m18 23 6-6 6 6M24 17v14" fill="none" stroke="#eedbb6" stroke-opacity=".6"/>'),label:'Return the bead to its starting place. The recorded journey remains scrubbable.'});
    const end=s.progress===1,same=M.relation(s)==='same-arrival';
    if(same)body+=`<circle cx="${at.x}" cy="${at.y}" r="33" fill="#83d6d1" fill-opacity=".035" stroke="#83d6d1" stroke-opacity=".5"/>`;
    const art=K.svg(`<circle cx="24" cy="24" r="21" fill="#eedbb6" fill-opacity="${held?.10:.035}" stroke="#eedbb6" stroke-opacity="${held?.6:.25}"/><circle cx="24" cy="24" r="11" fill="#eedbb6"/>${end?'<path d="M8 11a21 21 0 0 1 32 4M40 8v8h-8" fill="none" stroke="#83d6d1" stroke-width="1.2"/>':''}`);
    items.push({key:'traveler',kind:'branch-traveler',...at,art,label:end?'Journey complete. Tap to return to the start, or drag back along the trail.':'Warm bead. Drag toward an open ring. Tap to demonstrate one step. Left and right arrow keys choose a branch; up moves back.'});
    v.paint(body,items);v.examples(s.seed%3,3);document.getElementById('timeline').disabled=s.route.length===0;
  }
  const view=K.create({title:'Branch',description:'One warm bead meets one fork. Drag it toward an open ring or tap a ring to choose a direction. Tapping the bead demonstrates one step. Return to the starting ring and choose a different journey; a dashed trace remembers the last completed one. Later examples repeat the same fork. Some different journeys meet at the same arrival. Play and the timeline replay the chosen journey without generating a new one. This is deliberate choice, not a random or physical simulation.',glyph,render,describe,progress:()=>s.progress,snapshot:copy,restore:v=>{s=M.restore(v);held=false;},scrub:set,
    play(){if(s.progress===1)s.progress=0;M.plan(s);view.tween(s.progress,1,set,Math.max(500,(1-s.progress)*M.count(s)*1050),()=>view.tone(2));},rewind,example(){s=M.create(s.seed+1);held=false;},
    activate(key){held=false;if(key.startsWith('choice-'))choose(Number(key.at(-1)));else if(key==='home')rewind();else if(key==='traveler'){const i=depth();if(i===M.count(s))rewind();else choose(s.route[i]??i%2);}},
    nudge(key,dir,keyName){if(key!=='traveler')return;if(keyName==='ArrowUp')view.tween(s.progress,Math.max(0,Math.ceil(s.progress*M.count(s)-1e-7)-1)/M.count(s),set,450);else if(keyName==='ArrowDown'){const i=depth();if(i<M.count(s))choose(s.route[i]??i%2);}else choose(dir>0?1:0);},
    down(key){if(key!=='traveler')return null;held=true;return{original:copy(),depth:depth(),mode:s.progress===1?'trace':'choose',t:0};},
    move(d,p){
      if(d.mode==='trace'||d.depth>0&&p.y<g.point(d.depth,0).y-14){d.mode='trace';set(G.along(d.original.route,p,g));return;}
      const k=M.arrival(d.original.route.slice(0,d.depth)),a=g.point(d.depth,k),options=[0,1].map(side=>({side,...G.nearest(a,g.point(d.depth+1,k+side),p)})),best=options.reduce((x,y)=>x.distance<y.distance?x:y);
      // Evaluate every preview from the same snapshot, including the remembered trail.
      s=M.restore(d.original);M.choose(s,d.depth,best.side);d.t=best.t;set((d.depth+best.t)/M.count(s));
    },
    up(d){held=false;if(d.mode==='trace')view.tween(s.progress,Math.round(s.progress*M.count(s))/M.count(s),set,400);else if(d.t>=.5)view.tween(s.progress,(d.depth+1)/M.count(s),set,350,()=>view.tone(1));else s=M.restore(d.original);},
    cancel(d){held=false;s=M.restore(d.original);},escape(){held=false;}
  });view.start();
})();
