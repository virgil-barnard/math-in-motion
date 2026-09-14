const assert=require('node:assert/strict'),{boot}=require('../../tests/harness.cjs');let checks=0;
const check=(v,m)=>{assert(v,m);checks++;};
const a=boot('connections',{embedded:true});
a.clickObject('cell-2-0');a.advance(1200);let s=a.snapshot();
check(s.matrix[2][0]===1&&s.matrix[0][2]===1,'cell creates the two directions of an undirected connection');
check(a.object('cell-0-2').attrs['aria-pressed']==='true','mirrored cell updates immediately');
a.clickObject('mode-directed');a.clickObject('cell-2-0');s=a.snapshot();
check(s.directed&&s.matrix[2][0]===0&&s.matrix[0][2]===1,'directions can be edited independently');
a.clickObject('node-1');a.clickObject('node-1');a.advance(1200);s=a.snapshot();
check(s.matrix[1][1]===1,'selecting the same vertex twice creates a loop');
check(a.object('cell-1-1').attrs['aria-label'].startsWith('square to square.'),'loop has the corresponding shape headers');
const p=key=>({x:parseFloat(a.object(key).style.left),y:parseFloat(a.object(key).style.top)});
a.drag('node-0',[p('node-2')]);s=a.snapshot();check(s.matrix[2][0]===1,'dragging vertices changes their matrix entry');
const before=JSON.stringify(s.matrix);a.drag('node-0',[p('node-2')],{cancel:true});check(JSON.stringify(a.snapshot().matrix)===before,'cancel does not commit a dragged connection');
a.clickObject('node-0');a.window.emit('keydown',{key:'Escape'});check(a.snapshot().selected===null,'Escape clears an incomplete endpoint choice');
a.click('play');a.advance(1800);check(a.frames.size===0&&a.nodes.timeline.value==='1000','trace ends without an idle loop');a.scrub(380);a.exportScene('connections');
const saved=a.snapshot();a.click('example');a.restore(saved);check(JSON.stringify(a.snapshot())===JSON.stringify(saved),'host restores the edited relation');
for(const width of [260,320,390,620,736]){
  const height=width<620?650:500,app=boot('connections',{w:width,h:height,reduced:true});app.click('example');app.click('example');app.click('example');app.click('play');
  check(app.frames.size===0,'reduced motion reaches a stable trace');
  for(const b of app.nodes.objects.children){const x=parseFloat(b.style.left),y=parseFloat(b.style.top),half=b.className.includes('mode')?28:24;check(x>=half&&x<=width-half&&y>=24&&y<=height-24,'four-vertex targets fit the supported stage');}
  if(width===320){app.scrub(450);app.exportScene('connections-narrow');}
}
console.log(JSON.stringify({lesson:'connections',suite:'exported interactions',checks,passed:true,limitation:'DOM/event harness, not a browser'}));
