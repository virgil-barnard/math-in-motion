'use strict';
// Executes the actual exported scripts with a small DOM/event shim. This is not
// a browser layout, mobile Safari, pointer-device, or accessibility conformance test.
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
let assertions=0;
function check(value,message){assertions++;assert(value,message);}
function boot(w=736,h=540,reduced=false,edition='all'){
  let now=1000,nextFrame=1;
  const frames=new Map();
  class Element{
    constructor(tag='div',id=''){this.tagName=tag.toUpperCase();this.id=id;this.dataset={};this.attrs={};this.children=[];this.events={};this._html='';this.className='';this.value='0';this.textContent='';this.parent=null;this.style={setProperty(k,v){this[k]=v;}};const self=this;this.classList={add(c){const s=new Set(self.className.split(' ').filter(Boolean));s.add(c);self.className=[...s].join(' ');},remove(c){self.className=self.className.split(' ').filter(x=>x!==c).join(' ');},toggle(c,v){if(v)this.add(c);else this.remove(c);},contains(c){return self.className.split(' ').includes(c);}};}
    set innerHTML(value){this._html=value;}get innerHTML(){return this._html;}
    setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}
    appendChild(child){child.parent=this;this.children.push(child);return child;}
    remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}
    addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
    emit(type,event={}){for(const fn of this.events[type]??[])fn({target:this,detail:0,button:0,...event});}
    querySelectorAll(selector){if(selector==='button')return this.children.filter(c=>c.tagName==='BUTTON');throw new Error(selector);}
    closest(){return this.tagName==='BUTTON'?this:null;}
    getBoundingClientRect(){return {left:0,top:0,width:w,height:h};}
    setPointerCapture(id){this.pointer=id;}
    releasePointerCapture(id){if(this.pointer===id){this.pointer=null;nodes.objects.emit('lostpointercapture',{pointerId:id,target:this});}}
    get offsetWidth(){return w;}
  }
  const ids=['motion-app','stage','scene','objects','timeline','play','arrange','example','rewind','sound','status','lesson-seal','lesson-nav','lesson-title','lesson-description','timeline-description'];
  const nodes=Object.fromEntries(ids.map(id=>[id,new Element(['play','arrange','example','rewind','sound'].includes(id)?'button':'div',id)]));
  nodes['motion-app'].dataset.edition=edition;
  const document={hidden:false,documentElement:new Element('html'),getElementById(id){check(!!nodes[id],`element ${id} exists`);return nodes[id];},createElement(tag){return new Element(tag);},addEventListener(){}};
  const window={addEventListener(){}};
  window.parent=window;
  const context={document,window,location:{hash:''},performance:{now:()=>now},matchMedia:()=>({matches:reduced,addEventListener(){}}),ResizeObserver:class{observe(){}},requestAnimationFrame(fn){const id=nextFrame++;frames.set(id,fn);return id;},Map,Set,Math,Number,String,Array,Object,JSON,console};
  vm.createContext(context);
  const file=fs.readFileSync(path.join(root,'docs',edition==='all'?'foundations.html':edition==='pairing'?'correspondence.html':`${edition}.html`),'utf8');
  const scripts=[...file.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  check(scripts.length===(edition==='all'?2:3),'all expected scripts are embedded');
  scripts.forEach(source=>vm.runInContext(source,context));
  function advance(ms){for(let t=0;t<ms;t+=16){now+=16;const queue=[...frames.values()];frames.clear();queue.forEach(fn=>fn(now));}}
  const object=key=>{const element=nodes.objects.children.find(el=>el.dataset.key===key);check(!!element,`object ${key} exists`);return element;};
  const clickObject=key=>nodes.objects.emit('click',{target:object(key),detail:0});
  const click=id=>nodes[id].emit('click');
  const scrub=value=>{nodes.timeline.value=String(value);nodes.timeline.emit('input');nodes.timeline.emit('change');};
  const choose=kind=>{const button=nodes['lesson-nav'].children.find(b=>b.dataset.lesson===kind);check(!!button,'navigation exists');button.emit('click');};
  function drag(key,point,cancel=false){const button=object(key),x=parseFloat(button.style.left)*w/100,y=parseFloat(button.style.top)*h/100;nodes.objects.emit('pointerdown',{target:button,pointerId:1,clientX:x,clientY:y});nodes.objects.emit('pointermove',{target:button,pointerId:1,clientX:point.x*w,clientY:point.y*h});nodes.objects.emit(cancel?'pointercancel':'pointerup',{target:button,pointerId:1,clientX:point.x*w,clientY:point.y*h});if(!cancel)nodes.objects.emit('click',{target:button,detail:1});advance(600);}
  function exportScene(name){
    const out=path.join(root,'evidence','scenes');fs.mkdirSync(out,{recursive:true});
    let objects='';
    for(const button of nodes.objects.children){
      if(button.dataset.kind!=='token')continue;
      const x=parseFloat(button.style.left)*w/100,y=parseFloat(button.style.top)*h/100;
      objects+=button.innerHTML.replace('<svg ',`<svg x="${x-21}" y="${y-21}" width="42" height="42" `);
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><radialGradient id="back"><stop stop-color="#142938"/><stop offset="1" stop-color="#0a1420"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#back)"/>${nodes.scene.innerHTML}${objects}</svg>`;
    fs.writeFileSync(path.join(out,`${name}.svg`),svg);
  }
  return {nodes,object,clickObject,click,scrub,choose,drag,advance,exportScene};
}
const app=boot();
app.clickObject('token-1');app.clickObject('socket-1');app.advance(700);
check(app.nodes.status.textContent.includes('Every object'),'tap pairing completes the first example');
app.click('arrange');app.advance(700);app.scrub(1000);
check(app.object('token-1').style.left===app.object('socket-1').style.left,'scrubbing aligns paired objects');
app.click('example');
app.drag('token-0',{x:.22,y:.67});
check(app.object('socket-0').getAttribute('aria-label').includes('paired with object 1'),'drag creates a pairing');
const before=app.object('token-1').style.left;
app.drag('token-1',{x:.05,y:.55},true);
check(app.object('token-1').style.left===before,'pointer cancellation restores the original arrangement');
app.clickObject('token-1');app.clickObject('socket-1');app.clickObject('token-2');app.clickObject('socket-2');app.advance(700);app.click('arrange');app.advance(700);app.scrub(270);app.exportScene('correspondence');
app.click('example');
for(let i=0;i<4;i++){app.clickObject(`token-${i}`);app.clickObject(`socket-${i}`);app.advance(450);}
check(app.nodes.status.textContent.includes('Every object'),'an object from reserve repairs unequal cardinality');
app.click('example');for(let i=0;i<3;i++){app.clickObject(`token-${i}`);app.clickObject(`socket-${i}`);}
app.clickObject('token-3');app.clickObject('reserve');app.advance(700);
check(app.nodes.status.textContent.includes('Every object'),'moving an excess object to reserve repairs cardinality');
app.choose('membership');
for(const [token,region] of [[0,3],[1,2],[2,1],[3,0]]){app.clickObject(`token-${token}`);app.clickObject(`region-${region}`);app.advance(500);}
check(app.nodes.status.textContent.startsWith('4 of 4'),'four property combinations can be placed by taps');
app.clickObject('token-0');app.clickObject('region-1');app.advance(500);
check(app.nodes.scene.innerHTML.includes('stroke-dasharray="2 7"'),'an inconsistent placement reveals a relation to the expected region');
app.click('play');app.advance(4000);check(app.nodes.status.textContent.startsWith('4 of 4'),'the sorting demonstration completes');app.exportScene('membership');
app.choose('composition');app.clickObject('output-2');app.scrub(1000);
check(app.nodes.status.textContent.includes('circle finishes at output 3'),'routing agrees with the first exact composition');
app.click('arrange');app.advance(1300);app.scrub(1000);
check(app.nodes.status.textContent.includes('circle finishes at output 2'),'swapping order changes the output');
app.scrub(450);app.exportScene('composition');
for(const width of [280,320,390]){const small=boot(width,360);for(const kind of ['pairing','membership','composition']){small.choose(kind);small.scrub(1000);for(const button of small.nodes.objects.children.filter(b=>b.dataset.kind==='token')){const x=parseFloat(button.style.left)*width/100,y=parseFloat(button.style.top)*360/100;check(x>=20&&x<=width-20&&y>=20&&y<=340,'token geometry fits a narrow stage');}}}
const quiet=boot(320,400,true);quiet.choose('membership');quiet.click('play');check(quiet.nodes.timeline.value==='1000','reduced motion reveals a stable endpoint immediately');
for(const edition of ['pairing','membership','composition']){const solo=boot(390,500,false,edition);check(solo.nodes['lesson-nav'].children.length===1,'standalone edition has one self-contained lesson');solo.scrub(500);}
console.log(JSON.stringify({suite:'exported-script event smoke checks',assertions,passed:true,limitation:'DOM shim; not a rendered browser or real touch device'}));
