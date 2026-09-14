(() => {
  const M=ConnectionsModel,K=MotionKit,R=RelationBoard;let s=M.create(),nodes=[],ghost=null,hover=null;
  const directed=K.svg('<circle cx="8" cy="24" r="4" fill="#eedbb6"/><circle cx="40" cy="24" r="4" fill="#83d6d1"/><path d="M14 24h19m-7-6 7 6-7 6" stroke="#83d6d1" fill="none" stroke-width="1.6"/>');
  const undirected=K.svg('<circle cx="8" cy="24" r="4" fill="#eedbb6"/><circle cx="40" cy="24" r="4" fill="#83d6d1"/><path d="M14 24h20" stroke="#83d6d1" stroke-width="1.6"/>');
  const set=p=>{s.progress=p;};
  const name=i=>K.shapes[i];
  function describe(){const [a,b]=s.focus;return `${s.directed?'Directed':'Undirected'} connections. ${s.matrix.length} vertices. Columns are sources; rows are destinations. ${s.selected!==null?`${name(s.selected)} selected; choose another vertex to toggle a connection.`:`${name(a)} to ${name(b)}: ${s.matrix[b][a]?'connected':'not connected'}.`}`;}
  function edit(a,b){M.toggle(s,a,b);ghost=null;hover=null;view.tone(b);if(s.matrix[b][a])view.tween(0,1,set,1100);}
  function nearest(p){let best=null;nodes.forEach((q,i)=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<35&&(!best||d<best.d))best={i,d};});return best?.i??null;}
  function render(v){
    const n=s.matrix.length,g=R.layout(v.w,v.h,n);nodes=R.ringNodes(g.graph,n);
    const pair=ghost?.target!==null&&ghost?.target!==undefined?[ghost.src,ghost.target]:hover||s.focus;
    let body=R.headers(g,n),items=[];
    const arcs=M.arcs(s);for(const [a,b] of arcs){if(!s.directed&&a>b)continue;
      const on=pair&&(pair[0]===a&&pair[1]===b||!s.directed&&pair[0]===b&&pair[1]===a);
      const e=R.edge(nodes[a],nodes[b],{loop:a===b,curved:s.directed&&a!==b&&!!s.matrix[a][b],directed:s.directed});
      body+=R.line(e,on?K.C[a]:'#648896',on?.95:.55,on?2:1.4);
    }
    if(ghost){const p=nodes[ghost.src];body+=`<path d="M${K.f(p.x)} ${K.f(p.y)}L${K.f(ghost.x)} ${K.f(ghost.y)}" fill="none" stroke="${K.C[ghost.src]}" stroke-dasharray="3 6" stroke-opacity=".6"/>`;}
    for(let i=0;i<n;i++)items.push({key:`node-${i}`,kind:'node',...nodes[i],shape:K.shapes[i],color:K.C[i],selected:s.selected===i,label:`${name(i)} vertex. Select it and another vertex, or drag to another vertex, to toggle their connection. Select it twice for a loop.`});
    for(let row=0;row<n;row++)for(let col=0;col<n;col++){
      const selected=pair&&pair[0]===col&&pair[1]===row;
      items.push({key:`cell-${row}-${col}`,kind:'cell',...R.cellPoint(g,row,col),art:R.presence(s.matrix[row][col],K.C[col],selected),selected:!!s.matrix[row][col],label:`${name(col)} to ${name(row)}. ${s.matrix[row][col]?'Connected; remove':'Not connected; add'}${!s.directed&&row!==col?' both directions':''}.`});
    }
    const [a,b]=s.focus;
    if(s.matrix[b][a]){
      const e=R.edge(nodes[a],nodes[b],{loop:a===b,curved:s.directed&&a!==b&&!!s.matrix[a][b],directed:s.directed});
      if(s.progress>0&&s.progress<1)body+=R.bead(e.point(s.progress),K.C[a]);
      body+=R.matrixTrace(g,b,a,s.progress);
    }
    items.push({key:'mode-undirected',kind:'mode',x:v.w/2-40,y:g.toolsY,art:undirected,selected:!s.directed,label:'Use undirected connections. Every existing arc becomes a two-way connection.'},{key:'mode-directed',kind:'mode',x:v.w/2+40,y:g.toolsY,art:directed,selected:s.directed,label:'Use directed connections. Each direction can be edited independently.'});
    v.paint(body,items);v.examples(s.seed%M.cases.length,M.cases.length);
  }
  const view=K.create({title:'Connections',description:'One relationship is shown as connected shapes and as a matrix. Columns and rows carry the same shapes. Select two graph vertices or drag between them to edit a connection. Tap a matrix cell to edit that same connection. The arrow control makes connections directed; the plain-line control makes them undirected. Follow the probe from a source column down to its cell and across to its destination row.',glyph:directed,render,describe,progress:()=>s.progress,snapshot:()=>JSON.parse(JSON.stringify(s)),restore:v=>{s=M.restore(v);ghost=null;hover=null;},
    scrub:set,rewind(){view.tween(s.progress,0,set,500);},play(){const [a,b]=s.focus;if(!s.matrix[b][a]){const first=M.arcs(s)[0];if(!first){view.announce('Add a connection to trace it.');return;}s.focus=first;}s.progress=0;view.tween(0,1,set,1700);},example(){s=M.create(s.seed+1);ghost=null;hover=null;},
    activate(key){if(key.startsWith('cell-')){const [,r,c]=key.split('-').map(Number);edit(c,r);}else if(key.startsWith('node-')){const i=Number(key.split('-')[1]);if(s.selected===null)s.selected=i;else edit(s.selected,i);}else if(key.startsWith('mode-')){M.direct(s,key==='mode-directed');hover=null;}},
    down(key){if(key.startsWith('node-'))return{src:Number(key.split('-')[1]),original:s.selected};return null;},
    move(d,p){ghost={src:d.src,x:p.x,y:p.y,target:nearest(p)};},
    up(d,p){const to=nearest(p);ghost=null;if(to!==null)edit(d.src,to);},cancel(d){ghost=null;s.selected=d.original;},escape(){s.selected=null;ghost=null;hover=null;}
  });
  const objects=document.getElementById('objects');
  objects.addEventListener('pointerover',e=>{const b=e.target.closest('button[data-key]');if(b?.dataset.key.startsWith('cell-')){const [,r,c]=b.dataset.key.split('-').map(Number);hover=[c,r];view.render();}});
  objects.addEventListener('pointerleave',()=>{hover=null;view.render();});
  view.start();
})();
