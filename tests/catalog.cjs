const assert=require('node:assert/strict'),vm=require('node:vm'),{boot}=require('./harness.cjs');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const channel='mathematics-in-motion/v1';
const deliver=(app,frame,id,type,extra={})=>app.window.emit('message',{source:frame.contentWindow,data:{channel,lesson:id,type,...(type==='ready'?{acknowledgesRestore:true}:{}),...extra}});
const node=(app,id)=>app.nodes['map-nodes'].children.find(b=>b.dataset.lesson===id);
const latest=app=>app.nodes['lesson-frame'].children.at(-1);
async function restored(app,id,frame=latest(app),state={version:1}){
  deliver(app,frame,id,'ready');const request=frame.contentWindow.messages.at(-1).request;
  deliver(app,frame,id,'restored',{request,state});await flush();return frame;
}
(async()=>{
  // Reduced motion keeps general navigation checks independent of fade timing.
  const a=boot('collection',{hash:'#map',reduced:true});await flush();
  const visible=Math.min(9,vm.runInContext('MotionCatalog.length',a.context));
  check(a.nodes['map-nodes'].children.length===visible,'ready lessons appear without a host ID registry');
  node(a,'return').emit('click');await flush();
  let frame=latest(a);check(frame.srcdoc.includes('const ReturnModel'),'one-file edition embeds the chosen independent document');
  deliver(a,frame,'return','ready');check(frame.contentWindow.messages.at(-1).type==='restore','child readiness receives a restore packet');
  check(frame.inert&&frame.style.opacity==='0','readiness alone never reveals the reset state');
  const request=frame.contentWindow.messages.at(-1).request;
  deliver(a,frame,'return','restored',{request,state:{version:1,seed:2,phase:3}});await flush();
  check(!frame.inert&&frame.focused,'restored lesson becomes available without a reduced-motion delay');
  a.click('map-button');const pause=frame.contentWindow.messages.at(-1).request;
  deliver(a,frame,'return','paused',{request:pause,state:{version:1,seed:2,phase:3}});await flush();
  check(!a.nodes['lesson-map'].hidden,'map opens after pausing the lesson');
  a.window.scrollY=170;node(a,'undo').emit('click');await flush();
  const old=frame;frame=latest(a);
  check(frame!==old&&a.nodes['lesson-frame'].children.length===2&&frame.inert&&old.inert,'only the paused outgoing and inert incoming documents coexist');
  await restored(a,'undo');check(a.nodes['lesson-frame'].children.length===1,'outgoing document is removed after restoration');
  check(a.window.scrollY===0,'arriving from a scrolled map starts at the top of the lesson');
  a.click('map-button');a.advance(200);await flush();
  check(a.window.scrollY===170&&node(a,'undo').focused,'returning restores the map position and chosen node');
  node(a,'return').emit('click');await flush();frame=latest(a);deliver(a,frame,'return','ready');
  check(frame.contentWindow.messages.at(-1).state.phase===3,'revisiting restores the captured state');
  a.window.emit('message',{source:old.contentWindow,data:{channel,lesson:'return',type:'state',state:{phase:99}}});
  await restored(a,'return',frame,{version:1,seed:2,phase:3});
  a.click('map-button');a.advance(200);await flush();node(a,'undo').emit('click');await flush();await restored(a,'undo');
  a.click('map-button');a.advance(200);await flush();node(a,'return').emit('click');await flush();frame=latest(a);deliver(a,frame,'return','ready');
  check(frame.contentWindow.messages.at(-1).state.phase===3,'detached-window messages cannot overwrite saved state');
  const pages=boot('index',{hash:'#same',reduced:true});await flush();check(latest(pages).src==='same.html','Pages edition uses adjacent standalone files');await restored(pages,'same');
  const M=require('../src/catalog/model.js');
  const current=JSON.parse(vm.runInContext('JSON.stringify(MotionCatalog)',a.context));
  const opening=M.opening(current),start=boot('collection',{reduced:true});await flush();
  check(start.nodes['map-nodes'].children.map(b=>b.dataset.lesson).join(',')===opening.map(x=>x.id).join(','),'landing shows the manifest-selected opening path');
  check(opening.length<current.length,'opening offers fewer simultaneous choices');start.exportScene('opening-path');
  check(!start.nodes['map-links'].innerHTML.includes('stroke-dasharray'),'opening omits conceptual cross-links');
  start.click('scope-button');await flush();check(start.nodes['map-nodes'].children.length===visible&&start.location.hash==='#map','all lessons remain available through the constellation control');
  const all=new Set(start.nodes['map-nodes'].children.map(b=>b.dataset.lesson));while(!start.nodes['map-next'].disabled){start.click('map-next');await flush();start.nodes['map-nodes'].children.forEach(b=>all.add(b.dataset.lesson));}check(all.size===current.length,'every real lesson is reachable, including the second page');
  const lastPage=start.nodes['map-nodes'].children.map(b=>b.dataset.lesson).join(',');start.window.scrollY=83;
  start.click('scope-button');await flush();check(start.location.hash==='#start'&&start.nodes['map-nodes'].children.length===opening.length,'the opening path can be revisited');
  start.click('scope-button');await flush();check(start.nodes['map-nodes'].children.map(b=>b.dataset.lesson).join(',')===lastPage&&start.window.scrollY===83,'each map scope remembers its own page and position');
  const last=boot('collection',{hash:'#'+opening.at(-1).id,reduced:true});await flush();await restored(last,opening.at(-1).id);last.click('continue-button');last.advance(200);await flush();check(last.location.hash==='#map'&&!last.nodes['lesson-map'].hidden,'the opening ends at an invitation to explore, not an automatic advanced lesson');
  for(let i=0;i<opening.length-1;i++)check(M.next(current,opening[i].id).id===opening[i+1].id,'suggested continuation follows the authored opening sequence');
  check(M.next(current,opening.at(-1).id)===null,'no advanced successor is forced after the opening');
  const bad=boot('index',{hash:'#%',reduced:true});await flush();check(bad.nodes['map-nodes'].children.length===opening.length,'malformed fragments recover to the gentle opening');
  for(const width of [264,300,360,736]){
    const g=M.layout(current,0,width);
    for(let i=0;i<g.nodes.length;i++)for(let j=i+1;j<g.nodes.length;j++)check(Math.hypot(g.nodes[i].x-g.nodes[j].x,g.nodes[i].y-g.nodes[j].y)>=82,'lesson targets remain separate when branches share a narrow row');
    const path=M.openingLayout(current,width);for(const n of path.nodes)check(n.x>=41&&n.x<=width-41,'opening targets fit narrow layouts');
  }
  const large=Array.from({length:24},(_,i)=>({id:`lesson-${i}`,order:i,builds_on:i?[`lesson-${i-1}`]:[],related:[]}));
  const ids=new Set();for(let p=0;p<3;p++){const g=M.layout(large,p,280);g.nodes.forEach(n=>{ids.add(n.id);check(n.x>=40&&n.x<=240,'paged node fits narrow width');});check(g.pages===3,'large catalog has finite pages');}
  check(ids.size===24,'every lesson remains reachable in a larger catalog');
  console.log(JSON.stringify({suite:'catalog navigation and portable-document protocol',checks,passed:true,limitation:'DOM/message harness, not browser iframe integration'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
