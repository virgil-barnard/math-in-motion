/* Rigid unit-square faces, rotated about exact shared edges. No physics engine. */
const FoldModel = (() => {
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const create=(seed=0)=>({version:1,seed,progress:0,yaw:-.52,pitch:.75});
  const sub=(a,b)=>a.map((x,i)=>x-b[i]);
  const add=(a,b)=>a.map((x,i)=>x+b[i]);
  const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function rotateX(p,hinge,a){const q=sub(p,hinge),c=Math.cos(a),s=Math.sin(a);return add([q[0],c*q[1]-s*q[2],s*q[1]+c*q[2]],hinge);}
  function rotateY(p,hinge,a){const q=sub(p,hinge),c=Math.cos(a),s=Math.sin(a);return add([c*q[0]+s*q[2],q[1],-s*q[0]+c*q[2]],hinge);}
  const square=(x,y)=>[[x-.5,y-.5,0],[x+.5,y-.5,0],[x+.5,y+.5,0],[x-.5,y+.5,0]];
  function pose(seed,progress){
    const which=seed%3,p=clamp(progress),a=(which===2?smooth(p/.62):smooth(p))*Math.PI/2,b=which===2?smooth((p-.62)/.38)*Math.PI/2:0;
    const faces=[{id:0,vertices:square(0,0)},{id:1,vertices:square(0,1).map(q=>rotateX(q,[0,.5,0],a))}];
    if(which>0){faces.push({id:2,vertices:square(1,0).map(q=>rotateY(q,[.5,0,0],-a))},{id:3,vertices:square(0,-1).map(q=>rotateX(q,[0,-.5,0],-a))},{id:4,vertices:square(-1,0).map(q=>rotateY(q,[-.5,0,0],a))});}
    if(which===2)faces.push({id:5,vertices:square(0,2).map(q=>rotateX(rotateX(q,[0,1.5,0],b),[0,.5,0],a))});
    return faces;
  }
  function grip(seed,progress){const v=pose(seed,progress).at(seed%3===2?-1:1).vertices;return v[2].map((x,i)=>(x+v[3][i])/2);}
  function camera(p,yaw,pitch){const c=Math.cos(yaw),s=Math.sin(yaw),y=s*p[0]+c*p[1];return[c*p[0]-s*p[1],-Math.sin(pitch)*y-Math.cos(pitch)*p[2],-Math.cos(pitch)*y+Math.sin(pitch)*p[2]];}
  function frame(seed,yaw,pitch,w,h){
    const xs=[],ys=[];for(let i=0;i<=80;i++)for(const face of pose(seed,i/80))for(const p of face.vertices){const q=camera(p,yaw,pitch);xs.push(q[0]);ys.push(q[1]);}
    const loX=Math.min(...xs),hiX=Math.max(...xs),loY=Math.min(...ys),hiY=Math.max(...ys);
    const scale=Math.min((w-76)/(hiX-loX),(h*.80-68)/(hiY-loY),150);
    return{scale,x:w/2-(loX+hiX)/2*scale,y:h*.43-(loY+hiY)/2*scale};
  }
  function project(p,s,fit){const q=camera(p,s.yaw,s.pitch);return{x:fit.x+q[0]*fit.scale,y:fit.y+q[1]*fit.scale,z:q[2]*fit.scale};}
  function cssMatrix(face,s,fit){
    const ps=face.vertices.map(p=>camera(p,s.yaw,s.pitch)),u=sub(ps[1],ps[0]),v=sub(ps[3],ps[0]),n=cross(u,v),o=project(face.vertices[0],s,fit);
    return[...u,0,...v,0,...n,0,o.x,o.y,o.z,1];
  }
  function nearestPhase(seed,s,fit,p){
    const score=t=>{const q=project(grip(seed,t),s,fit);return (q.x-p.x)**2+(q.y-p.y)**2+.03*(t-s.progress)**2;};
    let best=0,value=Infinity;for(let i=0;i<=160;i++){const t=i/160,v=score(t);if(v<value){best=t;value=v;}}
    let a=Math.max(0,best-1/160),b=Math.min(1,best+1/160);for(let i=0;i<16;i++){const l=a+(b-a)/3,r=b-(b-a)/3;if(score(l)<score(r))b=r;else a=l;}
    const mid=(a+b)/2;return score(0)<score(mid)?0:score(1)<score(mid)?1:mid;
  }
  function restore(v){return v?.version===1&&Number.isSafeInteger(v.seed)&&v.seed>=0&&Number.isFinite(v.progress)&&v.progress>=0&&v.progress<=1&&Number.isFinite(v.yaw)&&Math.abs(v.yaw)<1e6&&Number.isFinite(v.pitch)&&v.pitch>=.15&&v.pitch<=1.4?{version:1,seed:v.seed,progress:v.progress,yaw:v.yaw,pitch:v.pitch}:create();}
  return{clamp,create,sub,add,dot,cross,pose,grip,camera,frame,project,cssMatrix,nearestPhase,restore};
})();
if(typeof module!=='undefined')module.exports=FoldModel;
