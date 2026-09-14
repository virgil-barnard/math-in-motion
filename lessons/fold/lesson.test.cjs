const assert=require('node:assert/strict'),M=require('./model.js');let checks=0;
const near=(a,b,e=1e-9)=>{assert(Math.abs(a-b)<e,`${a} != ${b}`);checks++;};
const same=(a,b)=>a.forEach((x,i)=>near(x,b[i]));
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
for(let seed=0;seed<3;seed++)for(let step=0;step<=100;step++){
  const faces=M.pose(seed,step/100),root=faces[0].vertices,north=faces[1].vertices;
  for(const {vertices:v} of faces){
    for(let i=0;i<4;i++)near(distance(v[i],v[(i+1)%4]),1);
    near(distance(v[0],v[2]),Math.SQRT2);near(distance(v[1],v[3]),Math.SQRT2);
    const u=M.sub(v[1],v[0]),w=M.sub(v[3],v[0]),n=M.cross(u,w);
    near(Math.hypot(...n),1);near(M.dot(n,M.sub(v[2],v[0])),0);
  }
  same(root[2],north[1]);same(root[3],north[0]);
  if(seed>0){same(root[1],faces[2].vertices[0]);same(root[2],faces[2].vertices[3]);same(root[0],faces[3].vertices[3]);same(root[1],faces[3].vertices[2]);same(root[3],faces[4].vertices[2]);same(root[0],faces[4].vertices[1]);}
  if(seed===2){same(north[3],faces[5].vertices[0]);same(north[2],faces[5].vertices[1]);if(step>=62)for(const p of faces[5].vertices){assert(p[2]>=1-1e-12);checks++;}}
}
const coord=p=>p.map(x=>Math.round(x*2)).join(','),closed=M.pose(2,1),vertices=new Set(),edges=new Map();
for(const {vertices:vs} of closed)vs.forEach((p,i)=>{vertices.add(coord(p));const key=[coord(p),coord(vs[(i+1)%4])].sort().join('|');edges.set(key,(edges.get(key)||0)+1);assert(Math.abs(p[0])<=.5+1e-10&&Math.abs(p[1])<=.5+1e-10&&p[2]>=-1e-10&&p[2]<=1+1e-10);checks++;});
near(vertices.size,8);near(edges.size,12);near(closed.length,6);near(vertices.size-edges.size+closed.length,2);for(const count of edges.values())near(count,2);
const flat=M.pose(2,0);for(const {vertices:v} of flat)for(const p of v)near(p[2],0);near(new Set(flat.map(f=>f.vertices.reduce((sum,p)=>sum+p[0]/4,0)+','+f.vertices.reduce((sum,p)=>sum+p[1]/4,0))).size,6);
// Independently apply the emitted CSS matrix to each local square corner.
for(const w of [260,320,736])for(const yaw of [-2,-.52,.8])for(const pitch of [.15,.75,1.4])for(let seed=0;seed<3;seed++){
  const h=w<620?400:500,s={...M.create(seed),yaw,pitch},fit=M.frame(seed,yaw,pitch,w,h);
  for(const p of [0,.15,.4,.62,.8,1]){
    s.progress=p;
    for(const face of M.pose(seed,p)){
      const mat=M.cssMatrix(face,s,fit),local=[[0,0],[fit.scale,0],[fit.scale,fit.scale],[0,fit.scale]];
      local.forEach(([x,y],i)=>{const q=M.project(face.vertices[i],s,fit);near(mat[0]*x+mat[4]*y+mat[12],q.x);near(mat[1]*x+mat[5]*y+mat[13],q.y);near(mat[2]*x+mat[6]*y+mat[14],q.z);assert(q.x>24&&q.x<w-24&&q.y>24&&q.y<h*.87);checks++;});
    }
    const target=M.project(M.grip(seed,p),s,fit),phase=M.nearestPhase(seed,{...s,progress:.3},fit,target),actual=M.project(M.grip(seed,phase),s,fit);
    assert(Math.hypot(target.x-actual.x,target.y-actual.y)<.1);checks++;
  }
}
for(const bad of [null,{}, {...M.create(),progress:Infinity},{...M.create(),pitch:0},{...M.create(),yaw:NaN}]){assert.deepEqual(M.restore(bad),M.create());checks++;}
console.log(JSON.stringify({lesson:'fold',checks,passed:true}));
