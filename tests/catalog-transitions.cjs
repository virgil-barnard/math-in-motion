// Executes exported host/bridge scripts. CSS layout and iframe behavior need a browser.
const assert=require('node:assert/strict'),{boot}=require('./harness.cjs');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const advance=async(app,ms)=>{app.advance(ms);await flush();};
const channel='mathematics-in-motion/v1';
const latest=app=>app.nodes['lesson-frame'].children.at(-1);
const node=(app,id)=>app.nodes['map-nodes'].children.find(b=>b.dataset.lesson===id);
const send=(app,frame,id,type,extra={},source=frame.contentWindow)=>app.window.emit('message',{source,data:{channel,lesson:id,type,...(type==='ready'?{acknowledgesRestore:true}:{}),...extra}});
async function acknowledge(app,frame,id,state={version:1}){
  send(app,frame,id,'ready');const request=frame.contentWindow.messages.at(-1).request;
  send(app,frame,id,'restored',{request,state});await flush();
}
async function arrive(app,frame,id){await acknowledge(app,frame,id);await advance(app,120);await advance(app,190);}
(async()=>{
  const a=boot('collection');await flush();node(a,'return').emit('click');await flush();const first=latest(a);
  check(!a.nodes['lesson-map'].hidden&&first.style.opacity==='0'&&first.inert,'previous surface stays visible while a sized, inert document prepares');
  check(a.nodes['lesson-frame'].className==='staging'&&!a.nodes['lesson-frame'].hidden,'incoming document is measurable, not display:none');
  check(a.nodes['lesson-marker'].attrs['data-loading']==='true','loading has a quiet static cue');
  check(!a.nodes['map-button'].disabled,'an initial deep load can be cancelled');
  send(a,first,'return','ready');const request=first.contentWindow.messages.at(-1).request;
  send(a,first,'return','restored',{request:request+1});
  send(a,first,'undo','restored',{request});
  send(a,first,'return','restored',{request},{foreign:true});await advance(a,400);
  check(!a.nodes['lesson-map'].hidden&&!first.focused&&a.nodes['lesson-map'].style.opacity==='1','wrong request, lesson, and source cannot reveal the lesson');
  send(a,first,'return','restored',{request,state:{version:1,seed:0,phase:0}});await flush();
  check(a.nodes['lesson-map'].style.opacity==='0'&&first.style.opacity==='0','outgoing fade precedes incoming fade; mathematical scenes do not overlap');
  await advance(a,120);check(a.nodes['lesson-map'].hidden&&first.style.opacity==='1'&&first.inert&&!first.focused,'arrival remains noninteractive until its fade finishes');
  await advance(a,190);check(!first.inert&&first.focused&&a.location.hash==='#return','only the fully arrived lesson receives focus');
  check(a.timers.size===0&&a.frames.size===0,'navigation leaves no idle animation or timers');
  // Page visibility and an updated motion preference settle ongoing fades.
  a.click('map-button');send(a,first,'return','paused',{request:first.contentWindow.messages.at(-1).request,state:{version:1,seed:0,phase:1}});await flush();
  a.media.matches=true;a.media.emit('change');await flush();
  check(!a.nodes['lesson-map'].hidden&&a.nodes['lesson-map'].style.opacity==='1'&&a.timers.size===0,'enabling reduced motion settles both phases immediately');
  a.media.matches=false;node(a,'return').emit('click');await flush();
  check(latest(a)===first,'returning from the map keeps the same lesson document');
  a.document.hidden=true;a.document.emit('visibilitychange');await flush();
  check(!a.nodes['lesson-frame'].hidden&&first.style.opacity==='1'&&!first.inert,'backgrounding settles presentation without waiting for animation frames');
  a.document.hidden=false;
  // Latest navigation wins while loading, fading out, and fading in.
  const b=boot('collection');await flush();node(b,'branch').emit('click');await flush();const abandoned=latest(b);
  node(b,'membership').emit('click');await flush();const replacement=latest(b);
  check(b.nodes['lesson-frame'].children.length===1&&replacement!==abandoned,'rapid selection removes the abandoned staged document');
  send(b,abandoned,'branch','ready');send(b,abandoned,'branch','restored',{request:1,state:{version:1}});await flush();
  check(b.location.hash==='','stale readiness cannot commit a cancelled navigation');
  await arrive(b,replacement,'membership');check(b.location.hash==='#membership','latest requested lesson wins');
  b.click('continue-button');await advance(b,200);const branch=latest(b);await acknowledge(b,branch,'branch');
  b.click('map-button');await advance(b,200);await advance(b,120);await advance(b,190);
  check(!b.nodes['lesson-map'].hidden&&b.nodes['lesson-frame'].children.length===1&&latest(b)===replacement,'cancelling an outgoing fade preserves the last committed document');
  node(b,'branch').emit('click');await flush();const incoming=latest(b);await acknowledge(b,incoming,'branch');await advance(b,120);
  b.click('map-button');await advance(b,200);await advance(b,120);await advance(b,190);
  check(b.location.hash==='#start'&&!b.nodes['lesson-map'].hidden&&latest(b)===incoming,'navigation during arrival commits only the newer request');
  check(b.timers.size===0,'cancelled requests leave no pending timeouts');
  // A failed document does not replace the current view or leave a blank surface.
  const c=boot('index',{hash:'#return',reduced:true});await flush();const missing=latest(c);
  await advance(c,6010);
  check(c.nodes['lesson-frame'].children.length===0&&!c.nodes['lesson-map'].hidden&&!c.nodes['retry-button'].hidden,'readiness timeout keeps a usable map and offers retry');
  check(c.location.hash==='#start'&&c.nodes['retry-button'].focused,'a failed deep link recovers its URL and keyboard destination');
  send(c,missing,'return','ready');check(missing.contentWindow.messages.length===0,'late failed-document readiness is ignored');
  c.click('retry-button');await flush();await acknowledge(c,latest(c),'return',{version:1,phase:2});
  const kept=latest(c);check(c.location.hash==='#return'&&!kept.inert&&c.nodes['retry-button'].hidden,'retry completes the same restored-before-visible handshake');
  c.location.hash='#undo';c.window.emit('popstate');await advance(c,200);const errorFrame=latest(c);errorFrame.emit('error');await flush();
  check(latest(c)===kept&&!kept.inert&&c.location.hash==='#return','load errors preserve a previous lesson and its URL');
  check(!c.nodes['retry-button'].hidden&&c.timers.size===0,'load error clears readiness timeout');
  c.location.hash='#branch';c.window.emit('popstate');c.window.emit('hashchange');await advance(c,200);
  const historyFrame=latest(c);await acknowledge(c,historyFrame,'branch');
  check(c.location.hash==='#branch'&&c.nodes['lesson-frame'].children.length===1,'paired history events cannot leave duplicate documents');
  const legacy=boot('index',{hash:'#same',reduced:true});await flush();const cached=latest(legacy);
  send(legacy,cached,'same','ready',{acknowledgesRestore:false});
  const packets=cached.contentWindow.messages;
  check(packets[0].type==='restore'&&packets[1].type==='pause','an older cached bridge restores before its correlated pause');
  send(legacy,cached,'same','state',{state:{version:1,phase:99}});await flush();
  check(cached.inert,'an uncorrelated state update is insufficient for legacy arrival');
  send(legacy,cached,'same','paused',{request:packets[1].request,state:{version:1,phase:1}});await flush();
  check(legacy.location.hash==='#same'&&!cached.inert,'older v1 lesson documents remain compatible');
  // Bridge acknowledgement uses the actual restored and paused child state.
  for(const id of ['correspondence','return','branch','fold']){
    const child=boot(id,{embedded:true});check(child.messages[0].type==='ready',`${id} announces readiness after pausing`);
    const state=child.snapshot();
    child.window.emit('message',{source:child.window.parent,data:{channel,type:'restore',request:812,state}});
    const ack=child.messages.at(-1);
    check(ack.type==='restored'&&ack.request===812&&JSON.stringify(ack.state)===JSON.stringify(state),`${id} acknowledges the exact paused snapshot`);
    check(child.frames.size===0,`${id} cannot autoplay on restoration`);
  }
  console.log(JSON.stringify({suite:'lesson transition lifecycle',checks,passed:true,limitation:'DOM/message harness; no browser compositing, layout, native focus, or device claim'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
