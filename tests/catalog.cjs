const assert=require('node:assert/strict'),vm=require('node:vm'),{boot}=require('./harness.cjs');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const flush=async()=>{for(let i=0;i<6;i++)await Promise.resolve();};
(async()=>{
  const a=boot('collection');await flush();
  const visible=Math.min(9,vm.runInContext('MotionCatalog.length',a.context));
  check(a.nodes['map-nodes'].children.length===visible,'ready lessons appear without a host ID registry');a.exportScene('constellation');
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
  const bad=boot('index',{hash:'#%'});await flush();check(bad.nodes['map-nodes'].children.length===visible,'malformed fragments recover to the map');
  const M=require('../src/catalog/model.js');
  const current=JSON.parse(vm.runInContext('JSON.stringify(MotionCatalog)',a.context));
  for(const width of [264,300,360,736]){
    const g=M.layout(current,0,width);
    for(let i=0;i<g.nodes.length;i++)for(let j=i+1;j<g.nodes.length;j++)check(Math.hypot(g.nodes[i].x-g.nodes[j].x,g.nodes[i].y-g.nodes[j].y)>=82,'lesson targets remain separate when branches share a narrow row');
  }
  const large=Array.from({length:24},(_,i)=>({id:`lesson-${i}`,order:i,builds_on:i?[`lesson-${i-1}`]:[],related:[]}));
  const ids=new Set();for(let p=0;p<3;p++){const g=M.layout(large,p,280);g.nodes.forEach(n=>{ids.add(n.id);check(n.x>=40&&n.x<=240,'paged node fits narrow width');});check(g.pages===3,'large catalog has finite pages');}
  check(ids.size===24,'every lesson remains reachable in a larger catalog');
  console.log(JSON.stringify({suite:'catalog navigation and portable-document protocol',checks,passed:true,limitation:'DOM/message harness, not browser iframe integration'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
