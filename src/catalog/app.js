(() => {
  const $=id=>document.getElementById(id),channel='mathematics-in-motion/v1';
  const catalog=MotionCatalog,byId=new Map(catalog.map(x=>[x.id,x]));
  const states=new Map(),visited=new Set();let active=null,frame=null,page=0,mapOpen=true,operation=0,requestId=0;
  const pending=new Map();
  const art=body=>`<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
  const nextIcon=art('<path d="m15 9 11 11-11 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
  $('map-button').innerHTML=art('<path d="M20 7 8 29M20 7 32 29M8 29h24" stroke="#648896"/><circle cx="20" cy="7" r="4" fill="#0a1420" stroke="#eedbb6"/><circle cx="8" cy="29" r="4" fill="#0a1420" stroke="#83d6d1"/><circle cx="32" cy="29" r="4" fill="#0a1420" stroke="#b7a4e8"/>');
  $('continue-button').innerHTML=nextIcon;$('map-next').innerHTML=nextIcon;$('map-prev').innerHTML=art('<path d="m25 9-11 11 11 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
  try{const saved=JSON.parse(localStorage.getItem('motion-visits-v1')||'[]');if(Array.isArray(saved))saved.filter(id=>byId.has(id)).forEach(id=>visited.add(id));}catch{}
  function persist(){try{localStorage.setItem('motion-visits-v1',JSON.stringify([...visited]));}catch{}}
  function nextLesson(){
    const ordered=CatalogModel.ordered(catalog);if(!active)return ordered[0];
    const follow=ordered.filter(x=>x.builds_on.includes(active));
    const candidate=follow.find(x=>!visited.has(x.id));
    if(candidate){const missing=candidate.builds_on.find(id=>!visited.has(id));return missing?byId.get(missing):candidate;}
    return ordered.find(x=>!visited.has(x.id)&&x.builds_on.every(id=>visited.has(id)))||follow[0]||null;
  }
  function updateChrome(){const next=nextLesson();$('current-glyph').innerHTML=active?byId.get(active).glyph:'';$('continue-button').disabled=!next;$('continue-button').setAttribute('aria-label',next?`Explore ${next.title}`:'No suggested next lesson');$('map-button').setAttribute('aria-expanded',String(mapOpen));$('map-button').setAttribute('aria-label',mapOpen&&active?'Return to the current lesson':'Open the lesson constellation');}
  function drawMap(){
    const w=Math.max(264,$('map-field').getBoundingClientRect().width),g=CatalogModel.layout(catalog,page,w);
    $('map-field').style.height=`${g.height}px`;$('map-links').setAttribute('viewBox',`0 0 ${w} ${g.height}`);
    $('map-links').innerHTML=g.edges.map(e=>{const a=g.byId.get(e.from),b=g.byId.get(e.to);return `<path d="M${a.x} ${a.y} C${a.x} ${(a.y+b.y)/2} ${b.x} ${(a.y+b.y)/2} ${b.x} ${b.y}" fill="none" stroke="${e.type==='related'?'#b7a4e8':'#648896'}" stroke-opacity="${e.type==='related'?'.28':'.5'}" stroke-width="1.2" ${e.type==='related'?'stroke-dasharray="2 7"':''}/>`;}).join('');
    const old=new Map([...$('map-nodes').children].map(n=>[n.dataset.lesson,n])),keep=new Set();
    for(const p of g.nodes){const item=byId.get(p.id);let b=old.get(p.id);if(!b){b=document.createElement('button');b.type='button';b.dataset.lesson=p.id;b.innerHTML=item.glyph;b.addEventListener('click',()=>openLesson(item.id));$('map-nodes').appendChild(b);}keep.add(p.id);b.style.left=`${p.x}px`;b.style.top=`${p.y}px`;b.className=`lesson-node${active===p.id?' current':''}${visited.has(p.id)?' visited':''}`;b.setAttribute('aria-label',`${item.title}. ${item.summary}${visited.has(p.id)?' Previously visited.':''}`);b.setAttribute('aria-current',active===p.id?'page':'false');}
    for(const [id,b] of old)if(!keep.has(id))b.remove();
    $('map-paging').hidden=g.pages<=1;$('map-prev').disabled=page===0;$('map-next').disabled=page===g.pages-1;$('page-dots').innerHTML=Array.from({length:g.pages},(_,i)=>`<span class="${i===page?'active':''}"></span>`).join('');updateChrome();
  }
  function pauseCurrent(){
    if(!frame)return Promise.resolve();
    const request=++requestId;
    return new Promise(resolve=>{
      const timeout=setTimeout(()=>{pending.delete(request);resolve();},180);
      pending.set(request,()=>{clearTimeout(timeout);resolve();});
      frame.contentWindow.postMessage({channel,type:'pause',request},'*');
    });
  }
  function setHash(hash,replace=false){try{history[replace?'replaceState':'pushState'](null,'',hash);}catch{location.hash=hash;}}
  async function openLesson(id,updateUrl=true){
    if(!byId.has(id))return;const ticket=++operation;
    await pauseCurrent();if(ticket!==operation)return;
    if(active!==id||!frame){
      frame?.remove();active=id;frame=document.createElement('iframe');frame.title=`${byId.get(id).title} — Mathematics in Motion`;frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.setAttribute('allow','fullscreen');
      if(MotionPayloads)frame.srcdoc=MotionPayloads[id];else frame.src=byId.get(id).file;
      $('lesson-frame').appendChild(frame);
    }
    mapOpen=false;$('lesson-map').hidden=true;$('lesson-frame').hidden=false;visited.add(id);persist();updateChrome();
    if(updateUrl)setHash(`#${id}`);$('catalog-status').textContent=`${byId.get(id).title} opened.`;frame.focus({preventScroll:true});
  }
  async function openMap(updateUrl=true){
    const ticket=++operation;await pauseCurrent();if(ticket!==operation)return;
    mapOpen=true;$('lesson-frame').hidden=true;$('lesson-map').hidden=false;
    if(active)page=Math.floor(CatalogModel.ordered(catalog).findIndex(x=>x.id===active)/9);
    drawMap();if(updateUrl)setHash('#map');
    const focus=[...$('map-nodes').children].find(b=>b.dataset.lesson===active)||$('map-nodes').children[0];focus?.focus({preventScroll:true});
  }
  window.addEventListener('message',event=>{
    if(!frame||event.source!==frame.contentWindow||event.data?.channel!==channel||event.data.lesson!==active)return;
    const data=event.data;
    if(data.type==='ready')frame.contentWindow.postMessage({channel,type:'restore',state:states.get(active)||null},'*');
    if((data.type==='state'||data.type==='paused')&&data.state&&typeof data.state==='object')states.set(active,data.state);
    if(data.type==='paused'){pending.get(data.request)?.();pending.delete(data.request);}
  });
  $('map-button').addEventListener('click',()=>{if(mapOpen&&active)openLesson(active);else openMap();});
  $('continue-button').addEventListener('click',()=>{const next=nextLesson();if(next)openLesson(next.id);});
  $('map-prev').addEventListener('click',()=>{if(page>0){page--;drawMap();}});$('map-next').addEventListener('click',()=>{if((page+1)*9<catalog.length){page++;drawMap();}});
  function route(){let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{}if(byId.has(id))openLesson(id,false);else openMap(false);}
  window.addEventListener('hashchange',route);window.addEventListener('popstate',route);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseCurrent();});
  new ResizeObserver(()=>{if(mapOpen)drawMap();}).observe($('map-field'));
  route();
})();
