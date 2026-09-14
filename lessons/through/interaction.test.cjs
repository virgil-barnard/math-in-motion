const assert=require('node:assert/strict'),{boot}=require('../../tests/harness.cjs'),M=require('./model.js');let checks=0;
const check=(v,m)=>{assert(v,m);checks++;};
const a=boot('through',{embedded:true});
check(a.object('cell-2-0').attrs['aria-label'].includes('2 two-step routes'),'initial result has both witnesses');
a.clickObject('cell-2-0');a.scrub(330);a.exportScene('through');
a.clickObject('node-0-0');a.clickObject('node-1-1');check(M.witnesses(a.snapshot(),0,2).length===1,'removing the first half removes that complete route');
check(a.object('cell-2-0').attrs['aria-label'].includes('1 two-step routes'),'result view recomputes');
const before=a.snapshot();a.clickObject('mode-heat');const heat=a.snapshot();
check(heat.heat&&JSON.stringify(heat.a)===JSON.stringify(before.a)&&JSON.stringify(heat.b)===JSON.stringify(before.b),'brightness changes the representation, preserving relations');
check(!a.object('cell-2-0').innerHTML.includes('<circle'),'heat mode replaces witness shapes');
a.clickObject('mode-witnesses');check(a.object('cell-2-0').innerHTML.includes('<circle'),'identity marks can be restored');
const p=key=>({x:parseFloat(a.object(key).style.left),y:parseFloat(a.object(key).style.top)});
a.drag('node-0-0',[p('node-1-1')]);check(M.witnesses(a.snapshot(),0,2).length===2,'drag edits a relation');
const saved=a.snapshot();a.drag('node-1-0',[p('node-2-2')],{cancel:true});check(JSON.stringify(a.snapshot())===JSON.stringify(saved),'cancel restores the same graph and inspection state');
a.clickObject('node-0-2');a.clickObject('node-2-0');check(a.snapshot().focus.join(',')==='2,0','source to final destination selects the composite, without creating a shortcut');
a.clickObject('node-0-0');a.window.emit('keydown',{key:'Escape'});check(a.snapshot().selected===null,'Escape clears a partial connection');
a.click('example');check(JSON.stringify(M.product(a.snapshot()))==='[[1,0,0],[0,1,0],[0,0,1]]','inverse example produces the identity matrix');
a.click('play');a.advance(2500);check(a.frames.size===0,'all parallel traces end');
a.restore(saved);check(JSON.stringify(a.snapshot())===JSON.stringify(saved),'host restores relations and focus');
for(const width of [260,320,390,620,736]){
  const height=width<620?650:500,app=boot('through',{w:width,h:height,reduced:true});app.click('play');check(app.frames.size===0,'reduced motion leaves a stable result');
  for(const b of app.nodes.objects.children){const x=parseFloat(b.style.left),y=parseFloat(b.style.top),half=b.className.includes('mode')?28:24;check(x>=half&&x<=width-half&&y>=24&&y<=height-24,'graph and result controls fit supported stages');}
  if(width===320){app.scrub(680);app.exportScene('through-narrow');}
}
console.log(JSON.stringify({lesson:'through',suite:'exported interactions',checks,passed:true,limitation:'DOM/event harness, not a browser'}));
