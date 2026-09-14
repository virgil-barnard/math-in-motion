(() => {
  let s=LessonModel.create();
  const set=p=>{s.progress=p;};
  const view=MotionKit.create({
    title:'Draft mechanism',description:'Author the intended discovery and accessible interactions.',
    glyph:MotionKit.svg(MotionKit.shape('circle',24,24,10)),progress:()=>s.progress,
    describe:()=>`Inspecting the draft at ${Math.round(s.progress*100)} percent.`,snapshot:()=>({...s}),restore:v=>{s=LessonModel.restore(v);},
    render(v){v.paint('',[{key:'seed',x:v.w*(.25+.5*s.progress),y:v.h*.45,shape:'circle',label:'Inspect this draft object'}]);},
    play(){view.tween(s.progress,s.progress===1?0:1,set,1000);},rewind(){view.tween(s.progress,0,set,500);},scrub:set,example(){s=LessonModel.create();}
  });view.start();
})();
