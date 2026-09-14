const assert=require('node:assert/strict'),{boot}=require('../../tests/harness.cjs'),M=require('./model.js'),G=require('./geometry.js');let checks=0;
const check=(x,message)=>{assert(x,message);checks++;};
const a=boot('branch',{embedded:true});
check(a.nodes.objects.children.length===3,'first encounter has one bead and two reachable rings');
check(a.nodes.timeline.disabled,'the timeline is visibly unavailable until a path exists');
a.scrub(1000);check(a.snapshot().progress===0,'scrubbing cannot invent unchosen branches');
a.clickObject('choice-0');a.advance(700);check(a.snapshot().record.join('')==='0','a selected ring guides the bead and records the journey');
check(!a.nodes.timeline.disabled,'a chosen branch enables inspection');
check(a.frames.size===0,'each single step comes to rest');
a.clickObject('traveler');a.advance(900);a.clickObject('choice-1');a.advance(700);check(M.relation(a.snapshot())==='different-arrival','one-fork choices give different arrivals');
a.click('example');a.clickObject('choice-0');a.advance(700);a.clickObject('choice-1');a.advance(700);
const first=a.snapshot();check(first.route.join('')==='01'&&first.progress===1,'two deliberate steps complete the first journey');
a.clickObject('home');a.advance(900);a.clickObject('choice-1');a.advance(700);a.clickObject('choice-0');a.advance(700);
check(M.relation(a.snapshot())==='same-arrival','the swapped journey reaches the same place');
check(a.nodes.status.textContent.includes('Different journeys, the same arrival.'),'accessible description explains the observed correspondence');a.exportScene('branch-reunion');
const saved=a.snapshot();a.scrub(230);a.scrub(740);check(a.snapshot().route.join('')===saved.route.join(''),'scrubbing follows the same record');
a.click('play');a.advance(3000);check(a.frames.size===0&&a.snapshot().route.join('')===saved.route.join(''),'play completes the chosen journey without rerolling it');
a.restore(first);a.clickObject('home');a.advance(900);const start=a.snapshot(),g=G.layout(2,736,500),target=g.point(1,1);
a.drag('traveler',[G.point(g.point(0,0),target,.4),target]);check(a.snapshot().route.join('')==='1'&&a.snapshot().progress===.5,'dragging follows a branch and settles on its next junction');
const midway=a.snapshot();a.drag('traveler',[g.point(2,1)],{cancel:true});check(JSON.stringify(a.snapshot())===JSON.stringify(midway),'cancel restores the route, trail memory, and progress');
a.nodes.objects.emit('keydown',{target:a.object('traveler'),key:'ArrowLeft'});a.advance(700);check(a.snapshot().route.join('')==='10','keyboard chooses the same branches');
a.nodes.objects.emit('keydown',{target:a.object('traveler'),key:'ArrowUp'});a.advance(500);check(a.snapshot().progress===.5,'up arrow backtracks one step');
a.restore(start);const bead=a.object('traveler');a.nodes.objects.emit('pointerdown',{target:bead,pointerId:7,clientX:g.point(0,0).x,clientY:g.point(0,0).y});a.nodes.objects.emit('pointermove',{target:bead,pointerId:7,clientX:target.x,clientY:target.y});
check(JSON.stringify(a.snapshot())===JSON.stringify(start),'host pause cancels an unfinished gesture');check(a.frames.size===0,'navigation leaves no animation loop');
for(const width of [260,320,390,736]){
  const app=boot('branch',{w:width,h:370,reduced:true,embedded:true});app.exportScene(`branch-one-${width}`);app.click('example');app.click('example');
  for(let i=0;i<3;i++){app.clickObject(`choice-${i%2}`);check(app.frames.size===0,'reduced motion settles directly');for(const b of app.nodes.objects.children){const x=parseFloat(b.style.left),y=parseFloat(b.style.top),half=b.dataset.key==='traveler'?32:28;check(x>=half&&x<=width-half&&y>=half&&y<=370-half,'touch targets fit narrow stages');}}
  app.click('rewind');app.clickObject('traveler');check(app.snapshot().progress===1/3,'tapping the bead demonstrates only one step');if(width===320)app.exportScene('branch-three-narrow');
}
console.log(JSON.stringify({lesson:'branch',suite:'exported interactions',checks,passed:true,limitation:'DOM/event harness, not a browser or touch-device test'}));
