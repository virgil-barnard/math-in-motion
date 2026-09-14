const assert=require('node:assert/strict'),{boot}=require('../../tests/harness.cjs'),M=require('./model.js'),G=require('./geometry.js');let checks=0;
const check=(v,msg)=>{assert(v,msg);checks++;};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),close=(a,b)=>Math.abs(a-b)<1e-7;
const pose=app=>M.current(app.snapshot());
const center=(app,key)=>({x:parseFloat(app.object(key).style.left),y:parseFloat(app.object(key).style.top)});
const key=(app,key,name)=>app.nodes.objects.emit('keydown',{target:app.object(key),key:name});
const begin=(app,key,pointerId=1)=>{const b=app.object(key),p=center(app,key);app.nodes.objects.emit('pointerdown',{target:b,pointerId,clientX:p.x,clientY:p.y});return b;};
const move=(app,b,x,y,pointerId=1)=>app.nodes.objects.emit('pointermove',{target:b,pointerId,clientX:x,clientY:y});
const app=boot('bundle',{embedded:true}),initial=app.snapshot();
check(initial.record[0].groups.length===1&&initial.record[0].points.length===2,'first encounter contains only one pair');
check(app.nodes.objects.children.filter(b=>b.dataset.key.startsWith('token-')).length===2,'one native control per identity');
check(app.nodes.timeline.disabled&&app.nodes.rewind.disabled&&app.frames.size===0,'first scene is still, with no unexplained history to scrub');
app.exportScene('bundle-pair-736');
const a0=center(app,'token-0'),a1=center(app,'token-1'),identity=app.object('token-0'),unit=center(app,'unit-0-1');
app.drag('unit-0-1',[{x:unit.x+30,y:unit.y-30},{x:unit.x+60,y:unit.y-45}]);
const moved=pose(app),b0=center(app,'token-0'),b1=center(app,'token-1');
check(close(b0.x-a0.x,60)&&close(b0.y-a0.y,-45),'boundary drag follows the hand');
check(close(b1.x-a1.x,b0.x-a0.x)&&close(b1.y-a1.y,b0.y-a0.y),'every member travels by the same displacement');
check(equal(moved.groups,[[0,1]])&&app.object('token-0')===identity,'moving a unit retains membership and native object identity');
check(!app.nodes.timeline.disabled,'completed movement earns an inspectable record');
app.exportScene('bundle-moved-736');
app.scrub(0);check(equal(pose(app),M.current(initial)),'rewind reconstructs the exact recorded input');
app.scrub(500);const middle=pose(app);check(close(middle.points[0][0],initial.record[0].points[0][0]+30/400),'scrubbing follows the recorded samples');
app.scrub(1000);check(equal(pose(app),moved),'forward inspection returns to the same endpoint');
app.click('play');app.advance(1200);check(equal(pose(app),moved)&&app.frames.size===0,'play reuses the record and stops');
// An interrupted new drag must restore the whole previous record and cursor.
const saved=app.snapshot(),b=begin(app,'token-0');move(app,b,220,400);app.nodes.objects.emit('pointercancel',{target:b,pointerId:1});
check(equal(app.snapshot(),saved),'pointer cancellation restores history and grouping');
const lost=begin(app,'unit-0-1');move(app,lost,500,260);app.nodes.objects.emit('lostpointercapture',{target:lost,pointerId:1});
check(equal(app.snapshot(),saved),'capture loss restores the previous state');
const paused=begin(app,'token-1');move(app,paused,510,405);check(equal(app.snapshot(),saved),'host navigation during a drag rolls it back before acknowledging the snapshot');
const escape=begin(app,'token-0');move(app,escape,220,380);app.window.emit('keydown',{key:'Escape'});check(equal(app.snapshot(),saved),'Escape cancels without replacing the record');
const held=begin(app,'unit-0-1',7);app.nodes.objects.emit('pointerdown',{target:app.object('token-0'),pointerId:8,clientX:300,clientY:225});move(app,app.object('token-0'),160,300,8);app.nodes.objects.emit('pointercancel',{target:held,pointerId:7});check(equal(app.snapshot(),saved),'a second pointer cannot take over a held group');
// Tap/keyboard selection offers visible destinations; these are not extra objects.
const tap=boot('bundle',{embedded:true});tap.clickObject('token-0');
check(tap.nodes.objects.children.some(b=>b.dataset.key==='release'),'selecting a member reveals an open unpack destination');
tap.exportScene('bundle-unpack-choice-736');tap.clickObject('release');tap.advance(800);
const unpacked=pose(tap);check(equal(unpacked.groups,[[0],[1]]),'the open ring unpacks one member');
check(unpacked.points.length===2&&G.separated(unpacked),'unpacking preserves identities and a clear resting arrangement');
tap.exportScene('bundle-unpacked-736');tap.clickObject('token-0');tap.clickObject('token-1');tap.advance(800);
check(equal(pose(tap).groups,[[0,1]]),'selecting another object joins its group');
const joined=pose(tap);tap.click('rewind');tap.advance(800);check(equal(pose(tap),unpacked),'reversing regrouping uses the retained history');tap.scrub(1000);check(equal(pose(tap),joined),'replaying restores the same grouping');
// A direct pull and drop use the same transfers as selection.
const drag=boot('bundle',{embedded:true});drag.drag('token-0',[{x:260,y:320},{x:260,y:410}]);
check(equal(pose(drag).groups,[[0],[1]]),'pulling a member into free space unpacks it');
const destination=center(drag,'token-1');drag.drag('token-0',[destination]);
check(equal(pose(drag).groups,[[0,1]]),'dropping on another member rejoins the pair');
check(!drag.nodes.objects.children.some(b=>b.dataset.key==='release'),'the click after a completed drag is suppressed');
const short=boot('bundle',{embedded:true}),shortStart=center(short,'token-0');short.drag('token-0',[{x:shortStart.x+12,y:shortStart.y}]);
check(equal(pose(short).groups,[[0,1]])&&close(center(short,'token-0').x,shortStart.x),'a small pull released inside the original capsule returns to its group');
// The contrast: a different pair, then one bundle of all three.
const three=boot('bundle',{embedded:true});three.click('example');const originalThree=pose(three);three.exportScene('bundle-third-736');
three.clickObject('token-1');three.clickObject('token-2');three.advance(800);const different=pose(three);
check(equal(different.groups,[[0],[1,2]]),'the same three objects can make a different pair and singleton');
check(different.points.length===3&&G.separated(different),'regrouping keeps all three identities and leaves the unrelated circle outside');
three.exportScene('bundle-regrouped-736');
const circle=center(three,'token-0'),sq=center(three,'token-1'),tri=center(three,'token-2'),newUnit=center(three,'unit-1-2');
three.drag('unit-1-2',[{x:newUnit.x-30,y:newUnit.y-20}]);
check(close(center(three,'token-0').x,circle.x)&&close(center(three,'token-0').y,circle.y),'moving the new pair leaves its former partner still');
check(close(center(three,'token-1').x-sq.x,center(three,'token-2').x-tri.x)&&close(center(three,'token-1').y-sq.y,center(three,'token-2').y-tri.y),'the newly grouped pair moves as one unit');
three.clickObject('token-0');three.clickObject('unit-1-2');three.advance(800);check(equal(pose(three).groups,[[0,1,2]]),'joining the capsule can group all three objects');three.exportScene('bundle-all-three-736');
three.clickObject('token-1');three.clickObject('release');three.advance(800);check(equal(pose(three).groups,[[0,2],[1]]),'any member can be unpacked from a larger bundle');
check(originalThree.points.length===pose(three).points.length,'regrouping never changes the collection size');
// Keyboard motion and editing during inspection preserve the model.
const keys=boot('bundle',{embedded:true,reduced:true}),kp=pose(keys);key(keys,'unit-0-1','ArrowUp');
check(pose(keys).points.every((p,i)=>close(p[1]-kp.points[i][1],-.06)),'vertical arrow names, rather than a generic sign, govern vertical movement');
key(keys,'token-0','ArrowDown');check(equal(pose(keys).groups,[[0],[1]]),'keyboard control can unpack an individual');
keys.clickObject('token-0');keys.clickObject('token-1');check(equal(pose(keys).groups,[[0,1]])&&keys.frames.size===0,'reduced motion immediately completes the same grouping');
keys.scrub(420);const inspected=pose(keys);key(keys,'token-0','ArrowRight');check(M.validFrame(pose(keys),2),'new movement during inspection keeps a complete partition');check(equal(keys.snapshot().record[0],inspected),'editing starts from the inspected pose rather than an unrelated endpoint');
const approaching=boot('bundle',{embedded:true,reduced:true});approaching.click('example');approaching.clickObject('token-2');approaching.clickObject('unit-0-1');approaching.scrub(900);
const overlap=pose(approaching);check(!G.separated(overlap),'the inspected approach exercises an existing clearance overlap');key(approaching,'unit-0-1','ArrowUp');
check(close(pose(approaching).points[0][1],overlap.points[0][1]-.06)&&close(pose(approaching).points[1][1],overlap.points[1][1]-.06),'an in-transit overlap does not trap a unit when the learner starts moving it');
const slow=boot('bundle',{embedded:true});slow.clickObject('unit-0-1');slow.advance(180);const interrupted=slow.snapshot();check(interrupted.cursor>0&&interrupted.cursor<interrupted.record.length-1,'pausing preserves a partial demonstration');
slow.restore(interrupted);check(equal(slow.snapshot(),interrupted)&&slow.frames.size===0,'restoration preserves the inspection cursor without autoplay');
slow.click('play');slow.advance(1200);check(slow.frames.size===0,'resumed replay remains bounded');
const resize=boot('bundle',{embedded:true}),beforeResize=resize.snapshot(),resized=begin(resize,'token-0');move(resize,resized,160,400);resize.resize(260,370);
check(equal(resize.snapshot(),beforeResize),'resizing during a drag restores its original model and history');
check(resize.object('token-0').style.left!==app.object('token-0').style.left,'resize recomputes board geometry at the new width');
resize.clickObject('unit-0-1');resize.advance(130);resize.media.matches=true;resize.media.emit('change',{matches:true});check(resize.frames.size===0&&M.validFrame(pose(resize),2),'changing reduced motion pauses at a valid inspected pose');
// All final arrangements retain separate targets at the narrow supported sizes.
for(const w of [260,280,320,390,736]){
  const small=boot('bundle',{w,h:370,embedded:true,reduced:true}),scene=name=>{if(w===260)small.exportScene(name+'-'+w);};scene('bundle-pair');small.click('example');scene('bundle-third');
  small.clickObject('token-1');small.clickObject('token-2');scene('bundle-regrouped');
  small.clickObject('token-0');small.clickObject('unit-1-2');scene('bundle-all-three');
  const tokens=small.nodes.objects.children.filter(b=>b.dataset.key.startsWith('token-'));
  for(let i=0;i<tokens.length;i++){const x=parseFloat(tokens[i].style.left),y=parseFloat(tokens[i].style.top);check(x>=24&&x<=w-24&&y>=24&&y<=346,'touch target fits after regrouping');for(let j=i+1;j<tokens.length;j++)check(Math.hypot(x-parseFloat(tokens[j].style.left),y-parseFloat(tokens[j].style.top))>=48,'regrouped objects have distinct targets');}
  small.click('play');check(small.frames.size===0,'reduced motion has no idle animation');
}
console.log(JSON.stringify({lesson:'bundle',suite:'exported interactions',checks,passed:true,limitation:'DOM/event harness and scene output, not browser layout or real touch'}));
