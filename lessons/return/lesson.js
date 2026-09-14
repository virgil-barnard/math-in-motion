(() => {
  const M=ReturnModel,K=MotionKit,{C,shape,svg,f}=K,tau=2*Math.PI;
  let s=M.create(),wheels=[];
  const glyph=svg('<circle cx="16" cy="24" r="12" fill="none" stroke="#83d6d1"/><circle cx="34" cy="24" r="8" fill="none" stroke="#b7a4e8"/><circle cx="16" cy="12" r="3" fill="#eedbb6"/><circle cx="34" cy="32" r="3" fill="#eedbb6"/>');
  function describe(){const ns=M.counts(s),step=Math.round(s.phase);return Math.abs(s.phase-step)>1e-7?'Between complete moves. The motion shows a transition between permutations.':`${step} signed moves. ${ns.map((n,i)=>`Cycle ${i+1} ${M.atHome(step,n)?'is home':'has not returned'}`).join('. ')}. First shared return after ${M.period(ns)} forward moves.`;}
  function setPhase(p){s.phase=p;}
  function settle(){const to=Math.round(s.phase);view.tween(s.phase,to,setPhase,180,()=>view.tone(M.atHome(to,M.period(M.counts(s)))?3:0));}
  function advance(dir){const start=s.phase,target=dir>0?Math.floor(start+1e-7)+1:Math.ceil(start-1e-7)-1;view.tween(start,target,setPhase,420,()=>view.tone(M.atHome(target,M.period(M.counts(s)))?3:0));}
  function render(v){
    const ns=M.counts(s),count=ns.length,w=v.w,h=v.h;
    const cy=h*.41,r=count===1?Math.min(w*.28,h*.27,110):Math.min(w*.147,h*.25,88);
    wheels=ns.map((n,i)=>({n,cx:count===1?w/2:w*(i?.75:.25),cy,r}));
    let body='',items=[];
    const base=cy+r+38;
    if(count===2)body+=`<path d="M${f(wheels[0].cx)} ${f(cy)}V${f(base)}H${f(wheels[1].cx)}V${f(cy)}" fill="none" stroke="#648896" stroke-opacity=".35"/>`;
    wheels.forEach((wheel,i)=>{
      const {n,cx}=wheel,home=M.atHome(s.phase,n);
      body+=`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r+18)}" fill="#83d6d1" fill-opacity=".025"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="#648896" stroke-opacity=".5"/>`;
      if(home)body+=`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r+21)}" fill="none" stroke="#83d6d1" stroke-opacity=".6"/>`;
      for(let j=0;j<n;j++){
        const angle=-Math.PI/2+j*tau/n,hx=cx+r*Math.cos(angle),hy=cy+r*Math.sin(angle);
        const a=angle+s.phase*tau/n,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);
        body+=`<path d="M${f(cx)} ${f(cy)}L${f(x)} ${f(y)}" fill="none" stroke="#648896" stroke-opacity=".35"/>`;
        body+=shape(K.shapes[j],hx,hy,16,C[j],false,.42);
        items.push({key:`rotor-${i}-${j}`,x,y,shape:K.shapes[j],color:C[j],label:`${K.shapes[j]} on the ${n}-place cycle. Drag around its ring, or use arrow keys to turn both mechanisms.`});
      }
      body+=`<circle cx="${f(cx)}" cy="${f(cy)}" r="5" fill="#0a1420" stroke="#648896"/>`;
      if(home)body+=`<circle cx="${f(cx)}" cy="${f(cy)}" r="2.3" fill="#83d6d1"/>`;
    });
    const n=M.period(ns),p=M.progress(s),tickGap=Math.min(25,(w-90)/n),y=Math.min(h-52,base+48);
    if(count===2)body+=`<circle cx="${f(w/2)}" cy="${f(base)}" r="7" fill="#0a1420" stroke="${M.atHome(s.phase,n)?C[1]:'#648896'}"/>${M.atHome(s.phase,n)?`<circle cx="${f(w/2)}" cy="${f(base)}" r="3" fill="#83d6d1"/>`:''}`;
    for(let k=0;k<=n;k++)body+=`<circle cx="${f(w/2+(k-n/2)*tickGap)}" cy="${f(y)}" r="${k===0||k===n?3.3:2.2}" fill="#648896" opacity="${k<=p*n?.8:.35}"/>`;
    body+=`<circle cx="${f(w/2+(p*n-n/2)*tickGap)}" cy="${f(y)}" r="6" fill="none" stroke="#eedbb6"/>`;
    v.paint(body,items);v.examples(s.seed%M.cases.length,M.cases.length);
  }
  const view=K.create({title:'Return',description:'Turn a shape around its ring. Every shape follows the same repeated routing operation. Drag either ring to drive the shared mechanism; release to settle at a complete move. The faint outlines remember each starting place. Another example introduces a new cycle, then two cycles together. Reversing your hand reverses the operation.',glyph,render,describe,progress:()=>M.progress(s),snapshot:()=>({...s}),restore:value=>{s=M.restore(value);},
    scrub:p=>{s.phase=p*M.period(M.counts(s));},settle,step:advance,
    play(){const n=M.period(M.counts(s));s.phase=M.progress(s)*n;if(s.phase>=n-1e-7)s.phase=0;const start=Math.floor(s.phase)+.13+(s.phase%1)*.74;view.tween(start,n,raw=>{const step=Math.floor(raw);s.phase=step+K.clamp((raw-step-.13)/.74);},Math.max(700,(n-s.phase)*1000),()=>view.tone(3));},
    rewind(){view.tween(s.phase,0,setPhase,650);},example(){s=M.create(s.seed+1);},
    down(key,p){if(!key.startsWith('rotor-'))return null;const i=Number(key.split('-')[1]),g=wheels[i];return{original:s.phase,wheel:g,lastAngle:Math.atan2(p.y-g.cy,p.x-g.cx)};},
    move(d,p){const g=d.wheel;if(Math.hypot(p.x-g.cx,p.y-g.cy)<g.r*.3){d.lastAngle=null;return;}const a=Math.atan2(p.y-g.cy,p.x-g.cx);if(d.lastAngle!==null)s.phase+=M.angularDelta(d.lastAngle,a)*g.n/tau;d.lastAngle=a;},
    up(){settle();},cancel(d){s.phase=d.original;},activate(key){if(key.startsWith('rotor-'))advance(1);},nudge(key,dir){if(key.startsWith('rotor-'))advance(dir);}
  });view.start();
})();
