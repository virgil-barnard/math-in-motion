// Deliberately small DOM/event harness, not a browser or accessibility audit.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function boot(id,{w=736,h=500,reduced=false,embedded=false,hash=''}={}){
  const html=fs.readFileSync(path.join(root,'docs',`${id}.html`),'utf8');
  let now=1000,serial=0;const frames=new Map(),timers=new Map(),messages=[],nodes={};
  class Element{
    constructor(tag='div'){this.tagName=tag.toUpperCase();this.attrs={};this.dataset={};this.children=[];this.events={};this.style={setProperty(k,v){this[k]=v;}};this.innerHTML='';this.value='0';this.hidden=false;this.className='';this.contentWindow={messages:[],postMessage(data){this.messages.push(data);}};const self=this;this.classList={add(c){self.className+=' '+c;},remove(c){self.className=self.className.split(' ').filter(x=>x!==c).join(' ');},toggle(c,value){if(value)this.add(c);else this.remove(c);}};}
    addEventListener(k,f){(this.events[k]??=[]).push(f);}
    emit(k,event={}){for(const f of this.events[k]||[])f({target:this,button:0,detail:0,preventDefault(){},...event});}
    setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}
    appendChild(n){n.parentNode=this;this.children.push(n);return n;}
    remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(n=>n!==this);}
    closest(){return this.tagName==='BUTTON'?this:null;}
    querySelectorAll(selector){assert(selector==='button','only direct button queries are modeled');return this.children.filter(n=>n.tagName==='BUTTON');}
    getBoundingClientRect(){return{left:0,top:0,width:w,height:h};}
    setPointerCapture(id){this.pointer=id;}
    releasePointerCapture(id){if(this.pointer===id){this.pointer=null;nodes.objects?.emit('lostpointercapture',{target:this,pointerId:id});}}
    focus(){if(document.activeElement)document.activeElement.focused=false;document.activeElement=this;this.focused=true;}
  }
  for(const m of html.matchAll(/<([a-z][a-z0-9-]*)\b[^>]*\bid="([^"]+)"[^>]*>/g)){const el=new Element(m[1]);el.id=m[2];for(const data of m[0].matchAll(/data-([a-z]+)="([^"]*)"/g))el.dataset[data[1]]=data[2];nodes[m[2]]=el;}
  const document=new Element('document');document.documentElement=new Element('html');document.documentElement.dataset.lesson=id;document.hidden=false;
  document.getElementById=id=>{const find=el=>el.id===id?el:el.children.map(find).find(Boolean);const found=nodes[id]||Object.values(nodes).map(find).find(Boolean);assert(found,`missing DOM id ${id}`);return found;};document.createElement=tag=>new Element(tag);
  const window=new Element('window');window.parent=embedded?{postMessage:data=>messages.push(data)}:window;
  window.scrollY=0;window.scrollTo=(_,y)=>{window.scrollY=y;};
  const media=new Element();media.matches=reduced;
  const location={hash};const history={pushState(_,__,h){location.hash=h;},replaceState(_,__,h){location.hash=h;}};
  const context={document,window,location,history,localStorage:{getItem(){return null;},setItem(){}},performance:{now:()=>now},matchMedia:()=>media,ResizeObserver:class{observe(){}},requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},cancelAnimationFrame(id){frames.delete(id);},setTimeout(fn,ms){timers.set(++serial,{fn,time:now+ms});return serial;},clearTimeout(id){timers.delete(id);},console};
  vm.createContext(context);
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);assert(scripts.length>=2);scripts.forEach(s=>vm.runInContext(s,context));
  function advance(ms){for(let t=0;t<ms;t+=16){now+=16;const queue=[...frames.values()];frames.clear();queue.forEach(fn=>fn(now));for(const [id,timer] of [...timers])if(timer.time<=now){timers.delete(id);timer.fn();}}}
  const object=key=>{const el=nodes.objects.children.find(x=>x.dataset.key===key);assert(el,`missing ${key}`);return el;};
  const click=id=>nodes[id].emit('click');
  const clickObject=key=>nodes.objects.emit('click',{target:object(key)});
  const scrub=value=>{nodes.timeline.value=String(value);nodes.timeline.emit('input');nodes.timeline.emit('change');};
  function drag(key,points,{cancel=false,pointerId=1}={}){
    const b=object(key),start={x:parseFloat(b.style.left),y:parseFloat(b.style.top)};
    nodes.objects.emit('pointerdown',{target:b,pointerId,clientX:start.x,clientY:start.y});
    for(const p of points)nodes.objects.emit('pointermove',{target:b,pointerId,clientX:p.x,clientY:p.y});
    const last=points.at(-1)||start;nodes.objects.emit(cancel?'pointercancel':'pointerup',{target:b,pointerId,clientX:last.x,clientY:last.y});
    if(!cancel)nodes.objects.emit('click',{target:b,detail:1});advance(500);
  }
  function exportScene(name){
    let body=nodes.scene?.innerHTML||nodes['map-links']?.innerHTML||'';
    for(const b of nodes.objects?.children||[]){const x=parseFloat(b.style.left),y=parseFloat(b.style.top),size=b.className.includes('choice')?48:44;body+=b.innerHTML.replace('<svg ',`<svg x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" `);}
    if(nodes['map-nodes'])for(const b of nodes['map-nodes'].children){const x=parseFloat(b.style.left),y=parseFloat(b.style.top);body+=`<circle cx="${x}" cy="${y}" r="40" fill="#102230" stroke="#648896" stroke-opacity=".5"/>`+b.innerHTML.replace('<svg ',`<svg x="${x-22}" y="${y-22}" width="44" height="44" `);}
    const height=nodes['map-field']?parseFloat(nodes['map-field'].style.height):h;
    fs.writeFileSync(path.join(root,'evidence/scenes',`${name}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${height}" viewBox="0 0 ${w} ${height}"><defs><radialGradient id="back"><stop stop-color="#142938"/><stop offset="1" stop-color="#0a1420"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#back)"/>${body}</svg>`);
  }
  const snapshot=()=>{assert(embedded,'snapshot helper needs embedded:true');window.emit('message',{source:window.parent,data:{channel:'mathematics-in-motion/v1',type:'pause',request:901}});return JSON.parse(JSON.stringify(messages.at(-1).state));};
  const restore=state=>{assert(embedded,'restore helper needs embedded:true');window.emit('message',{source:window.parent,data:{channel:'mathematics-in-motion/v1',type:'restore',state}});};
  return{nodes,window,document,context,messages,frames,timers,advance,click,clickObject,scrub,object,drag,exportScene,media,location,snapshot,restore};
}
module.exports={boot,root};
