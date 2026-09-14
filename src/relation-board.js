/* Shared geometry only. Matrices consistently use destination rows, source columns. */
const RelationBoard = (() => {
  const K=MotionKit,{f,shape,svg,C}=K;
  function layout(w,h,n){
    const wide=w>=620,cell=wide?Math.min(52,(w*.46-16)/(n+1)):48;
    const size=(n+1)*cell,mx=wide?w*.73-size/2:(w-size)/2;
    const my=wide?h*.43-size/2:h*.44;
    return{wide,cell,mx,my,size,graph:{x:wide?0:16,y:wide?h*.08:8,w:wide?w*.47:w-32,h:wide?h*.69:h*.36},toolsY:h*.92};
  }
  const cellPoint=(g,row,col)=>({x:g.mx+(col+1.5)*g.cell,y:g.my+(row+1.5)*g.cell});
  const sourcePoint=(g,col)=>({x:g.mx+(col+1.5)*g.cell,y:g.my+g.cell*.5});
  const targetPoint=(g,row)=>({x:g.mx+g.cell*.5,y:g.my+(row+1.5)*g.cell});
  function headers(g,n){
    let body='';for(let i=0;i<n;i++){const a=sourcePoint(g,i),b=targetPoint(g,i);body+=shape(K.shapes[i],a.x,a.y,8,C[i])+shape(K.shapes[i],b.x,b.y,8,C[i]);}
    return body;
  }
  function ringNodes(box,n){
    const r=Math.min(box.w*.32,box.h*.28),cx=box.x+box.w/2,cy=box.y+box.h*.53;
    return Array.from({length:n},(_,i)=>{const a=-Math.PI/2+2*Math.PI*i/n;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};});
  }
  function edge(a,b,{loop=false,curved=false,directed=false}={}){
    let p0,p1,p2,p3;
    if(loop){p0={x:a.x-13,y:a.y-16};p1={x:a.x-60,y:a.y-76};p2={x:a.x+60,y:a.y-76};p3={x:a.x+13,y:a.y-16};}
    else{
      const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,bend=curved?25:0;
      p0={x:a.x+ux*22,y:a.y+uy*22};p3={x:b.x-ux*24,y:b.y-uy*24};
      p1={x:p0.x+(p3.x-p0.x)/3-uy*bend,y:p0.y+(p3.y-p0.y)/3+ux*bend};
      p2={x:p0.x+2*(p3.x-p0.x)/3-uy*bend,y:p0.y+2*(p3.y-p0.y)/3+ux*bend};
    }
    const path=`M${f(p0.x)} ${f(p0.y)}C${f(p1.x)} ${f(p1.y)} ${f(p2.x)} ${f(p2.y)} ${f(p3.x)} ${f(p3.y)}`;
    function point(t){const q=1-t;return{x:q*q*q*p0.x+3*q*q*t*p1.x+3*q*t*t*p2.x+t*t*t*p3.x,y:q*q*q*p0.y+3*q*q*t*p1.y+3*q*t*t*p2.y+t*t*t*p3.y};}
    let arrow='';if(directed){const near=point(.90),dx=p3.x-near.x,dy=p3.y-near.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;arrow=`M${f(p3.x)} ${f(p3.y)}L${f(p3.x-ux*9-uy*4)} ${f(p3.y-uy*9+ux*4)}L${f(p3.x-ux*9+uy*4)} ${f(p3.y-uy*9-ux*4)}Z`;}
    return{path,point,arrow};
  }
  function line(e,color=C[1],opacity=.5,width=1.5){return `<path d="${e.path}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${width}"/>${e.arrow?`<path d="${e.arrow}" fill="${color}" fill-opacity="${opacity}"/>`:''}`;}
  const bead=(p,color=C[0],r=4)=>`<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${r+4}" fill="${color}" fill-opacity=".09"/><circle cx="${f(p.x)}" cy="${f(p.y)}" r="${r}" fill="${color}"/>`;
  function matrixTrace(g,row,col,t){
    const a=sourcePoint(g,col),b=cellPoint(g,row,col),c=targetPoint(g,row),p=t<.5?{x:a.x,y:a.y+(b.y-a.y)*t*2}:{x:b.x+(c.x-b.x)*(t-.5)*2,y:b.y};
    return `<path d="M${f(a.x)} ${f(a.y)}V${f(b.y)}H${f(c.x)}" fill="none" stroke="${C[col]}" stroke-opacity=".28" stroke-width="1.4"/>`+bead(p,C[col],3.3);
  }
  function presence(on,color,selected=false){return svg(`<rect x="3" y="3" width="42" height="42" rx="8" fill="${color}" fill-opacity="${on?.11:.015}" stroke="${selected?'#eedbb6':'#648896'}" stroke-opacity="${selected?.8:.22}"/>${on?`<circle cx="24" cy="24" r="5" fill="${color}"/>`:''}`);}
  return{layout,cellPoint,sourcePoint,targetPoint,headers,ringNodes,edge,line,bead,matrixTrace,presence};
})();
