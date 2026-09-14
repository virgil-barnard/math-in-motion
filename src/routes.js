/* Shared drawing primitive: recorded column-vector permutations, first then second. */
const MotionRoutes = (() => {
  const {f,shape,C,svg}=MotionKit;
  const xs=[.22,.5,.78];
  function lanes(chain,input){const out=[input];for(const p of chain)out.push(p[out.at(-1)]);return out;}
  function path(chain,input,box){
    const track=lanes(chain,input),{x,y,w,h}=box,n=chain.length;
    let d=`M${f(x+xs[input]*w)} ${f(y)}`;
    for(let i=0;i<n;i++){
      const y0=y+h*(i+.18)/n,y1=y+h*(i+.82)/n;
      const a=x+xs[track[i]]*w,b=x+xs[track[i+1]]*w;
      d+=`L${f(a)} ${f(y0)}C${f(a)} ${f(y0+(y1-y0)/3)} ${f(b)} ${f(y1-(y1-y0)/3)} ${f(b)} ${f(y1)}`;
    }
    return d+`L${f(x+xs[track.at(-1)]*w)} ${f(y+h)}`;
  }
  function point(chain,input,t,box){
    const track=lanes(chain,input),n=chain.length,p=MotionKit.clamp(t)*n,i=Math.min(n-1,Math.floor(p)),local=p-i;
    const q=MotionKit.smooth(MotionKit.clamp((local-.18)/.64));
    return{x:box.x+(xs[track[i]]+(xs[track[i+1]]-xs[track[i]])*q)*box.w,y:box.y+MotionKit.clamp(t)*box.h};
  }
  function card(perm){return svg(perm.map((_,i)=>`<path d="${path([perm],i,{x:0,y:5,w:48,h:38})}" fill="none" stroke="${C[i]}" stroke-width="1.2"/>`).join(''));}
  function drawing(chain,t,box,{ghosts=null,complete=false,radius=10}={}){
    let body='';
    chain.forEach((_,i)=>{const y=box.y+box.h*(i+.18)/chain.length,h=box.h*.64/chain.length;body+=`<rect x="${f(box.x+box.w*.07)}" y="${f(y-5)}" width="${f(box.w*.86)}" height="${f(h+10)}" rx="15" fill="${C[i%2+1]}" fill-opacity=".025" stroke="${C[i%2+1]}" stroke-opacity=".32"/>`;});
    for(let i=0;i<3;i++){
      body+=`<path d="${path(chain,i,box)}" fill="none" stroke="${C[i]}" stroke-width="1.3" stroke-opacity=".4"/>`;
      body+=`<circle cx="${f(box.x+xs[i]*box.w)}" cy="${f(box.y+box.h)}" r="${radius+7}" fill="none" stroke="${complete?C[1]:'#648896'}" stroke-opacity=".6"/>`;
      if(ghosts)body+=shape(MotionKit.shapes[ghosts[i]],box.x+xs[i]*box.w,box.y+box.h,radius+3,C[ghosts[i]],false,.4);
    }
    return body;
  }
  return{xs,lanes,path,point,card,drawing};
})();
