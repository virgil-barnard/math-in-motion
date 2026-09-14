// Static vector inspection of emitted CSS plane transforms; not a browser render.
const fs=require('node:fs'),path=require('node:path'),{boot}=require('../tests/harness.cjs');
function render(name,{seed=2,progress=0,w=736,h=500,yaw=-.52,pitch=.75}={}){
  const app=boot('fold',{w,h,embedded:true});app.restore({version:1,seed,progress,yaw,pitch});
  const planes=app.document.getElementById('fold-world').children.map(el=>{
    const m=el.style.transform.slice(9,-1).split(',').map(Number),s=parseFloat(el.style.width),rgb=el.style.background.match(/rgb\(([^)]+)\)/)[1];
    return{el,m,s,rgb,depth:m[14]+s*(m[2]+m[6])/2};
  }).sort((a,b)=>a.depth-b.depth);
  let defs='',body='';for(const {el,m,s,rgb} of planes){
    const id=el.dataset.face;defs+=`<linearGradient id="face-${id}" x2=".9" y2="1"><stop stop-color="rgb(${rgb})"/><stop offset="1" stop-color="rgb(${rgb.split(',').map(x=>Math.round(x*.8)).join(',')})"/></linearGradient>`;
    const art=el.innerHTML.replace('<svg ',`<svg x="${s*.36}" y="${s*.36}" width="${s*.28}" height="${s*.28}" `);
    body+=`<g transform="matrix(${m[0]} ${m[1]} ${m[4]} ${m[5]} ${m[12]} ${m[13]})"><rect width="${s}" height="${s}" fill="url(#face-${id})" stroke="${el.style.borderColor.slice(0,7)}" stroke-opacity=".6"/>${art}</g>`;
  }
  for(const key of ['fold-grip','camera-home']){const b=app.object(key),x=parseFloat(b.style.left),y=parseFloat(b.style.top);body+=b.innerHTML.replace('<svg ',`<svg x="${x-22}" y="${y-22}" width="44" height="44" `);}
  fs.writeFileSync(path.join(__dirname,'scenes',`${name}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><radialGradient id="back"><stop stop-color="#142938"/><stop offset="1" stop-color="#0a1420"/></radialGradient>${defs}</defs><rect width="100%" height="100%" fill="url(#back)"/>${body}</svg>`);
}
render('fold-hinge',{seed:0,progress:.6});render('fold-net');render('fold-half',{progress:.5});render('fold-cube',{progress:1});render('fold-narrow',{progress:.8,w:320,h:400});
