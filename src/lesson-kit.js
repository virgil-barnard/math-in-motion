/* Small optional author kit. Lessons own models, state, geometry, and gestures. */
const MotionKit = (() => {
  const C = ['#eedbb6','#83d6d1','#b7a4e8','#d8a78b'];
  const shapes = ['circle','square','triangle','diamond'];
  const clamp = (x,a=0,b=1) => Math.max(a,Math.min(b,x));
  const smooth = x => x*x*(3-2*x);
  const f = x => Number(x).toFixed(3);
  const svg = body => `<svg viewBox="0 0 48 48" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  function shape(kind,x,y,r,color=C[0],filled=true,opacity=1) {
    const a=`fill="${filled?color:'none'}" stroke="${color}" stroke-width="${filled?.7:1.2}" opacity="${opacity}" stroke-linejoin="round"`;
    if(kind==='circle')return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" ${a}/>`;
    if(kind==='square')return `<rect x="${f(x-r)}" y="${f(y-r)}" width="${2*r}" height="${2*r}" rx="2.5" ${a}/>`;
    if(kind==='triangle')return `<path d="M${f(x)} ${f(y-r*1.15)}L${f(x+r)} ${f(y+r*.8)}L${f(x-r)} ${f(y+r*.8)}Z" ${a}/>`;
    return `<path d="M${f(x)} ${f(y-r*1.2)}L${f(x+r)} ${f(y)}L${f(x)} ${f(y+r*1.2)}L${f(x-r)} ${f(y)}Z" ${a}/>`;
  }
  const icons={
    play:svg('<path d="m18 10 20 14-20 14Z" fill="currentColor"/>'),
    pause:svg('<path d="M18 12v24M30 12v24" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'),
    rewind:svg('<path d="M12 12a16 16 0 1 1-3 20M12 3v11H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    example:svg('<rect x="5" y="5" width="27" height="27" rx="8" fill="none" stroke="currentColor" opacity=".45"/><rect x="16" y="16" width="27" height="27" rx="8" fill="#102230" stroke="currentColor"/><circle cx="24" cy="24" r="2" fill="currentColor"/><circle cx="35" cy="35" r="2" fill="currentColor"/>'),
    silent:svg('<path d="M7 18h7l10-8v28l-10-8H7ZM33 18l10 12M43 18 33 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'),
    sound:svg('<path d="M7 18h7l10-8v28l-10-8H7ZM32 17q7 7 0 14M38 10q13 14 0 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>')
  };
  function create(spec) {
    const $=id=>document.getElementById(id);
    const stage=$('stage'),scene=$('scene'),objects=$('objects'),range=$('timeline'),play=$('play');
    let w=640,h=500,frame=0,animation=null,drag=null,suppress=null,lastStatus='';
    let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let audio=null,enabled=false;
    const buttons=new Map();
    $('lesson-title').textContent=spec.title;
    $('lesson-description').textContent=spec.description;
    $('lesson-glyph').innerHTML=spec.glyph;
    $('rewind').innerHTML=icons.rewind;$('example').innerHTML=icons.example;$('sound').innerHTML=icons.silent;
    function announce(text) {if(text!==lastStatus){$('status').textContent=text;lastStatus=text;}}
    function stop(){animation=null;cancelAnimationFrame(frame);frame=0;play.innerHTML=icons.play;play.setAttribute('aria-label','Play the transformation');}
    function paint(body,items=[]) {
      scene.innerHTML=body;
      const seen=new Set();
      for(const item of items){
        seen.add(item.key);let b=buttons.get(item.key);
        if(!b){b=document.createElement('button');b.type='button';b.dataset.key=item.key;objects.appendChild(b);buttons.set(item.key,b);}
        b.className=`piece ${item.kind||'token'}${drag?.key===item.key?' dragging':''}`;
        b.style.left=`${item.x}px`;b.style.top=`${item.y}px`;
        b.setAttribute('aria-label',item.label);
        if(item.selected!==undefined)b.setAttribute('aria-pressed',String(item.selected));
        const art=item.art??svg(shape(item.shape||'circle',24,24,11,item.color||C[0]));
        if(b.dataset.art!==art){b.innerHTML=art;b.dataset.art=art;}
      }
      for(const [key,b] of buttons)if(!seen.has(key)){b.remove();buttons.delete(key);}
    }
    function render(){spec.render(api);const progress=clamp(spec.progress());range.value=String(progress*1000);range.style.setProperty('--progress',`${progress*100}%`);range.setAttribute('aria-valuetext',spec.describe());}
    function changed(){announce(spec.describe());MotionBridge.changed();}
    function tone(index=0){
      if(!enabled||!audio)return;
      const time=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();
      osc.frequency.value=[261.63,329.63,392,523.25][Math.abs(index)%4];
      gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.045,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+.38);
      osc.connect(gain);gain.connect(audio.destination);osc.start(time);osc.stop(time+.4);osc.onended=()=>{osc.disconnect();gain.disconnect();};
    }
    function tween(from,to,setter,duration=600,after=null){
      stop();
      if(reduced||Math.abs(to-from)<1e-8){setter(to);render();after?.();changed();return;}
      animation={from,to,setter,start:performance.now(),duration,after};
      play.innerHTML=icons.pause;play.setAttribute('aria-label','Pause the transformation');
      const tick=now=>{
        if(!animation)return;const a=animation,t=clamp((now-a.start)/a.duration);
        a.setter(t===1?a.to:a.from+(a.to-a.from)*smooth(t));render();
        if(t===1){stop();a.after?.();changed();}else frame=requestAnimationFrame(tick);
      };frame=requestAnimationFrame(tick);
    }
    function cancelDrag(){if(!drag)return;const old=drag;drag=null;spec.cancel?.(old);try{old.button.releasePointerCapture(old.pointer);}catch{}render();}
    function point(event){const r=stage.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top};}
    objects.addEventListener('pointerdown',event=>{
      const button=event.target.closest('button[data-key]');if(!button||drag||event.button!==0)return;
      stop();suppress=null;const p=point(event),key=button.dataset.key;
      const detail=spec.down?.(key,p);if(!detail)return;
      drag={...detail,key,button,pointer:event.pointerId,start:p,moved:false};
      button.setPointerCapture(event.pointerId);render();
    });
    objects.addEventListener('pointermove',event=>{
      if(!drag||drag.pointer!==event.pointerId)return;const p=point(event);
      if(!drag.moved&&Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<3)return;
      drag.moved=true;spec.move?.(drag,p);render();
    });
    objects.addEventListener('pointerup',event=>{
      if(!drag||drag.pointer!==event.pointerId)return;const ended=drag;drag=null;
      try{ended.button.releasePointerCapture(ended.pointer);}catch{}
      if(ended.moved){suppress=ended.key;spec.up?.(ended,point(event));render();changed();MotionBridge.explored();}
    });
    for(const name of ['pointercancel','lostpointercapture'])objects.addEventListener(name,event=>{if(drag?.pointer===event.pointerId){cancelDrag();changed();}});
    objects.addEventListener('click',event=>{
      const button=event.target.closest('button[data-key]');if(!button)return;
      if(event.detail>0&&suppress===button.dataset.key){suppress=null;return;}
      suppress=null;stop();spec.activate?.(button.dataset.key);render();changed();MotionBridge.explored();
    });
    objects.addEventListener('keydown',event=>{
      const button=event.target.closest('button[data-key]');if(!button||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      if(spec.nudge){event.preventDefault();cancelDrag();stop();spec.nudge(button.dataset.key,['ArrowRight','ArrowUp'].includes(event.key)?1:-1,event.key);render();changed();}
    });
    play.addEventListener('click',()=>{cancelDrag();if(animation){stop();changed();return;}spec.play();render();MotionBridge.explored();});
    $('rewind').addEventListener('click',()=>{cancelDrag();stop();spec.rewind();render();changed();});
    $('example').addEventListener('click',()=>{cancelDrag();stop();spec.example();render();changed();tone(2);});
    range.addEventListener('input',()=>{const p=Number(range.value)/1000;cancelDrag();stop();spec.scrub(p);render();});
    range.addEventListener('change',()=>{spec.settle?.();render();changed();MotionBridge.explored();});
    range.addEventListener('keydown',event=>{
      if(!spec.step||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();cancelDrag();stop();spec.step(['ArrowRight','ArrowUp'].includes(event.key)?1:-1);render();changed();
    });
    $('sound').addEventListener('click',async()=>{
      if(enabled){enabled=false;audio?.suspend();}else{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio){announce('Optional sound is unavailable.');return;}try{audio||=new Audio();await audio.resume();enabled=true;tone(0);}catch{announce('Optional sound could not start.');return;}}
      $('sound').setAttribute('aria-pressed',String(enabled));$('sound').setAttribute('aria-label',enabled?'Mute optional sound':'Enable optional sound');$('sound').innerHTML=icons[enabled?'sound':'silent'];
    });
    function pause(){cancelDrag();stop();if(enabled){enabled=false;audio?.suspend();$('sound').innerHTML=icons.silent;$('sound').setAttribute('aria-pressed','false');$('sound').setAttribute('aria-label','Enable optional sound');}}
    function resize(){cancelDrag();const r=stage.getBoundingClientRect();w=Math.max(260,r.width);h=Math.max(370,r.height);scene.setAttribute('viewBox',`0 0 ${w} ${h}`);render();}
    const api={get w(){return w;},get h(){return h;},get reduced(){return reduced;},paint,render,tween,stop,changed,tone,announce,
      examples(index,count){$('example-progress').innerHTML=Array.from({length:count},(_,i)=>`<span class="example-dot${i===index?' active':''}"></span>`).join('');},
      start(){stop();new ResizeObserver(resize).observe(stage);resize();MotionBridge.connect({snapshot:spec.snapshot,restore(value){pause();spec.restore(value);render();},pause});}
    };
    document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();changed();}});
    window.addEventListener('keydown',event=>{if(event.key==='Escape'){cancelDrag();stop();spec.escape?.();render();changed();}});
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{reduced=event.matches;if(reduced){pause();spec.settle?.();render();changed();}});
    return api;
  }
  return {C,shapes,clamp,smooth,f,svg,shape,create};
})();
