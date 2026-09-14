const assert=require('node:assert/strict'),vm=require('node:vm'),{boot}=require('./harness.cjs');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const flush=async()=>{for(let i=0;i<6;i++)await Promise.resolve();};
(async()=>{
  const a=boot('collection',{hash:'#map'});await flush();
  const visible=Math.min(9,vm.runInContext('MotionCatalog.length',a.context));
  check(a.nodes['map-nodes'].children.length===visible,'ready lessons appear without a host ID registry');a.exportScene('constellation-v04');
  const node=id=>a.nodes['map-nodes'].children.find(b=>b.dataset.lesson===id);
  node('return').emit('click');await flush();
  let frame=a.nodes['lesson-frame'].children[0];check(frame.srcdoc.includes('const ReturnModel'),'one-file edition embeds the chosen independent document');
  const channel='mathematics-in-motion/v1';
  const deliver=(type,extra={})=>a.window.emit('message',{source:frame.contentWindow,data:{channel,lesson:'return',type,...extra}});
  deliver('ready');check(frame.contentWindow.messages.at(-1).type==='restore','child readiness receives a restore packet');
  a.click('map-button');const request=frame.contentWindow.messages.at(-1).request;
  deliver('paused',{request,state:{version:1,seed:2,phase:3}});await flush();
  check(!a.nodes['lesson-map'].hidden,'map opens after pausing the lesson');
  node('undo').emit('click');a.advance(200);await flush();
  const old=frame;frame=a.nodes['lesson-frame'].children[0];check(frame!==old&&a.nodes['lesson-frame'].children.length===1,'switching mounts exactly one document');
  a.click('map-button');a.advance(200);await flush();node('return').emit('click');a.advance(200);await flush();frame=a.nodes['lesson-frame'].children[0];deliver('ready');
  check(frame.contentWindow.messages.at(-1).state.phase===3,'revisiting restores the captured state');
  // Stale document traffic must not overwrite the active lesson.
  a.window.emit('message',{source:old.contentWindow,data:{channel,lesson:'return',type:'state',state:{phase:99}}});deliver('ready');check(frame.contentWindow.messages.at(-1).state.phase===3,'stale iframe messages ignored');
  const pages=boot('index',{hash:'#same'});await flush();check(pages.nodes['lesson-frame'].children[0].src==='same.html','Pages edition uses adjacent standalone files');
  const M=require('../src/catalog/model.js');
  const current=JSON.parse(vm.runInContext('JSON.stringify(MotionCatalog)',a.context));
  const opening=M.opening(current),start=boot('collection');await flush();
  check(start.nodes['map-nodes'].children.map(b=>b.dataset.lesson).join(',')===opening.map(x=>x.id).join(','),'landing shows the manifest-selected opening path');
  check(opening.length<current.length,'opening offers fewer simultaneous choices');start.exportScene('opening-path');
  check(!start.nodes['map-links'].innerHTML.includes('stroke-dasharray'),'opening omits conceptual cross-links');
  start.click('scope-button');await flush();check(start.nodes['map-nodes'].children.length===visible&&start.location.hash==='#map','all lessons remain available through the constellation control');
  const all=new Set(start.nodes['map-nodes'].children.map(b=>b.dataset.lesson));while(!start.nodes['map-next'].disabled){start.click('map-next');start.nodes['map-nodes'].children.forEach(b=>all.add(b.dataset.lesson));}check(all.size===current.length,'every real lesson is reachable, including the second page');
  start.click('scope-button');await flush();check(start.location.hash==='#start'&&start.nodes['map-nodes'].children.length===opening.length,'the opening path can be revisited');
  const last=boot('collection',{hash:'#'+opening.at(-1).id});await flush();last.click('continue-button');last.advance(200);await flush();check(last.location.hash==='#map'&&!last.nodes['lesson-map'].hidden,'the opening ends at an invitation to explore, not an automatic advanced lesson');
  for(let i=0;i<opening.length-1;i++)check(M.next(current,opening[i].id).id===opening[i+1].id,'suggested continuation follows the authored opening sequence');
  check(M.next(current,opening.at(-1).id)===null,'no advanced successor is forced after the opening');
  const bad=boot('index',{hash:'#%'});await flush();check(bad.nodes['map-nodes'].children.length===opening.length,'malformed fragments recover to the gentle opening');
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
