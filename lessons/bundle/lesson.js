(() => {
  const M=BundleModel,G=BundleGeometry,K=MotionKit,$=id=>document.getElementById(id);
  const names=['circle','square','triangle'],colors=[K.C[0],K.C[1],K.C[2]];
  const glyph='<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="4" y="12" width="40" height="25" rx="12.5" stroke="#83d6d1" stroke-width="1.2"/><path d="M20 11h8" stroke="#eedbb6" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="24.5" r="4" fill="#eedbb6"/><rect x="28" y="20.5" width="8" height="8" rx="1.4" fill="#83d6d1"/></svg>';
  let s=M.create(),selected=null,floating=null,hover=null,release=null,board=null;
  const groupKey=g=>'unit-'+g.join('-');
  const groupName=g=>g.map(id=>names[id]).join(' and ');
  function focusToken(id){[...$('objects').children].find(b=>b.dataset.key===`token-${id}`)?.focus({preventScroll:true});}
  function describe(){
    const p=M.current(s),grouping=p.groups.map(g=>g.length>1?`${groupName(g)} together`:`${names[g[0]]} alone`).join('; ');
    return `${p.points.length} objects, each present once: ${grouping}. ${s.record.length>1?'The timeline retraces the latest change; returning uses its recorded history.':'Drag the capsule boundary to move its contents together. Select a shape to unpack it, or drag it out.'}`;
  }
  function rect(r,stroke,opacity=1,dashed=false){return `<rect x="${K.f(r.x)}" y="${K.f(r.y)}" width="${K.f(r.w)}" height="${K.f(r.h)}" rx="${K.f(Math.min(r.h/2,42))}" fill="${dashed?'none':'#83d6d1'}" fill-opacity=".025" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${dashed?1:1.2}" ${dashed?'stroke-dasharray="3 7"':''}/>`;}
  function render(v){
    board=G.board(v.w,v.h);const p=M.current(s),items=[],units=[];let body='';
    const start=s.record[0];
    if(s.record.length>1&&s.cursor>0){
      for(const group of start.groups)if(group.length>1)body+=rect(G.capsule(start,group,board),'#b7a4e8',.16,true);
      start.points.forEach((point,id)=>{const a=G.pixel(point,board),b=G.pixel(p.points[id],board);if(Math.hypot(a.x-b.x,a.y-b.y)>10)body+=K.shape(names[id],a.x,a.y,8,colors[id],false,.18);});
    }
    for(const group of p.groups){
      const target=hover!==null&&group.includes(hover),possible=selected!==null&&!group.includes(selected),r=G.capsule(p,group,board);
      if(group.length>1){
        body+=rect(r,target?'#eedbb6':'#83d6d1',target?.9:possible?.68:.5);
        const cx=r.x+r.w/2,cy=r.y;
        body+=`<path d="M${K.f(cx-11)} ${K.f(cy)}h22" stroke="#eedbb6" stroke-opacity=".8" stroke-width="2.8" stroke-linecap="round"/><path d="M${K.f(cx-6)} ${K.f(cy-5)}h12" stroke="#eedbb6" stroke-opacity=".28" stroke-width="1" stroke-linecap="round"/>`;
        const key=groupKey(group);items.push({key,x:cx,y:r.y+r.h/2,kind:'unit',art:'',label:possible?`Place the selected ${names[selected]} with ${groupName(group)}`:`Move ${groupName(group)} together. Drag the boundary, or use arrow keys. Tap for one short movement.`});units.push({key,r});
      }else if(target||possible){
        const q=G.pixel(p.points[group[0]],board);
        body+=`<circle cx="${K.f(q.x)}" cy="${K.f(q.y)}" r="30" fill="none" stroke="${target?'#eedbb6':'#83d6d1'}" stroke-opacity="${target?.7:.35}" stroke-width="1.2"/>`;
      }
    }
    for(let id=0;id<p.points.length;id++){
      const q=G.pixel(p.points[id],board),group=M.groupOf(p,id),chosen=selected===id||floating===id;
      items.push({key:`token-${id}`,x:q.x,y:q.y,kind:'bundle-token',shape:names[id],color:colors[id],selected:chosen,label:selected!==null&&selected!==id&&!group.includes(selected)?`Place the selected ${names[selected]} with this ${names[id]}`:`${names[id]}, ${group.length>1?'inside the bundle':'alone'}. Drag to move alone. Select, then choose another shape or bundle to join.`});
    }
    release=null;
    if(selected!==null&&M.groupOf(p,selected).length>1){
      const loose=M.regroup(p,selected),position=p.points[selected];
      release=G.nearestPlacement(loose,[selected],[position[0],Math.min(1,position[1]+.53)]);
      if(release){const q=G.pixel(release.points[selected],board);items.push({key:'release',x:q.x,y:q.y,kind:'release',label:`Unpack the ${names[selected]} into this open place`,art:K.svg(`<circle cx="24" cy="24" r="19" fill="none" stroke="#83d6d1" stroke-width="1.1"/>${K.shape(names[selected],24,24,6,colors[selected],false,.55)}`)});}
    }
    v.paint(body,items);
    for(const {key,r} of units){const b=[...$('objects').children].find(b=>b.dataset.key===key);b.style.width=`${r.w}px`;b.style.height=`${r.h}px`;}
    const hasRecord=s.record.length>1;$('timeline').disabled=!hasRecord;$('rewind').disabled=!hasRecord;
    $('rewind').setAttribute('aria-label','Retrace the latest change to its beginning');
    v.examples(s.seed,2);
  }
  function appendMotion(to,steps=14){
    const from=M.current(s),between=M.refinement(from.groups,to.groups);M.reserve(s,steps);const start=s.cursor;
    for(let i=1;i<=steps;i++)M.append(s,{points:i===steps?M.copy(to.points):from.points.map((p,id)=>p.map((x,k)=>x+(to.points[id][k]-x)*i/steps)),groups:i===steps?to.groups:between});
    const end=s.record.length-1;s.cursor=Math.min(start,end);
    view.tween(s.cursor,end,value=>{s.cursor=value;},260,()=>view.tone(to.groups.length));
  }
  function perform(to,focus=null){
    if(!to)return;
    selected=null;floating=null;hover=null;
    s=M.animate(s,to);view.tween(0,s.record.length-1,value=>{s.cursor=value;},620,()=>{view.tone(to.groups.length);if(focus!==null)focusToken(focus);});
  }
  function join(id,target){
    const before=M.current(s),destination=M.groupOf(before,target);
    if(!destination||destination.includes(id))return;
    const center=[0,1].map(k=>destination.reduce((sum,x)=>sum+before.points[x][k],0)/destination.length);
    const grouped=M.regroup(before,id,target),to=G.nearestPlacement(grouped,M.groupOf(grouped,id),center);
    perform(to,id);
  }
  function moveGroup(group,dx,dy,demonstrate=false){
    const before=M.current(s),delta=G.shift(before,group,dx,dy),to=M.translate(before,group,...delta);
    if(M.same(before,to))return;
    if(demonstrate)perform(to);else{s=M.begin(s);M.append(s,to);}
  }
  function demonstrate(group){
    const before=M.current(s),options=[[.2,-.18],[-.2,-.18],[.2,.18],[-.2,.18]];
    let best=[0,0],length=0;
    for(const delta of options){const safe=G.shift(before,group,...delta),n=Math.hypot(...safe);if(n>length){best=safe;length=n;}}
    moveGroup(group,...best,true);
  }
  function dropTarget(frame,id,p,origin){
    const target=G.target(frame,id,p,board);if(target!==null)return target;
    const group=M.groupOf(origin,id);if(group.length<2)return null;
    const r=G.capsule(origin,group,board),q=G.pixel(p,board);
    return q.x>=r.x&&q.x<=r.x+r.w&&q.y>=r.y&&q.y<=r.y+r.h?group.find(x=>x!==id):null;
  }
  const view=K.create({
    title:'Bundle',description:'Objects keep their identities when grouped, moved together, unpacked, and regrouped. Drag the capsule boundary to carry its contents. Drag one shape out, or select it and choose the open ring. Select a shape and then another shape or bundle to join them. Arrow keys move the focused object or bundle. The timeline replays the most recent change; it is a history, not a mathematical inverse.',
    glyph,render,describe,progress:()=>M.progress(s),snapshot:()=>M.copy(s),restore(value){s=M.restore(value);selected=null;floating=null;hover=null;},
    scrub(p){selected=null;floating=null;hover=null;M.seek(s,p);},
    play(){selected=null;if(s.record.length===1){demonstrate(M.current(s).groups[0]);return;}if(s.cursor>=s.record.length-1)s.cursor=0;view.tween(s.cursor,s.record.length-1,value=>{s.cursor=value;},900);},
    rewind(){selected=null;view.tween(s.cursor,0,value=>{s.cursor=value;},650);},
    example(){s=M.create(s.seed+1);selected=null;floating=null;hover=null;},
    activate(key){
      if(key==='release'){const id=selected;if(id!==null)perform(release,id);return;}
      const p=M.current(s);
      if(key.startsWith('token-')){const id=Number(key.split('-')[1]);if(selected!==null&&selected!==id&&!M.groupOf(p,id).includes(selected))join(selected,id);else selected=selected===id?null:id;}
      else if(key.startsWith('unit-')){const group=key.slice(5).split('-').map(Number);if(selected!==null&&!group.includes(selected))join(selected,group[0]);else{selected=null;demonstrate(group);}}
    },
    nudge(key,dir,keyName){
      const dx=keyName==='ArrowRight'?.06:keyName==='ArrowLeft'?-.06:0,dy=keyName==='ArrowDown'?.06:keyName==='ArrowUp'?-.06:0;
      if(key.startsWith('unit-'))moveGroup(key.slice(5).split('-').map(Number),dx,dy);
      else if(key.startsWith('token-')){
        const id=Number(key.split('-')[1]),before=M.current(s),loose=M.regroup(before,id),p=before.points[id];
        const to=G.nearestPlacement(loose,[id],[p[0]+dx,p[1]+dy]);
        if(to){selected=null;s=M.begin(s);M.append(s,to);}
      }
    },
    down(key,p){
      if(!key.startsWith('token-')&&!key.startsWith('unit-'))return null;
      const base=M.current(s),isToken=key.startsWith('token-'),id=isToken?Number(key.split('-')[1]):null;
      const raw=[(p.x-board.x)/board.w,(p.y-board.y)/board.h];
      return{original:M.copy(s),oldSelected:selected,base,id,members:isToken?[id]:key.slice(5).split('-').map(Number),last:raw,offset:null};
    },
    move(d,p){
      const raw=[(p.x-board.x)/board.w,(p.y-board.y)/board.h];
      if(!d.started){d.started=true;s=M.begin(s);selected=null;d.offset=d.id===null?null:d.last.map((x,k)=>x-d.base.points[d.id][k]);}
      if(d.id===null){const before=M.current(s),delta=G.shift(before,d.members,raw[0]-d.last[0],raw[1]-d.last[1]);M.append(s,M.translate(before,d.members,...delta));}
      else{const next=M.regroup(d.base,d.id);next.points[d.id]=raw.map((x,k)=>K.clamp(x-d.offset[k]));M.append(s,next);floating=d.id;hover=dropTarget(next,d.id,next.points[d.id],d.base);}
      d.last=raw;
    },
    up(d){
      if(d.id!==null){
        const before=M.current(s),id=d.id,target=dropTarget(before,id,before.points[id],d.base);let to;
        if(target!==null){const original=M.groupOf(d.base,id),returning=original.includes(target),destination=returning?original:M.groupOf(before,target),positions=returning?d.base:before,center=[0,1].map(k=>destination.reduce((sum,x)=>sum+positions.points[x][k],0)/destination.length),grouped=M.regroup(before,id,target);to=G.nearestPlacement(grouped,M.groupOf(grouped,id),center);}
        else to=G.nearestPlacement(before,[id],before.points[id]);
        floating=null;hover=null;if(to)appendMotion(to);else s=d.original;
      }else if(s.record.length===1)s=d.original;
    },
    cancel(d){s=d.original;selected=d.oldSelected;floating=null;hover=null;},
    escape(){selected=null;floating=null;hover=null;}
  });
  view.start();
})();
