(() => {
  const M=FoldModel,K=MotionKit;let s=M.create(),fit=null,fitKey='',showArc=false;
  const world=document.getElementById('fold-world'),planes=new Map();
  const cubeIcon=K.svg('<path d="m24 5 17 10v20L24 45 7 35V15ZM7 15l17 10 17-10M24 25v20" fill="none" stroke="#83d6d1" stroke-width="1.3"/>');
  const cameraIcon=K.svg('<ellipse cx="24" cy="24" rx="19" ry="9" fill="none" stroke="#83d6d1"/><ellipse cx="24" cy="24" rx="9" ry="19" fill="none" stroke="#648896"/><circle cx="24" cy="24" r="3" fill="#eedbb6"/>');
  const gripArt=K.svg('<circle cx="24" cy="24" r="11" fill="#102735" stroke="#83d6d1" stroke-width="1.2"/><circle cx="24" cy="24" r="3.5" fill="#eedbb6"/>');
  const set=p=>{s.progress=p;};
  function describe(){const which=s.seed%3,count=[2,5,6][which],phase=s.progress===0?'flat':s.progress===1?['a right-angle hinge','an open box','a closed cube'][which]:'partly folded';return `${count} persistent square faces, ${phase}. Each face stays rigid while the shared edges act as hinges. Drag the glowing handle to fold, drag the object to turn the view, or use the time control. Focus the view and use arrow keys to orbit; focus the handle and use arrow keys to fold.`;}
  function material(face){const [a,b,,d]=face.vertices,n=M.cross(M.sub(b,a),M.sub(d,a)),light=[.36,-.48,.8],shade=.35+.27*Math.abs(M.dot(n,light)),base=K.C[face.id%3];const rgb=[1,3,5].map(i=>parseInt(base.slice(i,i+2),16));return rgb.map(x=>Math.round(12+x*shade));}
  function render(v){
    const key=[s.seed%3,s.yaw,s.pitch,v.w,v.h].join(',');if(key!==fitKey){fit=M.frame(s.seed,s.yaw,s.pitch,v.w,v.h);fitKey=key;}
    const faces=M.pose(s.seed,s.progress),seen=new Set();
    for(const face of faces){
      seen.add(face.id);let el=planes.get(face.id);if(!el){el=document.createElement('div');el.className='fold-face';el.dataset.face=String(face.id);el.setAttribute('aria-hidden','true');el.innerHTML=K.svg(K.shape(K.shapes[face.id%3],24,24,10,K.C[face.id%3],face.id<3));world.appendChild(el);planes.set(face.id,el);}
      const rgb=material(face),darker=rgb.map(x=>Math.round(x*.8));el.style.width=`${fit.scale}px`;el.style.height=`${fit.scale}px`;el.style.transform=`matrix3d(${M.cssMatrix(face,s,fit).join(',')})`;el.style.background=`linear-gradient(145deg,rgb(${rgb.join(',')}),rgb(${darker.join(',')}))`;el.style.borderColor=K.C[face.id%3]+'99';
    }
    for(const [id,el] of planes)if(!seen.has(id)){el.remove();planes.delete(id);}
    let body='';if(showArc){const pts=Array.from({length:65},(_,i)=>M.project(M.grip(s.seed,i/64),s,fit));body+=`<path d="${pts.map((p,i)=>`${i?'L':'M'}${K.f(p.x)} ${K.f(p.y)}`).join(' ')}" fill="none" stroke="#83d6d1" stroke-opacity=".28" stroke-dasharray="2 6"/>`;}
    const p=M.project(M.grip(s.seed,s.progress),s,fit);
    const items=[{key:'orbit-pad',kind:'orbit-pad',x:v.w/2,y:v.h*.43,art:'',label:'Rotate the view. Drag horizontally or vertically, or use arrow keys. This changes the viewpoint, not the fold.'},{key:'fold-grip',kind:'fold-grip',x:p.x,y:p.y,art:gripArt,label:'Fold the hinged faces. Drag this handle along its motion, tap for the next fold position, or use arrow keys.'},{key:'camera-home',kind:'camera',x:v.w/2,y:v.h*.93,art:cameraIcon,label:'Restore the original viewing angle while keeping the fold.'}];
    v.paint(body,items);v.examples(s.seed%3,3);
  }
  const view=K.create({title:'Fold',description:'Begin with two faces sharing a hinge. Later examples add the four sides of an open box and the final lid of a cube. Grab the glowing handle to fold the faces, or drag across the object to inspect it from another direction. Every square keeps its side lengths and identity. The last lid closes only after the sides stand upright.',glyph:cubeIcon,render,describe,progress:()=>s.progress,snapshot:()=>({...s}),restore:v=>{s=M.restore(v);fitKey='';},scrub:set,
    play(){if(s.progress>=1)view.tween(1,0,set,2300);else view.tween(s.progress,1,set,3600*(1-s.progress),()=>view.tone(3));},rewind(){view.tween(s.progress,0,set,1300);},example(){s=M.create(s.seed+1);fitKey='';showArc=false;},
    down(key){if(key==='fold-grip'){showArc=true;return{fold:s.progress};}if(key==='orbit-pad')return{yaw:s.yaw,pitch:s.pitch};return null;},
    move(d,p){if(d.key==='fold-grip')s.progress=M.nearestPhase(s.seed,s,fit,p);else if(d.key==='orbit-pad'){s.yaw=d.yaw+(p.x-d.start.x)*.008;s.pitch=M.clamp(d.pitch+(p.y-d.start.y)*.008,.15,1.4);}},
    up(){showArc=false;view.tone(1);},cancel(d){showArc=false;if(d.key==='fold-grip')s.progress=d.fold;else{s.yaw=d.yaw;s.pitch=d.pitch;}},
    activate(key){if(key==='fold-grip'){const p=s.progress>=.999?0:Math.min(1,(Math.floor(s.progress*4+1e-7)+1)/4);view.tween(s.progress,p,set,600);showArc=false;}else if(key==='camera-home'){s.yaw=-.52;s.pitch=.75;}},
    nudge(key,dir,keyName){if(key==='fold-grip')view.tween(s.progress,M.clamp(s.progress+dir*.1),set,280);else if(key==='orbit-pad'){if(keyName==='ArrowUp'||keyName==='ArrowDown')s.pitch=M.clamp(s.pitch+dir*.15,.15,1.4);else s.yaw+=dir*.2;}},escape(){showArc=false;}
  });view.start();
})();
