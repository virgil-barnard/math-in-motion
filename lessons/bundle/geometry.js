/* Renderer-independent board geometry. The normalized board reserves room
   for 48-pixel controls even at the smallest supported stage. */
const BundleGeometry=(()=>{
  const PAD=.18,GAP=.045,STEP=.34,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  function board(w,h){const width=Math.min(400,w-80),height=Math.min(350,h-128);return{x:(w-width)/2,y:(h-height)/2,w:width,h:height};}
  const pixel=(p,b)=>({x:b.x+p[0]*b.w,y:b.y+p[1]*b.h});
  const point=(p,b)=>[clamp((p.x-b.x)/b.w),clamp((p.y-b.y)/b.h)];
  function bounds(frame,group,pad=PAD){
    const xs=group.map(id=>frame.points[id][0]),ys=group.map(id=>frame.points[id][1]);
    return{l:Math.min(...xs)-pad,r:Math.max(...xs)+pad,t:Math.min(...ys)-pad,b:Math.max(...ys)+pad};
  }
  function capsule(frame,group,b){
    const r=bounds(frame,group,0),px=Math.min(38,b.w*PAD),py=Math.min(42,b.h*PAD);
    return{x:b.x+r.l*b.w-px,y:b.y+r.t*b.h-py,w:(r.r-r.l)*b.w+2*px,h:(r.b-r.t)*b.h+2*py};
  }
  const overlaps=(a,b,gap=GAP)=>a.l<b.r+gap&&a.r>b.l-gap&&a.t<b.b+gap&&a.b>b.t-gap;
  function separated(frame){
    return frame.groups.every((g,i)=>frame.groups.slice(i+1).every(h=>!overlaps(bounds(frame,g),bounds(frame,h))));
  }
  function shift(frame,group,dx,dy){
    const xs=group.map(id=>frame.points[id][0]),ys=group.map(id=>frame.points[id][1]);
    dx=clamp(dx,-Math.min(...xs),1-Math.max(...xs));dy=clamp(dy,-Math.min(...ys),1-Math.max(...ys));
    const a=bounds(frame,group);let limit=1;
    for(const other of frame.groups){
      if(other.some(id=>group.includes(id)))continue;
      const b=bounds(frame,other);
      // Inspection can stop while a loose object is approaching a group.
      // Existing overlap must not trap a newly grabbed unit at that point.
      if(overlaps(a,b))continue;
      const interval=(lo,hi,low,high,v)=>{
        if(Math.abs(v)<1e-12)return hi>low-GAP&&lo<high+GAP?[-Infinity,Infinity]:[Infinity,-Infinity];
        const p=(low-GAP-hi)/v,q=(high+GAP-lo)/v;return[Math.min(p,q),Math.max(p,q)];
      };
      const x=interval(a.l,a.r,b.l,b.r,dx),y=interval(a.t,a.b,b.t,b.b,dy);
      const enter=Math.max(x[0],y[0],0),leave=Math.min(x[1],y[1],1);
      if(enter<leave&&leave>0)limit=Math.min(limit,Math.max(0,enter-1e-8));
    }
    return[dx*limit,dy*limit];
  }
  function nearestPlacement(frame,group,wanted){
    const half=STEP*(group.length-1)/2;
    const others=frame.groups.filter(g=>!g.some(id=>group.includes(id)));
    const candidates=[[clamp(wanted[0],half,1-half),clamp(wanted[1])]];
    for(let iy=0;iy<=25;iy++)for(let ix=0;ix<=25;ix++)if(ix/25>=half&&ix/25<=1-half)candidates.push([ix/25,iy/25]);
    let best=null,distance=Infinity;
    for(const c of candidates){
      const r={l:c[0]-half-PAD,r:c[0]+half+PAD,t:c[1]-PAD,b:c[1]+PAD};
      if(others.some(g=>overlaps(r,bounds(frame,g))))continue;
      const d=(c[0]-wanted[0])**2+(c[1]-wanted[1])**2;
      if(d<distance){distance=d;best=c;}
    }
    if(!best)return null;
    const points=frame.points.map(p=>[...p]);
    [...group].sort((a,b)=>a-b).forEach((id,i)=>{points[id]=[best[0]+STEP*(i-(group.length-1)/2),best[1]];});
    return{points,groups:frame.groups.map(g=>[...g])};
  }
  function target(frame,id,p,b){
    let found=null,distance=Infinity;
    for(const group of frame.groups){
      if(group.includes(id))continue;
      const r=capsule(frame,group,b),q=pixel(p,b),extra=group.length===1?8:12;
      if(q.x<r.x-extra||q.x>r.x+r.w+extra||q.y<r.y-extra||q.y>r.y+r.h+extra)continue;
      const d=(q.x-r.x-r.w/2)**2+(q.y-r.y-r.h/2)**2;
      if(d<distance){distance=d;found=group[0];}
    }
    return found;
  }
  return{PAD,GAP,STEP,board,pixel,point,bounds,capsule,overlaps,separated,shift,nearestPlacement,target};
})();
if(typeof module!=='undefined')module.exports=BundleGeometry;
