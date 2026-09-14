(() => {
  const M=ThroughModel,K=MotionKit,R=RelationBoard;let s=M.create(),nodes=[],ghost=null;
  const dotIcon=K.svg(K.shape('circle',14,16,4,K.C[0])+K.shape('square',32,16,4,K.C[1])+K.shape('triangle',24,33,4,K.C[2]));
  const heatIcon=K.svg('<rect x="8" y="10" width="12" height="12" rx="3" fill="#83d6d1" opacity=".2"/><rect x="25" y="10" width="12" height="12" rx="3" fill="#83d6d1" opacity=".45"/><rect x="8" y="27" width="12" height="12" rx="3" fill="#83d6d1" opacity=".65"/><rect x="25" y="27" width="12" height="12" rx="3" fill="#83d6d1"/>');
  const set=p=>{s.progress=p;};
  function describe(){const [a,b]=s.focus,ws=M.witnesses(s,a,b);return `${ws.length} two-step ${ws.length===1?'route':'routes'} from ${K.shapes[a]} to ${K.shapes[b]}${ws.length?`, through ${ws.map(k=>K.shapes[k]).join(' or ')}`:''}. Matrix columns are sources and rows are destinations. Select a result cell to inspect its routes; change the connecting lines to change the result.`;}
  function nearest(p){let best=null;nodes.forEach((column,l)=>column.forEach((q,i)=>{const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<34&&(!best||d<best.d))best={l,i,d};}));return best?[best.l,best.i]:null;}
  function connect(a,b){if(b[0]===a[0]+1){M.toggle(s,a[0],a[1],b[1]);view.tone(b[1]);}else if(a[0]===0&&b[0]===2){s.focus=[a[1],b[1]];s.selected=null;s.progress=0;}else s.selected=b;}
  function cellArt(witness,focused){
    let body=`<rect x="3" y="3" width="42" height="42" rx="8" fill="#83d6d1" fill-opacity="${s.heat?witness.length/3*.62:.025}" stroke="${focused?'#eedbb6':'#648896'}" stroke-opacity="${focused?.85:.22}"/>`;
    if(!s.heat)witness.forEach((k,i)=>{const x=witness.length===1?24:24+(i-(witness.length-1)/2)*12;body+=K.shape(K.shapes[k],x,24,witness.length===1?6:4.2,K.C[k]);});
    return K.svg(body);
  }
  function render(v){
    const g=R.layout(v.w,v.h,3),b=g.graph;
    nodes=Array.from({length:3},(_,l)=>Array.from({length:3},(_,i)=>({x:b.x+b.w*(.13+l*.37),y:b.y+b.h*(.17+i*.34)})));
    const [src,dst]=s.focus,ws=M.witnesses(s,src,dst);let body=R.headers(g,3),items=[];
    for(let layer=0;layer<2;layer++){const mat=layer===0?s.a:s.b;for(let a=0;a<3;a++)for(let z=0;z<3;z++)if(mat[z][a]){
      const active=layer===0?a===src&&ws.includes(z):z===dst&&ws.includes(a);
      const e=R.edge(nodes[layer][a],nodes[layer+1][z],{directed:true});
      body+=R.line(e,active?K.C[layer===0?z:a]:'#648896',active?.9:.3,active?1.9:1.1);
    }}
    if(ghost){const p=nodes[ghost.src[0]][ghost.src[1]];body+=`<path d="M${K.f(p.x)} ${K.f(p.y)}L${K.f(ghost.x)} ${K.f(ghost.y)}" fill="none" stroke="#eedbb6" stroke-opacity=".6" stroke-dasharray="3 6"/>`;}
    nodes.forEach((column,l)=>column.forEach((p,i)=>{
      const highlighted=l===1&&ws.includes(i);
      if(highlighted)body+=`<circle cx="${K.f(p.x)}" cy="${K.f(p.y)}" r="26" fill="none" stroke="${K.C[i]}" stroke-opacity=".6"/>`;
      items.push({key:`node-${l}-${i}`,kind:'node',...p,shape:K.shapes[i],color:K.C[i],selected:s.selected?.[0]===l&&s.selected?.[1]===i,label:`${['Source','Intermediate','Destination'][l]} ${K.shapes[i]}. Select or drag to a vertex in the next column to edit a connection.`});
    }));
    for(const middle of ws){const first=R.edge(nodes[0][src],nodes[1][middle],{directed:true}),second=R.edge(nodes[1][middle],nodes[2][dst],{directed:true});const p=s.progress<.5?first.point(s.progress*2):second.point((s.progress-.5)*2);if(s.progress>0&&s.progress<1)body+=R.bead(p,K.C[middle],4);}
    for(let row=0;row<3;row++)for(let col=0;col<3;col++){const witness=M.witnesses(s,col,row);items.push({key:`cell-${row}-${col}`,kind:'cell',...R.cellPoint(g,row,col),art:cellArt(witness,src===col&&dst===row),selected:src===col&&dst===row,label:`Inspect ${witness.length} two-step routes from ${K.shapes[col]} to ${K.shapes[row]}${witness.length?', through '+witness.map(k=>K.shapes[k]).join(' or '):''}. This result is computed from the connections.`});}
    items.push({key:'mode-witnesses',kind:'mode',x:v.w/2-40,y:g.toolsY,art:dotIcon,selected:!s.heat,label:'Show the intermediate shapes, one for each two-step route.'},{key:'mode-heat',kind:'mode',x:v.w/2+40,y:g.toolsY,art:heatIcon,selected:s.heat,label:'Show route counts as brightness. Empty means zero; maximum brightness means three routes.'});
    v.paint(body,items);v.examples(s.seed%M.cases.length,M.cases.length);
  }
  const view=K.create({title:'Through',description:'Three columns show source, intermediate, and destination copies of the same three shapes. Connections between adjacent columns are editable by selecting endpoints or dragging. Every intermediate shape that completes a two-step route contributes once to the result matrix. Tap a result cell to trace all its alternatives. Switch between intermediate-shape marks and brightness. The matrix is computed, so editing a result means changing the connections that produce it.',glyph:dotIcon,render,describe,progress:()=>s.progress,snapshot:()=>JSON.parse(JSON.stringify(s)),restore:v=>{s=M.restore(v);ghost=null;},scrub:set,
    play(){s.progress=0;view.tween(0,1,set,2400);},rewind(){view.tween(s.progress,0,set,550);},example(){s=M.create(s.seed+1);ghost=null;},
    activate(key){if(key.startsWith('cell-')){const [,r,c]=key.split('-').map(Number);s.focus=[c,r];s.selected=null;s.progress=0;view.tween(0,1,set,1600);}else if(key.startsWith('node-')){const [,l,i]=key.split('-').map(Number);if(s.selected)connect(s.selected,[l,i]);else s.selected=[l,i];}else if(key.startsWith('mode-'))s.heat=key==='mode-heat';},
    down(key){if(key.startsWith('node-')){const [,l,i]=key.split('-').map(Number);return{src:[l,i],original:s.selected?.slice()??null};}return null;},move(d,p){ghost={src:d.src,...p};},up(d,p){ghost=null;const target=nearest(p);if(target)connect(d.src,target);},cancel(d){ghost=null;s.selected=d.original;},escape(){s.selected=null;ghost=null;}
  });view.start();
})();
