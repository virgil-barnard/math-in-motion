const assert=require('node:assert/strict'),{boot}=require('../../tests/harness.cjs'),M=require('./model.js');let checks=0;
const check=(v,m)=>{assert(v,m);checks++;};
const a=boot('fold',{embedded:true}),world=a.document.getElementById('fold-world');
check(world.children.length===2,'first encounter is one hinge');
a.click('example');check(world.children.length===5,'next example is an open box');a.click('example');check(world.children.length===6,'final example adds the lid');
let s=a.snapshot(),fit=M.frame(s.seed,s.yaw,s.pitch,736,500);
const targets=Array.from({length:20},(_,i)=>M.project(M.grip(s.seed,(i+1)/20),s,fit));
a.drag('fold-grip',targets);s=a.snapshot();check(s.progress>.999,'directly dragging the grip closes the cube');
check(world.children.every(el=>el.style.transform.startsWith('matrix3d(')),'every face uses a three-dimensional rigid transform');
const saved={...s};a.drag('orbit-pad',[{x:480,y:265}]);s=a.snapshot();
check(s.yaw!==saved.yaw&&s.pitch!==saved.pitch&&s.progress===saved.progress,'orbit changes the viewpoint while preserving the fold');
a.drag('orbit-pad',[{x:420,y:100}],{cancel:true});check(JSON.stringify(a.snapshot())===JSON.stringify(s),'cancel restores the camera');
a.clickObject('camera-home');s=a.snapshot();check(s.yaw===-.52&&s.pitch===.75&&s.progress===saved.progress,'camera home preserves folding');
a.scrub(420);s=a.snapshot();fit=M.frame(s.seed,s.yaw,s.pitch,736,500);
a.drag('fold-grip',[M.project(M.grip(s.seed,.9),s,fit)],{cancel:true});check(a.snapshot().progress===.42,'cancel restores fold phase');
a.nodes.objects.emit('keydown',{target:a.object('fold-grip'),key:'ArrowRight'});a.advance(300);check(Math.abs(a.snapshot().progress-.52)<1e-12,'arrow keys fold the same mechanism');
a.nodes.objects.emit('keydown',{target:a.object('orbit-pad'),key:'ArrowLeft'});s=a.snapshot();check(Math.abs(s.yaw+.72)<1e-12,'horizontal arrows orbit');
a.nodes.objects.emit('keydown',{target:a.object('orbit-pad'),key:'ArrowUp'});check(a.snapshot().pitch>.75,'vertical arrows change elevation');
a.click('play');a.advance(4000);check(a.frames.size===0&&a.nodes.timeline.value==='1000','fold animation terminates');a.click('play');a.advance(2400);check(a.frames.size===0&&a.nodes.timeline.value==='0','unfold animation terminates');
a.restore(saved);check(JSON.stringify(a.snapshot())===JSON.stringify(saved),'host restores exact fold and camera state');
for(const width of [260,320,736]){
  const app=boot('fold',{w:width,h:400,reduced:true});app.click('example');app.click('example');app.click('play');check(app.frames.size===0&&app.nodes.timeline.value==='1000','reduced motion folds without interpolation');
  for(const key of ['fold-grip','camera-home']){const b=app.object(key),x=parseFloat(b.style.left),y=parseFloat(b.style.top);check(x>=24&&x<=width-24&&y>=24&&y<=376,'fold controls fit narrow stages');}
  app.click('example');check(app.document.getElementById('fold-world').children.length===2,'changing cases removes old planes');
}
console.log(JSON.stringify({lesson:'fold',suite:'exported interactions',checks,passed:true,limitation:'DOM/event harness checks transforms and input; browser compositing and touch remain unverified'}));
