(() => {
  const $=id=>document.getElementById(id),channel='mathematics-in-motion/v1';
  const catalog=MotionCatalog,byId=new Map(catalog.map(x=>[x.id,x]));
  const states=new Map(),visited=new Set(),mapPlaces=new Map();
  let active=null,frame=null,incoming=null,page=0,mapOpen=true,scope='opening',operation=0,requestId=0,retryId=null;
  const pending=new Map(),fades=new Set(),motion=matchMedia('(prefers-reduced-motion: reduce)');
  try{history.scrollRestoration='manual';}catch{}
  const art=body=>`<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
  const nextIcon=art('<path d="m15 9 11 11-11 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
  const atlasIcon=art('<path d="M20 7 8 29M20 7 32 29M8 29h24" stroke="#648896"/><circle cx="20" cy="7" r="4" fill="#0a1420" stroke="#eedbb6"/><circle cx="8" cy="29" r="4" fill="#0a1420" stroke="#83d6d1"/><circle cx="32" cy="29" r="4" fill="#0a1420" stroke="#b7a4e8"/>');
  const pathIcon=art('<path d="M14 7c0 7 12 6 12 13s-12 6-12 13" stroke="#648896"/><circle cx="14" cy="7" r="3" fill="#eedbb6"/><circle cx="26" cy="20" r="3" fill="#83d6d1"/><circle cx="14" cy="33" r="3" fill="#b7a4e8"/>');
  $('map-button').innerHTML=atlasIcon;
  $('retry-button').innerHTML=art('<path d="M30 14a12 12 0 1 0 1 11M30 7v8h-8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
  $('continue-button').innerHTML=nextIcon;$('map-next').innerHTML=nextIcon;$('map-prev').innerHTML=art('<path d="m25 9-11 11 11 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
  try{const saved=JSON.parse(localStorage.getItem('motion-visits-v1')||'[]');if(Array.isArray(saved))saved.filter(id=>byId.has(id)).forEach(id=>visited.add(id));}catch{}
  function persist(){try{localStorage.setItem('motion-visits-v1',JSON.stringify([...visited]));}catch{}}
  const nextLesson=()=>CatalogModel.next(catalog,active);
  function updateChrome(){const next=nextLesson(),marker=active||incoming?.id;$('current-glyph').innerHTML=marker?byId.get(marker).glyph:'';$('continue-button').disabled=false;$('continue-button').innerHTML=next?nextIcon:atlasIcon;$('continue-button').setAttribute('aria-label',next?`Explore ${next.title}`:'Explore the complete lesson constellation');$('map-button').disabled=mapOpen&&!active&&!incoming;$('map-button').setAttribute('aria-expanded',String(mapOpen));$('map-button').setAttribute('aria-label',incoming?'Cancel opening and return':mapOpen&&active?'Return to the current lesson':'Open the lesson menu');$('scope-button').innerHTML=scope==='opening'?atlasIcon:pathIcon;$('scope-button').setAttribute('aria-label',scope==='opening'?'Explore all lessons in the complete constellation':'Return to the small opening path');}
  function drawMap(){
    const w=Math.max(264,$('map-field').getBoundingClientRect().width),g=scope==='opening'?CatalogModel.openingLayout(catalog,w):CatalogModel.layout(catalog,page,w);
    $('lesson-map').setAttribute('aria-label',scope==='opening'?'Opening path':'Complete lesson constellation');
    $('map-description').textContent=scope==='opening'?'A small suggested path through familiar actions. Each symbol opens a lesson. The constellation control reveals every lesson, all available immediately. A visit is not an assessment.':'Solid paths suggest what builds on what; dotted paths connect related ideas. Every lesson is available. Use the path control to return to the small opening sequence.';
    $('map-field').style.height=`${g.height}px`;$('map-links').setAttribute('viewBox',`0 0 ${w} ${g.height}`);
    $('map-links').innerHTML=g.edges.map(e=>{const a=g.byId.get(e.from),b=g.byId.get(e.to);return `<path d="M${a.x} ${a.y} C${a.x} ${(a.y+b.y)/2} ${b.x} ${(a.y+b.y)/2} ${b.x} ${b.y}" fill="none" stroke="${e.type==='related'?'#b7a4e8':'#648896'}" stroke-opacity="${e.type==='related'?'.28':'.5'}" stroke-width="1.2" ${e.type==='related'?'stroke-dasharray="2 7"':''}/>`;}).join('');
    const old=new Map([...$('map-nodes').children].map(n=>[n.dataset.lesson,n])),keep=new Set();
    for(const p of g.nodes){const item=byId.get(p.id);let b=old.get(p.id);if(!b){b=document.createElement('button');b.type='button';b.dataset.lesson=p.id;b.innerHTML=item.glyph;b.addEventListener('click',()=>openLesson(item.id));$('map-nodes').appendChild(b);}keep.add(p.id);b.style.left=`${p.x}px`;b.style.top=`${p.y}px`;b.className=`lesson-node${active===p.id?' current':''}${visited.has(p.id)?' visited':''}`;b.setAttribute('aria-label',`${item.title}. ${item.summary}${visited.has(p.id)?' Previously visited.':''}`);b.setAttribute('aria-current',active===p.id?'page':'false');}
    for(const [id,b] of old)if(!keep.has(id))b.remove();
    $('map-paging').hidden=g.pages<=1;$('map-prev').disabled=page===0;$('map-next').disabled=page===g.pages-1;$('page-dots').innerHTML=Array.from({length:g.pages},(_,i)=>`<span class="${i===page?'active':''}"></span>`).join('');updateChrome();
  }
  function pauseCurrent(){
    if(!frame||mapOpen)return Promise.resolve();
    const request=++requestId;
    return new Promise(resolve=>{
      const finish=()=>{clearTimeout(timeout);pending.delete(request);resolve();};
      const timeout=setTimeout(finish,180);
      pending.set(request,finish);
      frame.contentWindow.postMessage({channel,type:'pause',request},'*');
    });
  }
  function setHash(hash,replace=false){try{history[replace?'replaceState':'pushState'](null,'',hash);}catch{location.hash=hash;}}
  const viewHash=()=>mapOpen?(scope==='opening'?'#start':'#map'):`#${active}`;
  function interact(element,enabled){
    if(!element)return;
    element.inert=!enabled;
    element.setAttribute('aria-hidden',String(!enabled));
    element.style.pointerEvents=enabled?'':'none';
  }
  function opacity(element,value){element.style.transition='none';element.style.opacity=String(value);}
  function busy(value){$('lesson-marker').setAttribute('data-loading',String(value));$('lesson-surface').setAttribute('aria-busy',String(value));}
  function resetPresentation(){
    $('lesson-map').hidden=!mapOpen;opacity($('lesson-map'),1);interact($('lesson-map'),mapOpen);
    $('lesson-frame').hidden=mapOpen;$('lesson-frame').className='';
    if(frame){opacity(frame,1);interact(frame,!mapOpen);}
    busy(false);updateChrome();
  }
  function beginNavigation(){
    const ticket=++operation;
    for(const finish of [...fades])finish(false);
    for(const finish of [...pending.values()])finish();
    if(incoming){incoming.finish(false);incoming.element.remove();incoming=null;}
    retryId=null;$('retry-button').hidden=true;$('current-glyph').hidden=false;
    resetPresentation();return ticket;
  }
  function fade(element,to,duration,ticket){
    if(!element||motion.matches||document.hidden){if(element)opacity(element,to);return Promise.resolve(ticket===operation);}
    // A layout flush establishes the starting opacity without an idle RAF loop.
    element.getBoundingClientRect();
    element.style.transition=`opacity ${duration}ms ease`;
    element.style.opacity=String(to);
    return new Promise(resolve=>{
      const finish=valid=>{clearTimeout(timer);fades.delete(finish);element.style.transition='none';resolve(valid&&ticket===operation);};
      const timer=setTimeout(()=>finish(true),duration);fades.add(finish);
    });
  }
  function rememberMap(focus=null){
    if(mapOpen)mapPlaces.set(scope,{page,y:window.scrollY,focus:focus||mapPlaces.get(scope)?.focus||null});
  }
  function stageDocument(id){
    const element=document.createElement('iframe');
    element.title=`${byId.get(id).title} — Mathematics in Motion`;
    element.setAttribute('sandbox','allow-scripts allow-same-origin');element.setAttribute('allow','fullscreen');
    opacity(element,0);interact(element,false);
    return new Promise(resolve=>{
      let settled=false;
      const finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);resolve(ok);};
      const timeout=setTimeout(()=>finish(false),6000);
      incoming={id,element,request:null,ackType:null,finish};
      element.addEventListener('error',()=>finish(false));
      if(MotionPayloads)element.srcdoc=MotionPayloads[id];else element.src=byId.get(id).file;
      $('lesson-frame').className=mapOpen?'staging':'';$('lesson-frame').hidden=false;
      $('lesson-frame').appendChild(element);busy(true);updateChrome();
      $('catalog-status').textContent=`Opening ${byId.get(id).title}.`;
    });
  }
  async function openLesson(id,updateUrl=true){
    if(!byId.has(id))return;const ticket=beginNavigation();
    if(mapOpen)rememberMap(id);
    if(active===id&&frame&&!mapOpen){if(updateUrl&&location.hash!==`#${id}`)setHash(`#${id}`);frame.focus({preventScroll:true});return;}
    interact(frame,false);
    await pauseCurrent();if(ticket!==operation)return;
    let target=frame;
    if(active!==id||!target){
      const ready=await stageDocument(id);if(ticket!==operation)return;
      if(!ready){
        incoming.element.remove();incoming=null;resetPresentation();
        retryId=id;$('current-glyph').hidden=true;$('retry-button').hidden=false;
        $('retry-button').setAttribute('aria-label',`Retry opening ${byId.get(id).title}`);
        $('catalog-status').textContent=`${byId.get(id).title} could not open. Your previous view is kept. Retry or choose another lesson.`;
        setHash(viewHash(),true);$('retry-button').focus({preventScroll:true});return;
      }
      target=incoming.element;
    }else{
      opacity(target,0);$('lesson-frame').className='staging';$('lesson-frame').hidden=false;
    }
    const outgoing=mapOpen?$('lesson-map'):frame;
    interact(outgoing,false);
    if(!await fade(outgoing,0,110,ticket))return;
    if(frame&&frame!==target)frame.remove();
    frame=target;active=id;incoming=null;mapOpen=false;
    $('lesson-map').hidden=true;$('lesson-frame').hidden=false;$('lesson-frame').className='';
    if(!CatalogModel.opening(catalog).some(x=>x.id===id))scope='all';
    visited.add(id);persist();busy(false);updateChrome();
    if(updateUrl&&location.hash!==`#${id}`)setHash(`#${id}`);
    window.scrollTo(0,0);
    if(!await fade(frame,1,180,ticket))return;
    interact(frame,true);$('catalog-status').textContent=`${byId.get(id).title} opened.`;frame.focus({preventScroll:true});
  }
  async function openMap(updateUrl=true,requestedScope=null,requestedPage=null){
    rememberMap();const ticket=beginNavigation(),destination=requestedScope||scope;
    const place=mapPlaces.get(destination)||{page:destination==='all'&&active?Math.floor(CatalogModel.ordered(catalog).findIndex(x=>x.id===active)/9):0,y:0,focus:active};
    const nextPage=requestedPage??place.page,changed=!mapOpen||scope!==destination||page!==nextPage;
    interact(frame,false);await pauseCurrent();if(ticket!==operation)return;
    const outgoing=mapOpen?$('lesson-map'):frame;
    if(changed){interact(outgoing,false);if(!await fade(outgoing,0,110,ticket))return;}
    scope=destination;page=nextPage;mapOpen=true;
    $('lesson-frame').hidden=true;$('lesson-frame').className='';$('lesson-map').hidden=false;
    drawMap();if(updateUrl&&location.hash!==viewHash())setHash(viewHash());
    window.scrollTo(0,requestedPage===null?place.y:0);
    if(changed){opacity($('lesson-map'),0);if(!await fade($('lesson-map'),1,180,ticket))return;}
    interact($('lesson-map'),true);
    const selected=requestedPage===null?place.focus:null;
    const focus=[...$('map-nodes').children].find(b=>b.dataset.lesson===selected)||$('map-nodes').children[0];focus?.focus({preventScroll:true});
    $('catalog-status').textContent=scope==='opening'?'Opening path.':'Complete lesson constellation.';
  }
  window.addEventListener('message',event=>{
    const data=event.data;
    if(data?.channel!==channel)return;
    if(incoming&&event.source===incoming.element.contentWindow&&data.lesson===incoming.id){
      if(data.type==='ready'&&incoming.request===null){
        incoming.request=++requestId;
        incoming.ackType=data.acknowledgesRestore?'restored':'paused';
        incoming.element.contentWindow.postMessage({channel,type:'restore',request:incoming.request,state:states.get(incoming.id)||null},'*');
        // Older cached v1 documents acknowledge pause. Ordered messages ensure
        // that pause observes the preceding restore, without revealing defaults.
        if(incoming.ackType==='paused')incoming.element.contentWindow.postMessage({channel,type:'pause',request:incoming.request},'*');
      }else if(data.type===incoming.ackType&&incoming.request!==null&&data.request===incoming.request){
        if(data.state&&typeof data.state==='object')states.set(incoming.id,data.state);
        incoming.finish(true);
      }
      return;
    }
    if(!frame||event.source!==frame.contentWindow||data.lesson!==active)return;
    if((data.type==='state'||data.type==='paused')&&data.state&&typeof data.state==='object')states.set(active,data.state);
    if(data.type==='paused')pending.get(data.request)?.();
  });
  $('retry-button').addEventListener('click',()=>{if(retryId)openLesson(retryId);});
  $('map-button').addEventListener('click',()=>{if(incoming)openMap();else if(mapOpen&&active)openLesson(active);else openMap();});
  $('continue-button').addEventListener('click',()=>{const next=nextLesson();if(next)openLesson(next.id);else openMap(true,'all');});
  $('scope-button').addEventListener('click',()=>openMap(true,scope==='opening'?'all':'opening'));
  $('map-prev').addEventListener('click',()=>{if(page>0)openMap(false,scope,page-1);});$('map-next').addEventListener('click',()=>{if((page+1)*9<catalog.length)openMap(false,scope,page+1);});
  function route(){let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{}if(byId.has(id))openLesson(id,false);else openMap(false,id==='map'?'all':'opening');}
  window.addEventListener('hashchange',route);window.addEventListener('popstate',route);
  const finishMotion=()=>{for(const finish of [...fades])finish(true);};
  motion.addEventListener('change',()=>{if(motion.matches)finishMotion();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){finishMotion();pauseCurrent();}});
  new ResizeObserver(()=>{if(mapOpen)drawMap();}).observe($('map-field'));
  drawMap();resetPresentation();route();
})();
