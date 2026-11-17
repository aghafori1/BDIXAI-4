(() => {
  'use strict';
  const root = document.querySelector('.hb-visual');
  if (!root) return;
  document.querySelector('.hb-words')?.remove();
  const canvas = root.querySelector('.hb-network');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData === true;
  const palette = ['#55E2D4', '#287BFF', '#69B7FF', '#887CFF', '#7BEFE5'];
  const points = [
    [.18,.22], [.34,.13], [.68,.16], [.84,.30], [.91,.51], [.78,.76],
    [.57,.88], [.30,.80], [.11,.60], [.40,.39], [.64,.43], [.52,.66],
    [.28,.52], [.73,.57], [.50,.23], [.16,.42], [.87,.72], [.39,.69]
  ];
  const serviceFormationPoints=points.map((_,i)=>{
    const outerRing=i<9,index=i%9,radius=outerRing?.36:.20;
    const angle=-Math.PI/2+index*Math.PI*2/9+(outerRing?0:Math.PI/9);
    return [.5+Math.cos(angle)*radius,.5+Math.sin(angle)*radius];
  });
  const mix=(a,b,t)=>a+(b-a)*t;
  const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0],[0,9],[1,9],[2,14],[14,10],[10,3],[9,10],[9,12],[12,8],[10,13],[13,4],[13,11],[11,6],[11,17],[17,7],[13,16],[16,5],[12,15],[15,0],[9,17],[10,11]];
  let width=0,height=0,dpr=1,raf=0,last=0,visible=true,phase=0;
  let scrollEnergy=0,wakeEnergy=0,transitionEnergy=0,transitionAge=1200,wakeAge=1200,flowProgress=0;
  let travelDirection=0,lastScrollY=window.scrollY,lastScrollAt=performance.now(),lastScrollMotionAt=0,motionState='';
  const pointer={x:0,y:0,targetX:0,targetY:0,strength:0,targetStrength:0};
  let identityProgress=0,servicesProgress=0,servicesCoreActive=false;
  let servicesVisualScale=1,servicesNetworkScale=1,servicesLayoutProgress=0,servicesBurst=0,servicesWaveProgress=0,servicesOrbitScale=1;
  const core=root.querySelector('.hb-core');
  const visualGlow=root.querySelector('.hb-visual-glow');
  const orbitNodes=[...root.querySelectorAll('.hb-node')];
  const orbitConfig=orbitNodes.map((node,i)=>({node,phase:-Math.PI/2+(Math.PI*2*i/Math.max(orbitNodes.length,1)),radiusX:1+([0,.035,-.025,.02,-.035][i]||0),radiusY:1+([0,-.025,.035,-.03,.02][i]||0)}));
  const clamp01=value=>Math.max(0,Math.min(1,value));
  const resize=()=>{
    const rect=root.getBoundingClientRect();
    width=Math.max(1,rect.width);height=Math.max(1,rect.height);dpr=Math.min(window.devicePixelRatio||1,saveData?1:1.7);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    draw(phase);
  };
  const positionGalaxyWords=(time)=>{
    if(!orbitConfig.length)return;
    const activity=reduce.matches?0:Math.max(scrollEnergy*.82,wakeEnergy*.72,transitionEnergy*.68,servicesBurst*.42);
    const orbitBreath=1+activity*.012;
    const rx=width*.335*servicesOrbitScale*orbitBreath,ry=height*.335*servicesOrbitScale*orbitBreath;
    orbitConfig.forEach(({node,phase:offset,radiusX,radiusY},i)=>{
      const lag=1+activity*(.004+(i%3)*.002);
      const angle=offset+time*.000038+travelDirection*activity*.009*(i%2?1:-1);
      const x=Math.cos(angle)*rx*radiusX*lag;
      const y=Math.sin(angle)*ry*radiusY*lag;
      // Keep every label readable; only a restrained tangential tilt follows the orbit.
      const tilt=Math.sin(angle+.35)*3.2+travelDirection*activity*.65;
      node.style.setProperty('--hb-orbit-x',`${x.toFixed(2)}px`);
      node.style.setProperty('--hb-orbit-y',`${y.toFixed(2)}px`);
      node.style.setProperty('--hb-orbit-tilt',`${tilt.toFixed(2)}deg`);
      node.style.setProperty('--hb-node-motion-scale',(1+activity*(.004+(i%2)*.003)).toFixed(3));
    });
  };
  const paintFlowPacket=(progress,alpha,radius,coords,curves)=>{
    const segment=progress*(links.length-1),index=Math.floor(segment),local=segment-index;
    const [a,b]=links[index]||links[0],p=coords[a],q=coords[b],control=curves[index]||curves[0];
    const inverse=1-local,x=inverse*inverse*p.x+2*inverse*local*control.x+local*local*q.x,y=inverse*inverse*p.y+2*inverse*local*control.y+local*local*q.y;
    const packet=ctx.createRadialGradient(x,y,0,x,y,radius);packet.addColorStop(0,'rgba(237,244,255,.95)');packet.addColorStop(.13,'rgba(85,226,212,.8)');packet.addColorStop(1,'rgba(85,226,212,0)');
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=packet;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();ctx.restore();
  };
  const draw=(time)=>{
    positionGalaxyWords(time);
    ctx.clearRect(0,0,width,height);
    const scale=Math.min(width,height), cx=width/2,cy=height/2;
    const reduced=reduce.matches;
    const compressionPulse=reduced?0:Math.exp(-Math.pow((transitionAge-155)/105,2))*transitionEnergy;
    const expansionPulse=reduced?0:Math.exp(-Math.pow((transitionAge-405)/205,2))*transitionEnergy;
    const transitionBurst=reduced?0:Math.exp(-Math.pow((transitionAge-440)/235,2))*transitionEnergy;
    const motionEnergy=reduced?0:clamp01(Math.max(scrollEnergy*.72,wakeEnergy*.66,transitionEnergy*.62,servicesBurst*.45));
    const visualBurst=Math.max(servicesBurst,transitionBurst*.72);
    root.style.setProperty('--hb-motion-energy',motionEnergy.toFixed(3));
    root.style.setProperty('--hb-motion-compress',compressionPulse.toFixed(3));
    root.style.setProperty('--hb-motion-burst',Math.max(expansionPulse,transitionBurst*.72).toFixed(3));
    root.style.setProperty('--hb-core-motion-scale',(1-compressionPulse*.05+expansionPulse*.03).toFixed(3));
    root.style.setProperty('--hb-orbit-scale-x',(1+travelDirection*motionEnergy*.008).toFixed(3));
    root.style.setProperty('--hb-orbit-scale-y',(1-travelDirection*motionEnergy*.008).toFixed(3));
    root.style.setProperty('--hb-glow-opacity',Math.min(.98,.9+motionEnergy*.045+transitionBurst*.035).toFixed(3));
    core?.style.setProperty('--hb-identity-core-brightness',(1+identityProgress*.12+motionEnergy*.08+transitionBurst*.13).toFixed(3));
    let nextMotionState='idle';
    if(!reduced){
      if(transitionEnergy>.12){
        nextMotionState=transitionAge<110?'wake':transitionAge<335?'morph':transitionAge<620?'burst':'settle';
      }else if(wakeAge<150&&wakeEnergy>.16)nextMotionState='wake';
      else if(scrollEnergy>.08)nextMotionState='flow';
      else if(wakeEnergy>.16)nextMotionState='wake';
    }
    if(nextMotionState!==motionState){motionState=nextMotionState;root.dataset.motionState=motionState}
    if(reduce.matches){pointer.strength=0;pointer.targetStrength=0}
    else{
      pointer.x+=(pointer.targetX-pointer.x)*.22;
      pointer.y+=(pointer.targetY-pointer.y)*.22;
      pointer.strength+=(pointer.targetStrength-pointer.strength)*.22;
    }
    const networkScale=(1+identityProgress*.13)*servicesNetworkScale*(1-compressionPulse*.035+expansionPulse*.028+scrollEnergy*.004);
    const coords=points.map(([x,y],i)=>{
      const [targetX,targetY]=serviceFormationPoints[i];
      const formedX=mix(x,targetX,servicesLayoutProgress),formedY=mix(y,targetY,servicesLayoutProgress);
      return {x:cx+(formedX-.5)*scale*.92*networkScale,y:cy+(formedY-.5)*scale*.92*networkScale,i};
    });
    // soft radial field behind the connected network
    const glow=ctx.createRadialGradient(cx,cy,scale*.04,cx,cy,scale*.49);
    glow.addColorStop(0,`rgba(40,123,255,${(.195+identityProgress*.06+servicesBurst*.13+motionEnergy*.045).toFixed(3)})`);glow.addColorStop(.55,`rgba(85,226,212,${(.073+identityProgress*.02+servicesBurst*.045+motionEnergy*.025).toFixed(3)})`);glow.addColorStop(1,'rgba(6,11,20,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    if(visualBurst>.035){
      const waveProgress=Math.max(servicesWaveProgress,clamp01(transitionAge/720));
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,scale*(.07+waveProgress*.39),0,Math.PI*2);
      ctx.strokeStyle=`rgba(123,239,229,${(visualBurst*.28).toFixed(3)})`;ctx.lineWidth=1+visualBurst*1.2;
      ctx.shadowBlur=scale*.014*visualBurst;ctx.shadowColor='#55E2D4';ctx.stroke();ctx.restore();
    }
    const curves=links.map(([a,b],i)=>{
      const p=coords[a],q=coords[b];
      const dx=q.x-p.x,dy=q.y-p.y,length=Math.hypot(dx,dy)||1;
      const normalX=-dy/length,normalY=dx/length;
      const bend=Math.sin((i+1)*2.399963)*scale*(.045+identityProgress*.02-servicesProgress*.012+servicesBurst*.012+motionEnergy*.006);
      let controlX=(p.x+q.x)/2+normalX*bend+travelDirection*scrollEnergy*scale*.003;
      let controlY=(p.y+q.y)/2+normalY*bend+scrollEnergy*scale*.002;
      if(pointer.strength>.001){
        const lengthSquared=dx*dx+dy*dy||1;
        const t=Math.max(0,Math.min(1,((pointer.x-p.x)*dx+(pointer.y-p.y)*dy)/lengthSquared));
        const nearX=p.x+dx*t,nearY=p.y+dy*t;
        const awayX=nearX-pointer.x,awayY=nearY-pointer.y;
        const distance=Math.hypot(awayX,awayY);
        const radius=Math.max(18,scale*.31);
        const falloff=Math.exp(-.5*(distance/radius)**2);
        const centreWeight=.55+.45*(1-Math.min(1,Math.abs(t-.5)*2));
        const pull=scale*.10*falloff*centreWeight*pointer.strength;
        const directionX=distance>1?awayX/distance:normalX;
        const directionY=distance>1?awayY/distance:normalY;
        controlX+=directionX*pull;
        controlY+=directionY*pull;
      }
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(controlX,controlY,q.x,q.y);
      const featured=i%4===0;
      const opacity=(featured?.39:.24)+identityProgress*(featured?.12:.07)+servicesBurst*(featured?.11:.065)+motionEnergy*(featured?.035:.022);
      ctx.strokeStyle=featured?`rgba(85,226,212,${opacity.toFixed(3)})`:`rgba(105,183,255,${opacity.toFixed(3)})`;
      ctx.lineWidth=(featured?1.53:1.02)+identityProgress*(featured?.2:.12)+servicesBurst*(featured?.38:.24)+motionEnergy*(featured?.16:.1);
      ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=scale*(featured?.009:.005);ctx.shadowColor=featured?'rgba(85,226,212,.62)':'rgba(105,183,255,.36)';ctx.stroke();ctx.shadowBlur=0;
      return {x:controlX,y:controlY};
    });
    coords.forEach((p,i)=>{
      const pulse=(Math.sin(time*.0008+i*1.7)+1)/2;
      const r=((i%5===0?2.5:1.35)+pulse*(i%5===0?1.4:.7))*(1+servicesBurst*.22+motionEnergy*.07);
      ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fillStyle=palette[i%palette.length];ctx.globalAlpha=Math.min(.98,.52+pulse*.38+motionEnergy*.04);ctx.shadowBlur=i%5===0?12:5;ctx.shadowColor=palette[i%palette.length];ctx.fill();ctx.globalAlpha=1;ctx.shadowBlur=0;
    });
    // A bright packet travels through the nodes, symbolising a lead moving through the BDIX system.
    paintFlowPacket(flowProgress,1,scale*(.045+motionEnergy*.006),coords,curves);
    const servicePacketAlpha=Math.min(.58,servicesProgress*.28+servicesBurst*.32);
    if(servicePacketAlpha>.001)paintFlowPacket((flowProgress+.47)%1,servicePacketAlpha,scale*(.034+servicesBurst*.015),coords,curves);
    const travelPacketAlpha=Math.min(.38,scrollEnergy*.22+transitionBurst*.32);
    if(travelPacketAlpha>.035)paintFlowPacket((flowProgress+.23)%1,travelPacketAlpha,scale*(.022+motionEnergy*.01),coords,curves);
  };
  const frame=(now)=>{
    raf=0;if(!visible||document.hidden||reduce.matches)return;
    if(!last)last=now;
    if(now-last<32){raf=requestAnimationFrame(frame);return}
    const delta=Math.min(now-last,48);last=now;phase+=delta;
    scrollEnergy*=Math.exp(-delta/310);wakeEnergy*=Math.exp(-delta/270);transitionEnergy*=Math.exp(-delta/760);
    transitionAge=Math.min(1600,transitionAge+delta);wakeAge=Math.min(1600,wakeAge+delta);
    flowProgress=(flowProgress+delta*(.000055+scrollEnergy*.00009+wakeEnergy*.000045+transitionEnergy*.000035))%1;
    draw(phase);raf=requestAnimationFrame(frame);
  };
  const start=()=>{if(reduce.matches||!visible||document.hidden){draw(phase);return;}last=0;if(!raf)raf=requestAnimationFrame(frame)};
  const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;last=0;};
  const setPointerFromEvent=event=>{
    if(event.pointerType&&event.pointerType!=='mouse'){pointer.targetStrength=0;return}
    if(reduce.matches){pointer.targetStrength=0;return}
    const rect=root.getBoundingClientRect();
    const inside=rect.width>0&&rect.height>0&&event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
    if(!inside){pointer.targetStrength=0;return}
    pointer.targetX=(event.clientX-rect.left)/rect.width*width;
    pointer.targetY=(event.clientY-rect.top)/rect.height*height;
    pointer.targetStrength=1;
  };
  window.addEventListener('pointermove',setPointerFromEvent,{passive:true});
  window.addEventListener('pointerout',event=>{if(event.relatedTarget===null)pointer.targetStrength=0},{passive:true});
  window.addEventListener('blur',()=>{pointer.targetStrength=0},{passive:true});
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)start();else{pointer.targetStrength=0;stop()}},{threshold:.05});observer.observe(root);
  const ro=new ResizeObserver(resize);ro.observe(root);resize();
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  reduce.addEventListener?.('change',()=>{if(reduce.matches){stop();draw(phase)}else start()});
  const labels={
    ar:{strategy:'الاستراتيجية',experience:'التجربة',intelligence:'الذكاء الاصطناعي',execution:'التنفيذ',growth:'النمو',system:'منظومة نمو مترابطة'},
    fa:{strategy:'استراتژی',experience:'تجربه',intelligence:'هوش مصنوعی',execution:'اجرا',growth:'رشد',system:'یک سامانه یکپارچه رشد'},
    en:{strategy:'STRATEGY',experience:'EXPERIENCE',intelligence:'AI',execution:'EXECUTION',growth:'GROWTH',system:'ONE CONNECTED GROWTH SYSTEM'}
  };
  const coreWords={ar:'النمو',fa:'رشد',en:'GROWTH'};
  const descriptions={ar:'منظومة BDIX AI المترابطة: الاستراتيجية والتجربة والذكاء الاصطناعي والتنفيذ والنمو',fa:'سامانه یکپارچه BDIX AI: استراتژی، تجربه، هوش مصنوعی، اجرا و رشد',en:'The connected BDIX AI system: strategy, experience, AI, execution and growth'};
  const storyCopy={
    ar:{strategy:'الاستراتيجية: فهم الأعمال وتحديد الاتجاه قبل اختيار التقنية',experience:'التجربة: نماذج وأعمال توضّح كيف تتحول الفكرة إلى تجربة رقمية',intelligence:'الذكاء: خدمات الويب والذكاء الاصطناعي التي تشكّل قدرات BDIX AI',execution:'التنفيذ: منهج واضح من التشخيص إلى البناء والتحسين',growth:'النمو: رؤية BDIX AI والنتيجة التي نبني المنظومة من أجلها'},
    fa:{strategy:'استراتژی: شناخت کسب‌وکار و تعیین مسیر پیش از انتخاب فناوری',experience:'تجربه: نمونه‌ها و پروژه‌ها نشان می‌دهند ایده چگونه به تجربه دیجیتال تبدیل می‌شود',intelligence:'هوشمندی: خدمات وب و هوش مصنوعی که توانمندی‌های BDIX AI را می‌سازند',execution:'اجرا: مسیری روشن از تشخیص تا ساخت و بهبود',growth:'رشد: چشم‌انداز BDIX AI و نتیجه‌ای که این سامانه برای آن ساخته می‌شود'},
    en:{strategy:'Strategy: understand the business and set direction before choosing technology',experience:'Experience: see how ideas become useful digital experiences',intelligence:'Intelligence: the web and AI capabilities that power BDIX AI',execution:'Execution: a clear path from diagnosis to building and improvement',growth:'Growth: the BDIX AI vision and the outcome the system is built to create'}
  };
  const localize=()=>{const lang=(document.documentElement.lang||'ar').slice(0,2);const dict=labels[lang]||labels.en;root.querySelectorAll('[data-hb-label]').forEach(el=>{el.textContent=dict[el.dataset.hbLabel]||''});root.querySelectorAll('[data-story-key]').forEach(node=>{node.setAttribute('aria-label',dict[node.dataset.storyKey]||node.dataset.storyKey)});const word=root.querySelector('.hb-core-word');if(word){word.textContent=coreWords[lang]||coreWords.en;word.dir=lang==='en'?'ltr':'rtl'}root.setAttribute('aria-label',descriptions[lang]||descriptions.en)};
  new MutationObserver(()=>{localize();queueStoryRegion()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});localize();
  const continuum=root.closest('.story-continuum');
  const visualLayer=root.closest('.shared-visual-column');
  const heroSection=document.getElementById('hero-banner');
  const brandSection=document.getElementById('brand-universe');
  const serviceSection=document.getElementById('services');
  const serviceCards=serviceSection?[...serviceSection.querySelectorAll('.cards.portfolio-arc > .card')]:[];
  const serviceAnchor=serviceSection?.querySelector('.wrap>.sh');
  let serviceAnchorNaturalOffset=null;
  const storySequence=[
    {element:heroSection,key:'hero'},
    {element:brandSection,key:'brand-universe'},
    {element:document.getElementById('top'),key:'top'},
    {element:serviceSection,key:'services'},
    {element:document.getElementById('work'),key:'work'},
    {element:document.getElementById('process'),key:'process'},
    {element:document.getElementById('about'),key:'about'},
    {element:document.getElementById('cinema-final'),key:'cinema-final'},
    {element:document.querySelector('.site-footer'),key:'footer'}
  ].filter(item=>item.element);
  const initialVisualRect=root.getBoundingClientRect();
  const initialDirection=getComputedStyle(document.documentElement).direction;
  const initialHomeRatio=initialVisualRect.width?((initialVisualRect.left+initialVisualRect.width/2)/Math.max(innerWidth,1)):.5;
  const initialHomeYRatio=initialVisualRect.height?((initialVisualRect.top+initialVisualRect.height/2)/Math.max(innerHeight,1)):.56;
  const initialVisualDocY=initialVisualRect.top+scrollY+initialVisualRect.height/2;
  const initialVisualWidth=initialVisualRect.width||576;
  let regionFrame=0,storyMotionReady=false,currentStoryRegion='';

  const compactStoryLayout=()=>matchMedia('(max-width: 900px)').matches;
  const servicesVisualAnchor=()=>{
    const compact=compactStoryLayout();
    const direction=getComputedStyle(document.documentElement).direction;
    const phone=innerWidth<=640;
    return {
      x:innerWidth*(compact?(direction==='rtl'?.36:.64):(direction==='rtl'?.38:.62)),
      y:innerHeight*(compact?(phone?.25:.42):.24),
      scale:compact?(phone?.70:.62):.58
    };
  };
  const syncServicesCoreMessage=region=>{
    const active=region==='services';
    if(active===servicesCoreActive)return;
    servicesCoreActive=active;
    core?.classList.toggle('is-marketing-word',active);
    const lang=(document.documentElement.lang||'ar').slice(0,2);
    core?.setAttribute('aria-label',active?(coreWords[lang]||coreWords.en):'BDIX AI');
  };
  const clearReducedMotionVisual=()=>{
    if(!continuum?.classList.contains('is-story-visual-static'))return;
    continuum.classList.remove('is-story-visual-static');
    ['--story-x','--story-y','--story-scale','--story-width'].forEach(name=>root.style.removeProperty(name));
    root.style.removeProperty('opacity');
  };
  const setReducedMotionVisual=region=>{
    if(!reduce.matches||region!=='services'||!continuum)return clearReducedMotionVisual();
    const anchor=servicesVisualAnchor();
    setStoryVisualSize();
    continuum.classList.add('is-story-visual-static');
    root.style.setProperty('--story-x',`${anchor.x.toFixed(2)}px`);
    root.style.setProperty('--story-y',`${anchor.y.toFixed(2)}px`);
    root.style.setProperty('--story-scale',anchor.scale.toFixed(3));
    root.style.opacity='1';
  };
  const storyBounds=()=>storySequence.map(item=>{
    const rect=item.element.getBoundingClientRect();
    return {...item,start:rect.top+scrollY,end:rect.bottom+scrollY,center:rect.top+scrollY+rect.height/2};
  });
  const homeStoryX=()=>{
    if(compactStoryLayout())return innerWidth*.5;
    const direction=getComputedStyle(document.documentElement).direction;
    const ratio=direction===initialDirection?initialHomeRatio:1-initialHomeRatio;
    return innerWidth*ratio;
  };
  const homeStoryY=()=>compactStoryLayout()?initialVisualDocY-scrollY:Math.min(innerHeight*.78,Math.max(96,innerHeight*initialHomeYRatio));
  const setStoryVisualSize=()=>{
    const compact=compactStoryLayout();
    const maxWidth=compact?Math.min(464,innerWidth*.94):Math.min(640,innerWidth*.46);
    root.style.setProperty('--story-width',`${Math.min(Math.max(initialVisualWidth,640),maxWidth)}px`);
  };
  const enableStoryMotion=()=>{
    if(storyMotionReady||!continuum||!visualLayer||reduce.matches)return;
    const rect=root.getBoundingClientRect();
    root.style.setProperty('--story-x',`${rect.left+rect.width/2}px`);
    root.style.setProperty('--story-y',`${rect.top+rect.height/2}px`);
    root.style.setProperty('--story-scale','1');
    root.style.opacity='1';
    setStoryVisualSize();
    continuum.classList.add('is-story-visual-ready');
    storyMotionReady=true;
  };
  const disableStoryMotion=()=>{
    if(!storyMotionReady)return;
    continuum?.classList.remove('is-story-visual-ready');
    root.classList.remove('is-story-travelling');
    ['--story-x','--story-y','--story-scale','--story-width'].forEach(name=>root.style.removeProperty(name));
    root.style.removeProperty('opacity');
    orbitNodes.forEach(node=>node.removeAttribute('tabindex'));
    storyMotionReady=false;
  };
  const smooth=(value)=>value*value*(3-2*value);
  const interpolate=(a,b,t)=>a+(b-a)*t;
  const brandIdentityProgress=(bounds,marker)=>{
    const brand=bounds.find(item=>item.key==='brand-universe');
    if(!brand)return 0;
    const vh=Math.max(1,innerHeight);
    const enterStart=brand.start-vh*.18;
    const enterEnd=Math.min(brand.end,brand.start+vh*.38);
    const leaveStart=Math.max(enterEnd,brand.end-vh*.38);
    const leaveEnd=brand.end+vh*.18;
    if(marker<=enterStart||marker>=leaveEnd)return 0;
    if(marker<enterEnd)return smooth((marker-enterStart)/Math.max(1,enterEnd-enterStart));
    if(marker<=leaveStart)return 1;
    return 1-smooth((marker-leaveStart)/Math.max(1,leaveEnd-leaveStart));
  };
  const servicesStoryProgress=(bounds,marker)=>{
    const services=bounds.find(item=>item.key==='services');
    if(!services)return 0;
    const vh=Math.max(1,innerHeight);
    const enterStart=services.start-vh*.18;
    const enterEnd=Math.min(services.end,services.start+vh*.38);
    const leaveStart=Math.max(enterEnd,services.end-vh*.38);
    const leaveEnd=services.end+vh*.18;
    if(marker<=enterStart||marker>=leaveEnd)return 0;
    if(marker<enterEnd)return smooth((marker-enterStart)/Math.max(1,enterEnd-enterStart));
    if(marker<=leaveStart)return 1;
    return 1-smooth((marker-leaveStart)/Math.max(1,leaveEnd-leaveStart));
  };
  const servicesCompositionProgress=(bounds,marker)=>{
    const services=bounds.find(item=>item.key==='services');
    if(!services)return 0;
    if(reduce.matches)return 1;
    const vh=Math.max(1,innerHeight);
    const sectionHeight=Math.max(1,services.end-services.start);
    const inset=Math.min(vh*.12,sectionHeight*.08);
    const start=services.start+inset;
    const end=Math.max(start+1,services.end-inset);
    return smooth(Math.max(0,Math.min(1,(marker-start)/(end-start))));
  };
  const updateServicesComposition=progress=>{
    const count=serviceCards.length;
    if(!count)return;
    const interval=1/count;
    const activeIndex=Math.min(count-1,Math.floor(Math.min(progress,.999999)*count));
    serviceCards.forEach((card,index)=>{
      const revealStart=index*interval;
      const revealDuration=interval*.72;
      const reveal=smooth(Math.max(0,Math.min(1,(progress-revealStart)/revealDuration)));
      const tone=index<activeIndex ? 0.93 : index===activeIndex ? 1 : 0.92;
      const entryProgress=reduce.matches?1:reveal;
      card.style.setProperty('--service-entry-progress',entryProgress.toFixed(3));
      card.style.setProperty('--service-entry-tone',tone.toFixed(2));
      card.style.setProperty('--service-opacity',(entryProgress*tone).toFixed(3));
      card.style.setProperty('--service-offset-y',`${((1-entryProgress)*30).toFixed(2)}px`);
      card.style.setProperty('--service-scale',(0.985+entryProgress*.015).toFixed(3));
    });
  };
  const updateServicesAnchor=bounds=>{
    const services=bounds.find(item=>item.key==='services');
    if(!serviceAnchor||!services)return;
    if(reduce.matches){
      serviceSection.classList.remove('is-services-anchor-pinned');
      serviceSection.style.removeProperty('--services-anchor-slot-height');
      serviceSection.style.removeProperty('--services-anchor-top');
      serviceAnchorNaturalOffset=null;
      return;
    }
    const pinned=serviceSection.classList.contains('is-services-anchor-pinned');
    if(!pinned)serviceAnchorNaturalOffset=serviceAnchor.getBoundingClientRect().top+scrollY-services.start;
    const naturalTop=services.start+(serviceAnchorNaturalOffset||0);
    const header=document.querySelector('header');
    const stickyTop=(header?.getBoundingClientRect().height||0)+14;
    const anchorHeight=serviceAnchor.offsetHeight;
    const maxOffset=Math.max(0,services.end-naturalTop-anchorHeight);
    const rawOffset=scrollY+stickyTop-naturalTop;
    const offset=Math.max(0,Math.min(maxOffset,rawOffset));
    const shouldPin=offset>1;
    if(shouldPin&&!pinned){
      serviceSection.style.setProperty('--services-anchor-slot-height',`${anchorHeight.toFixed(2)}px`);
    }
    serviceSection.classList.toggle('is-services-anchor-pinned',shouldPin);
    if(shouldPin){
      serviceSection.style.setProperty('--services-anchor-top',`${Math.min(stickyTop,services.end-anchorHeight-scrollY).toFixed(2)}px`);
    }else{
      serviceSection.style.removeProperty('--services-anchor-slot-height');
      serviceSection.style.removeProperty('--services-anchor-top');
      serviceAnchorNaturalOffset=null;
    }
  };
  const servicesStoryTransform=(bounds,marker,region)=>{
    const base={visual:1,network:1,layout:0,burst:0,wave:0,orbit:1};
    const services=bounds.find(item=>item.key==='services');
    if(!services)return base;
    if(reduce.matches)return region==='services'?{visual:1,network:1.02,layout:1,burst:0,wave:1,orbit:.90}:base;
    const vh=Math.max(1,innerHeight);
    const sectionHeight=Math.max(1,services.end-services.start);
    const ramp=(start,end)=>smooth(Math.max(0,Math.min(1,(marker-start)/Math.max(1,end-start))));
    const compressStart=services.start-Math.min(vh*.18,sectionHeight*.20);
    const compressEnd=services.start+Math.min(vh*.04,sectionHeight*.03);
    const burstEnd=services.start+Math.min(vh*.30,sectionHeight*.34);
    const formationEnd=services.start+Math.min(vh*.54,sectionHeight*.58);
    const exitStart=Math.max(formationEnd,services.end-Math.min(vh*.22,sectionHeight*.28));
    const collapseEnd=Math.max(exitStart+vh*.12,services.end+vh*.04);
    const recoveryEnd=collapseEnd+Math.min(vh*.12,sectionHeight*.16);
    if(marker<=compressStart)return base;
    if(marker<compressEnd){
      const p=ramp(compressStart,compressEnd);
      return {visual:mix(1,.74,p),network:mix(1,.58,p),layout:0,burst:0,wave:0,orbit:mix(1,.88,p)};
    }
    if(marker<burstEnd){
      const p=ramp(compressEnd,burstEnd);
      return {visual:mix(.74,1.27,p),network:mix(.58,1.42,p),layout:0,burst:Math.sin(Math.PI*p),wave:p,orbit:mix(.88,1.14,p)};
    }
    if(marker<formationEnd){
      const p=ramp(burstEnd,formationEnd);
      return {visual:mix(1.27,1.02,p),network:mix(1.42,1.02,p),layout:p,burst:(1-p)*.12,wave:1,orbit:mix(1.14,.90,p)};
    }
    if(marker<exitStart)return {visual:1.02,network:1.02,layout:1,burst:0,wave:1,orbit:.90};
    if(marker<collapseEnd){
      const p=ramp(exitStart,collapseEnd);
      return {visual:mix(1.02,.72,p),network:mix(1.02,.58,p),layout:1-p,burst:0,wave:0,orbit:mix(.90,.82,p)};
    }
    if(marker<recoveryEnd){
      const p=ramp(collapseEnd,recoveryEnd);
      return {visual:mix(.72,1,p),network:mix(.58,1,p),layout:0,burst:0,wave:0,orbit:mix(.82,1,p)};
    }
    return base;
  };
  const storyMotionAnchors=(bounds,homeX,homeY)=>{
    const compact=compactStoryLayout();
    const vh=innerHeight;
    const hero=bounds.find(item=>item.key==='hero');
    const brand=bounds.find(item=>item.key==='brand-universe');
    if(!hero||!brand)return [];
    const direction=getComputedStyle(document.documentElement).direction;
    const oppositeX=compact?innerWidth*(direction==='rtl'?.22:.78):innerWidth-homeX;
    const alternateX=compact?innerWidth*(direction==='rtl'?.78:.22):homeX;
    const brandY=vh*(compact?.88:.90);
    const brandScale=compact?.50:.58;
    const brandOpacity=compact?.24:.30;
    const serviceAnchor=servicesVisualAnchor();
    const anchors=[
      {at:hero.end-vh*.12,x:homeX,y:homeY,scale:1,opacity:1},
      {at:brand.start+vh*.20,x:oppositeX,y:brandY,scale:Math.max(brandScale,.62),opacity:Math.max(brandOpacity,.58)},
      {at:brand.end-vh*.08,x:oppositeX,y:brandY,scale:Math.max(brandScale,.62),opacity:Math.max(brandOpacity,.58)}
    ];
    const sectionTargets=compact?{top:innerWidth*.5,services:alternateX,work:oppositeX,process:innerWidth*.5,about:alternateX,'cinema-final':innerWidth*.5}:{top:homeX,services:oppositeX,work:homeX,process:oppositeX,about:homeX,'cinema-final':innerWidth*.5};
    bounds.filter(item=>Object.hasOwn(sectionTargets,item.key)).forEach(item=>{
      const isFinal=item.key==='cinema-final';
      anchors.push({
        at:item.center,
        x:item.key==='services'?serviceAnchor.x:sectionTargets[item.key],
        y:item.key==='services'?serviceAnchor.y:vh*(compact?(isFinal?.82:.88):(isFinal?.72:.86)),
        scale:item.key==='services'?serviceAnchor.scale:compact?(isFinal?.54:.56):(isFinal?.54:.56),
        opacity:item.key==='services'?1:isFinal?.82:1
      });
    });
    const footer=bounds.find(item=>item.key==='footer');
    if(footer){
      anchors.push({at:footer.start+vh*.02,x:innerWidth*.5,y:vh*.76,scale:compact?.52:.48,opacity:.72});
      anchors.push({at:footer.start+Math.min(footer.end-footer.start, vh*.14),x:innerWidth*.5,y:vh*.74,scale:compact?.48:.44,opacity:.58});
    }
    return anchors.sort((a,b)=>a.at-b.at);
  };
  const applyStoryMotion=(bounds,marker)=>{
    const homeX=homeStoryX(),homeY=homeStoryY();
    const anchors=storyMotionAnchors(bounds,homeX,homeY);
    if(!anchors.length)return;
    let from=anchors[0],to=anchors[anchors.length-1];
    if(marker<=anchors[0].at)to=from;
    else if(marker>=anchors[anchors.length-1].at)from=to;
    else{
      for(let index=0;index<anchors.length-1;index++){
        if(marker>=anchors[index].at&&marker<=anchors[index+1].at){from=anchors[index];to=anchors[index+1];break;}
      }
    }
    const span=Math.max(1,to.at-from.at);
    const progress=from===to?0:smooth(Math.max(0,Math.min(1,(marker-from.at)/span)));
    const x=interpolate(from.x,to.x,progress);
    const y=interpolate(from.y,to.y,progress);
    const scale=interpolate(from.scale,to.scale,progress);
    const opacity=interpolate(from.opacity,to.opacity,progress);
    root.style.setProperty('--story-x',`${x.toFixed(2)}px`);
    root.style.setProperty('--story-y',`${y.toFixed(2)}px`);
    root.style.setProperty('--story-scale',(scale*servicesVisualScale).toFixed(3));
    root.style.opacity=opacity.toFixed(3);
    root.classList.toggle('is-story-travelling',currentStoryRegion!=='hero'&&(currentStoryRegion!=='brand-universe'||compactStoryLayout()));
    setStoryVisualSize();
  };
  const keepServicesVisualInOpenSpace=region=>{
    if(region!=='services'||!storyMotionReady||reduce.matches)return;
    const compact=compactStoryLayout();
    const style=getComputedStyle(root);
    const width=parseFloat(root.style.getPropertyValue('--story-width'))||parseFloat(style.width);
    const anchor=servicesVisualAnchor();
    const idealX=anchor.x;
    const idealY=anchor.y;
    const targetScale=anchor.scale*servicesVisualScale;
    const aspect=compact?1.15:1.08;
    const header=document.querySelector('header');
    const minY=Math.max(64,(header?.getBoundingClientRect().height||0)+12);
    const maxY=innerHeight-(compact?88:36);
    const obstacles=serviceCards.map(card=>card.getBoundingClientRect())
      .filter(rect=>rect.width&&rect.height&&rect.bottom>minY&&rect.top<maxY);
    if(serviceAnchor){
      serviceAnchor.querySelectorAll('h1,h2,h3,h4,p,a,button').forEach(element=>{
        const rect=element.getBoundingClientRect();
        if(rect.width&&rect.height&&rect.bottom>minY&&rect.top<maxY)obstacles.push(rect);
      });
    }
    const overlaps=(x,y,w,h)=>{
      const box={left:x-w/2,right:x+w/2,top:y-h/2,bottom:y+h/2};
      return obstacles.reduce((sum,rect)=>{
        const overlapW=Math.max(0,Math.min(box.right,rect.right)-Math.max(box.left,rect.left));
        const overlapH=Math.max(0,Math.min(box.bottom,rect.bottom)-Math.max(box.top,rect.top));
        return sum+overlapW*overlapH;
      },0);
    };
    let best=null;
    for(let fit=1;fit>=.1;fit-=.05){
      const visualWidth=width*targetScale*fit;
      const visualHeight=visualWidth/aspect;
      if(visualHeight>maxY-minY)continue;
      const xValues=compact
        ?[idealX,innerWidth*.5]
        :[idealX,innerWidth*.22,innerWidth*.34,innerWidth*.5,innerWidth*.66,innerWidth*.78];
      obstacles.forEach(rect=>{
        xValues.push(rect.left-visualWidth/2-8,rect.right+visualWidth/2+8);
      });
      const xCandidates=[...new Set(xValues.map(x=>Math.max(visualWidth/2+8,Math.min(innerWidth-visualWidth/2-8,x))))];
      const yValues=[idealY,minY+visualHeight/2,maxY-visualHeight/2,innerHeight*.25,innerHeight*.5,innerHeight*.75];
      obstacles.forEach(rect=>{
        yValues.push(rect.top-visualHeight/2-5,rect.bottom+visualHeight/2+5);
      });
      const yCandidates=[...new Set(yValues.map(y=>Math.max(minY+visualHeight/2,Math.min(maxY-visualHeight/2,y))))];
      for(const y of yCandidates){
        for(const x of xCandidates){
          const blocked=overlaps(x,y,visualWidth,visualHeight);
          const distance=Math.hypot(x-idealX,y-idealY);
          const score=blocked*1000+distance;
          if(!best||score<best.score)best={x,y,fit,score,blocked};
        }
      }
      if(best&&best.blocked<1)break;
    }
    if(!best)return;
    root.style.setProperty('--story-x',`${best.x.toFixed(2)}px`);
    root.style.setProperty('--story-y',`${best.y.toFixed(2)}px`);
    root.style.setProperty('--story-scale',(targetScale*best.fit).toFixed(3));
  };
  const syncStoryRegion=()=>{
    regionFrame=0;
    if(!continuum||!heroSection||!brandSection)return;
    const bounds=storyBounds();
    const marker=scrollY+innerHeight*.68;
    updateServicesAnchor(bounds);
    let active=bounds.find(item=>marker>=item.start&&marker<item.end);
    if(!active)active=bounds.find(item=>item.end>marker)||bounds[bounds.length-1];
    let region=active?.key||'hero';
    const serviceBounds=bounds.find(item=>item.key==='services');
    const servicesEdgeBuffer=Math.min(24,innerHeight*.025);
    if(currentStoryRegion==='services'&&region!=='services'&&serviceBounds
      &&marker>=serviceBounds.start-servicesEdgeBuffer&&marker<=serviceBounds.end+servicesEdgeBuffer){
      region='services';
    }
    if(currentStoryRegion&&region!==currentStoryRegion&&!reduce.matches){
      transitionAge=0;
      wakeAge=0;
      transitionEnergy=1;
      wakeEnergy=Math.max(wakeEnergy,.32);
    }
    currentStoryRegion=region;
    identityProgress=reduce.matches?(region==='brand-universe'?1:0):brandIdentityProgress(bounds,marker);
    servicesProgress=reduce.matches?(region==='services'?1:0):servicesStoryProgress(bounds,marker);
    syncServicesCoreMessage(region);
    const compositionProgress=servicesCompositionProgress(bounds,marker);
    updateServicesComposition(compositionProgress);
    serviceSection?.style.setProperty('--services-composition-progress',compositionProgress.toFixed(3));
    const serviceTransform=servicesStoryTransform(bounds,marker,region);
    servicesVisualScale=serviceTransform.visual;
    servicesNetworkScale=serviceTransform.network;
    servicesLayoutProgress=serviceTransform.layout;
    servicesBurst=serviceTransform.burst;
    servicesWaveProgress=serviceTransform.wave;
    servicesOrbitScale=serviceTransform.orbit;
    root.style.setProperty('--hb-services-progress',servicesProgress.toFixed(3));
    root.style.setProperty('--hb-services-burst',servicesBurst.toFixed(3));
    root.classList.toggle('is-services-storytelling',servicesProgress>.001);
    core?.style.setProperty('--hb-identity-core-brightness',(1+identityProgress*.12).toFixed(3));
    visualGlow?.style.setProperty('--hb-identity-glow-brightness',(1+identityProgress*.18).toFixed(3));
    continuum.dataset.storyRegion=region;
    root.dataset.storyRegion=region;
    const canInteract=region==='hero'||region==='brand-universe';
    orbitNodes.forEach(node=>{
      if(canInteract)node.removeAttribute('tabindex');
      else node.tabIndex=-1;
    });
    if(reduce.matches){
      disableStoryMotion();
      setReducedMotionVisual(region);
      draw(phase);
      return;
    }
    clearReducedMotionVisual();
    const hero=bounds.find(item=>item.key==='hero');
    const motionStart=hero?hero.end-innerHeight*.12:0;
    if(!storyMotionReady&&(!compactStoryLayout()||marker>=motionStart))enableStoryMotion();
    if(storyMotionReady){
      applyStoryMotion(bounds,marker);
      keepServicesVisualInOpenSpace(region);
    }
  };
  const queueStoryRegion=()=>{
    const now=performance.now(),currentY=window.scrollY,elapsed=Math.max(16,now-lastScrollAt),distance=currentY-lastScrollY;
    lastScrollY=currentY;lastScrollAt=now;
    if(!reduce.matches&&Math.abs(distance)>.5){
      const speed=Math.min(1,Math.abs(distance)/elapsed/1.15);
      const motionRestarted=now-lastScrollMotionAt>900;
      lastScrollMotionAt=now;
      scrollEnergy=Math.max(scrollEnergy,.18+speed*.58);
      if(motionRestarted){wakeAge=0;wakeEnergy=Math.max(wakeEnergy,.48+speed*.34);}
      travelDirection=Math.sign(distance);
    }
    if(!regionFrame)regionFrame=requestAnimationFrame(syncStoryRegion);
  };
  window.addEventListener('scroll',queueStoryRegion,{passive:true});
  window.addEventListener('resize',queueStoryRegion,{passive:true});
  document.fonts?.ready?.then(queueStoryRegion);
  reduce.addEventListener?.('change',()=>{if(reduce.matches)disableStoryMotion();queueStoryRegion();});
  if(serviceCards.length)serviceSection.classList.add('is-services-composition-ready');
  syncStoryRegion();

  const storyNodes=orbitNodes;
  const storyTargets=new Map(storyNodes.map(node=>[node.dataset.storyKey,document.getElementById(node.dataset.storyTarget)]).filter(([,target])=>!!target));
  const storyStatus=root.querySelector('[data-hb-story-status]');
  let activeStory='';
  const setActiveStory=(key,{announce=false}={})=>{
    if(!storyTargets.has(key))return;
    activeStory=key;
    storyNodes.forEach(node=>{
      const active=node.dataset.storyKey===key;
      node.setAttribute('aria-pressed',String(active));
      node.classList.toggle('is-story-active',active);
    });
    storyTargets.forEach((target,targetKey)=>target.toggleAttribute('data-story-active',targetKey===key));
    if(announce&&storyStatus){
      const lang=(document.documentElement.lang||'ar').slice(0,2);
      storyStatus.textContent=storyCopy[lang]?.[key]||storyCopy.en[key];
    }
  };
  storyNodes.forEach(node=>node.addEventListener('click',()=>{
    const key=node.dataset.storyKey;
    const target=storyTargets.get(key);
    setActiveStory(key,{announce:true});
    target?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});
  }));
  const storyObserver=new IntersectionObserver(entries=>{
    const visibleEntries=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    const current=visibleEntries[0];
    if(!current)return;
    const match=[...storyTargets].find(([,target])=>target===current.target);
    if(match)setActiveStory(match[0],{announce:true});
  },{rootMargin:'-34% 0px -46% 0px',threshold:[0,.15,.35,.6]});
  storyTargets.forEach(target=>storyObserver.observe(target));
  // A single reusable galaxy visual remains mounted across every hero slide.
  window.__bdixHeroVisual={pause:stop,resume:start,redraw:resize,element:root};
})();
