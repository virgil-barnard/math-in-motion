const assert=require('node:assert/strict'),{boot}=require('./harness.cjs');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const a=boot('return',{embedded:true});
check(a.messages[0].type==='ready','bridge announces ready');
a.click('example');a.click('example'); // 2- and 3-cycles.
const w=736,h=500,cy=h*.41,r=Math.min(w*.147,h*.25,88),cx=w*.25;
const arc=(center,r,start,angle,segments=12)=>Array.from({length:segments},(_,i)=>({x:center.x+r*Math.cos(start+angle*(i+1)/segments),y:center.y+r*Math.sin(start+angle*(i+1)/segments)}));
const initialRight=parseFloat(a.object('rotor-1-0').style.left);
a.drag('rotor-0-0',arc({x:cx,y:cy},r,-Math.PI/2,Math.PI));
check(Math.abs(parseFloat(a.object('rotor-0-0').style.top)-(cy+r))<1e-6,'drag moves the selected shape by a 2-cycle step');
check(Math.abs(parseFloat(a.object('rotor-1-0').style.left)-initialRight)>20,'dragging one wheel moves the other');
const before=a.object('rotor-0-0').style.top;
a.drag('rotor-0-0',arc({x:cx,y:cy},r,Math.PI/2,-Math.PI/2),{cancel:true});
check(a.object('rotor-0-0').style.top===before,'cancel restores the pre-gesture phase');
a.nodes.objects.emit('keydown',{target:a.object('rotor-0-0'),key:'ArrowLeft'});a.advance(500);
check(Math.abs(parseFloat(a.object('rotor-0-0').style.top)-(cy-r))<1e-6,'keyboard reverses the same operation');
a.drag('rotor-0-0',arc({x:cx,y:cy},r,-Math.PI/2,-Math.PI));
check(a.nodes.timeline.attrs['aria-valuetext'].startsWith('-1 signed'),'turning backwards from the start is supported');
a.scrub(500);a.advance(500);a.exportScene('return');
a.click('play');a.advance(20000);check(a.nodes.timeline.value==='1000','bounded demonstration reaches the shared return');check(a.frames.size===0,'no idle animation loop remains');
// Messages from unrelated windows cannot restore or pause a lesson.
const old=a.nodes.timeline.value;
a.window.emit('message',{source:{},data:{channel:'mathematics-in-motion/v1',type:'restore',state:{version:1,seed:2,phase:0}}});
check(a.nodes.timeline.value===old,'unrelated-window restore ignored');
a.window.emit('message',{source:a.window.parent,data:{channel:'mathematics-in-motion/v1',type:'restore',state:{version:1,seed:2,phase:2}}});
check(a.nodes.timeline.attrs['aria-valuetext'].startsWith('2 signed'),'known host restores mathematical state');
a.click('play');a.advance(130);a.window.emit('message',{source:a.window.parent,data:{channel:'mathematics-in-motion/v1',type:'pause',request:19}});
check(a.messages.at(-1).type==='paused'&&a.messages.at(-1).request===19,'pause captures an acknowledged snapshot');check(a.frames.size===0,'navigation pauses all motion');
a.window.emit('message',{source:a.window.parent,data:{channel:'mathematics-in-motion/v1',type:'restore',state:{version:1,seed:2,phase:0}}});
a.drag('rotor-1-1',arc({x:w*.75,y:cy},r,-Math.PI/2+2*Math.PI/3,2*Math.PI/3));
check(Math.abs(parseFloat(a.object('rotor-0-0').style.top)-(cy+r))<1e-6,'a non-leading shape on the other cycle drives the same common step');
const captured=a.object('rotor-0-0'),held=a.nodes.timeline.value;
a.nodes.objects.emit('pointerdown',{target:captured,pointerId:7,clientX:cx,clientY:cy+r});
a.nodes.objects.emit('pointerdown',{target:a.object('rotor-1-0'),pointerId:8,clientX:w*.75,clientY:cy-r});
a.nodes.objects.emit('pointermove',{target:a.object('rotor-1-0'),pointerId:8,clientX:w*.75+r,clientY:cy});
check(a.nodes.timeline.value===held,'a second pointer cannot take over an active turn');
a.nodes.objects.emit('pointercancel',{target:captured,pointerId:7});
for(const id of ['undo','same']){
  const app=boot(id);app.clickObject('choice-1');app.advance(450);app.scrub(1000);
  check(/undoes|agree on every/.test(app.nodes.status.textContent),`${id} reports complete-domain success`);
  app.exportScene(id);app.clickObject('choice-0');app.advance(500);app.scrub(1000);
  check(/not all|disagree/.test(app.nodes.status.textContent),`${id} exposes a counterexample`);
  app.click('play');app.advance(5000);check(app.frames.size===0,`${id} replay terminates`);
}
const u=boot('undo');u.drag('choice-1',[{x:368,y:280}]);u.scrub(1000);check(u.nodes.status.textContent.includes('undoes'),'dragging an operation into the lower gate chooses it');
for(const id of ['return','undo','same'])for(const width of [280,320,390,736]){
  const app=boot(id,{w:width,h:400,reduced:true});
  if(id==='return'){app.click('example');app.click('example');app.click('example');app.click('example');}
  app.click('play');check(app.frames.size===0,'reduced motion leaves no frames');
  for(const b of app.nodes.objects.children){const x=parseFloat(b.style.left),y=parseFloat(b.style.top),half=b.className.includes('choice')?32:24;check(x>=half&&x<=width-half&&y>=24&&y<=376,'interactive targets fit supported narrow stages');}
}
console.log(JSON.stringify({suite:'exported lesson interactions',checks,passed:true,limitation:'DOM/event harness, not a browser'}));
