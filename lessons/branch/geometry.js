/* Pixel geometry for a triangular lattice of repeated equal steps. */
const BranchGeometry = (() => {
  function layout(n,w,h){const dx=Math.min(120,(w-80)/(2*n)),dy=Math.min(180,(h-136)/n),top=h*.46-dy*n/2;return{n,w,h,dx,dy,point:(row,slot)=>({x:w/2+(2*slot-row)*dx,y:top+row*dy})};}
  function point(a,b,t){const q=1-t;return{x:a.x+(b.x-a.x)*(3*t*t-2*t*t*t),y:a.y*q*q*q+3*(a.y+(b.y-a.y)*.44)*q*q*t+3*(b.y-(b.y-a.y)*.44)*q*t*t+b.y*t*t*t};}
  const edge=(a,b)=>`M${a.x} ${a.y}C${a.x} ${a.y+(b.y-a.y)*.44} ${b.x} ${b.y-(b.y-a.y)*.44} ${b.x} ${b.y}`;
  function positions(route,g){let k=0;return[g.point(0,0),...route.map((side,i)=>g.point(i+1,k+=side))];}
  function traveler(route,progress,g){const ps=positions(route,g),step=Math.min(route.length,progress*g.n),i=Math.min(route.length,Math.floor(step));return i===route.length?ps[i]:point(ps[i],ps[i+1],step-i);}
  function trace(route,progress,g){const ps=positions(route,g),steps=Math.min(route.length,progress*g.n);let d=`M${ps[0].x} ${ps[0].y}`;for(let i=0;i<Math.ceil(steps);i++){const end=Math.min(1,steps-i);for(let j=1;j<=24;j++){const p=point(ps[i],ps[i+1],end*j/24);d+=`L${p.x} ${p.y}`;}}return d;}
  function nearest(a,b,p){const score=t=>{const q=point(a,b,t);return(q.x-p.x)**2+(q.y-p.y)**2;};let best=0,value=Infinity;for(let i=0;i<=32;i++){const t=i/32,v=score(t);if(v<value){best=t;value=v;}}let lo=Math.max(0,best-1/32),hi=Math.min(1,best+1/32);for(let i=0;i<20;i++){const l=lo+(hi-lo)/3,r=hi-(hi-lo)/3;if(score(l)<score(r))hi=r;else lo=l;}let t=(lo+hi)/2;for(const end of [0,1])if(score(end)<score(t))t=end;return{t,distance:score(t)};}
  function along(route,p,g){const ps=positions(route,g);let best={progress:0,distance:Infinity};for(let i=0;i<route.length;i++){const q=nearest(ps[i],ps[i+1],p);if(q.distance<best.distance)best={progress:(i+q.t)/g.n,distance:q.distance};}return best.progress;}
  return{layout,point,edge,positions,traveler,trace,nearest,along};
})();
if(typeof module!=='undefined')module.exports=BranchGeometry;
