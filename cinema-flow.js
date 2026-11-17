(() => {
  'use strict';
  const root = document.querySelector('[data-scroll-cinema]');
  if (!root) return;

  const copy = {
    ar: {
      accessibleTitle: 'BDIX AI — نبني الثقة ونحوّل التجربة الرقمية والذكاء إلى تنفيذ ونمو مُهندَس',
      eyebrow: 'للأعمال عالية القيمة في دول مجلس التعاون الخليجي',
      context: 'الويب والذكاء الاصطناعي وتحسين التحويل — منظومة واحدة للنمو',
      trustIndex: 'الوضوح', experienceIndex: 'التجربة', intelligenceIndex: 'الذكاء الاصطناعي', actionIndex: 'التنفيذ', engineeringIndex: 'النمو المُهندَس',
      trust: 'الوضوح', trustCaption: 'كل قرار مرتفع القيمة يبدأ بالثقة',
      trustEyebrow: 'منهج BDIX AI',
      trustStatement: 'الثقة لا تُعلَن، بل تُهندَس',
      trustBody: 'نبني للأعمال عالية القيمة أنظمة رقمية تجمع الاستراتيجية والذكاء الاصطناعي التطبيقي وهندسة التحويل، بدقة وقابلية للقياس، وبما يسمح بتطورها مع أعمالك',
      trustPillar1: 'استراتيجية قبل الأدوات', trustPillar2: 'ذكاء اصطناعي تطبيقي', trustPillar3: 'أثر قابل للقياس',
      experience: 'التجربة', experienceCaption: 'نحوّل التقنية إلى تجربة رقمية واضحة ومتعددة اللغات',
      intelligence: 'الذكاء', intelligenceCaption: 'نستخدم الذكاء لتقليل الاحتكاك وتحسين القرار',
      action: 'التنفيذ', actionCaption: 'الاستراتيجية لا تخلق قيمة حتى تتحول إلى تنفيذ',
      engineering: 'الهندسة', growth: 'النمو', engineeringCaption: 'نربط الأنظمة والبيانات والتحويل بمنهج قابل للقياس',
      finalLines: ['تجربة تبني الثقة', 'الذكاء يقود إلى التنفيذ', 'نهندس النمو'],
      closingLines: ['النمو يبدأ بوضوح', 'استشارة دقيقة لقرار واثق', 'لنخطط لخطوتك التالية'],
      finalCta: 'اطلب استشارة للنمو', finalContact: 'تواصل معنا',
      signature: 'نبني الثقة ونُهندس النموّ',
      hint: 'مرّر لتبني المنظومة', finalKicker: 'الخلاصة',
      bottomSupport: 'لنستكشف فرص نمو أعمالك معاً',
      cta: 'اطلب تقييم النمو والأتمتة', secondary: 'شاهد الأعمال والمفاهيم'
    },
    en: {
      accessibleTitle: 'BDIX AI — We build trust and turn digital experience and intelligence into action and engineered growth',
      eyebrow: 'For high-value businesses across the Gulf Cooperation Council',
      context: 'Web, AI and conversion — one system for growth',
      trustIndex: 'CLARITY', experienceIndex: 'EXPERIENCE', intelligenceIndex: 'AI', actionIndex: 'ACTION', engineeringIndex: 'ENGINEERED GROWTH',
      trust: 'Clarity', trustCaption: 'Every high-value decision begins with trust',
      trustEyebrow: 'BDIX AI — Our approach',
      trustStatement: 'Trust isn’t claimed. It’s engineered.',
      trustBody: 'We engineer digital systems for high-value businesses, bringing strategy, applied AI and conversion architecture together in a precise, measurable foundation built to evolve.',
      trustPillar1: 'Strategy before tools', trustPillar2: 'Applied AI', trustPillar3: 'Measurable impact',
      experience: 'Experience', experienceCaption: 'We turn technology into a clear, multilingual digital experience',
      intelligence: 'Intelligence', intelligenceCaption: 'We apply intelligence to reduce friction and improve decisions',
      action: 'Action', actionCaption: 'Strategy creates no value until it becomes action',
      engineering: 'Engineering', growth: 'Growth', engineeringCaption: 'We connect systems, data and conversion through a measurable method',
      finalLines: ['Experience builds trust', 'Intelligence drives action', 'We engineer growth'],
      closingLines: ['Growth begins with clarity', 'Advice for confident decisions', 'Let’s plan your next step'],
      finalCta: 'Request a growth consultation', finalContact: 'Contact us',
      signature: 'We build trust We engineer growth',
      hint: 'Scroll to build the system', finalKicker: 'THE PAYOFF',
      bottomSupport: 'Let’s explore your next growth opportunity',
      cta: 'Request a growth & automation assessment', secondary: 'View work and concepts'
    },
    fa: {
      accessibleTitle: 'BDIX AI — اعتماد می‌سازیم و تجربه دیجیتال و هوش را به اقدام و رشد مهندسی‌شده تبدیل می‌کنیم',
      eyebrow: 'برای کسب‌وکارهای باارزش در کشورهای شورای همکاری خلیج',
      context: 'وب، هوش مصنوعی و بهینه‌سازی تبدیل — سامانه‌ای یکپارچه برای رشد',
      trustIndex: 'وضوح', experienceIndex: 'تجربه', intelligenceIndex: 'هوش مصنوعی', actionIndex: 'اقدام', engineeringIndex: 'رشد مهندسی‌شده',
      trust: 'وضوح', trustCaption: 'هر تصمیم باارزش از اعتماد آغاز می‌شود',
      trustEyebrow: 'رویکرد BDIX AI',
      trustStatement: 'اعتماد با ادعا ساخته نمی‌شود، بلکه مهندسی می‌شود',
      trustBody: 'برای کسب‌وکارهای باارزش، سامانه‌های دیجیتال می‌سازیم که استراتژی، هوش مصنوعی کاربردی و معماری تبدیل را در بستری دقیق، سنجش‌پذیر و آمادهٔ تکامل کنار هم می‌آورند',
      trustPillar1: 'استراتژی پیش از ابزار', trustPillar2: 'هوش مصنوعی کاربردی', trustPillar3: 'اثر سنجش‌پذیر',
      experience: 'تجربه', experienceCaption: 'فناوری را به یک تجربه دیجیتال روشن و چندزبانه تبدیل می‌کنیم',
      intelligence: 'هوش', intelligenceCaption: 'از هوش برای کاهش اصطکاک و بهبود تصمیم استفاده می‌کنیم',
      action: 'اقدام', actionCaption: 'استراتژی تا زمانی که به اقدام تبدیل نشود، ارزش نمی‌سازد',
      engineering: 'مهندسی', growth: 'رشد', engineeringCaption: 'سیستم، داده و تبدیل را با یک روش قابل‌اندازه‌گیری به هم متصل می‌کنیم',
      finalLines: ['تجربه اعتماد می‌سازد', 'هوش اقدام را هدایت می‌کند', 'رشد را مهندسی می‌کنیم'],
      closingLines: ['رشد با شفافیت آغاز می‌شود', 'مشاوره‌ای روشن برای تصمیم مطمئن', 'بیایید درباره رشدتان گفت‌وگو کنیم'],
      finalCta: 'درخواست مشاوره رشد', finalContact: 'تماس با ما',
      signature: 'اعتماد می‌سازیم رشد را مهندسی می‌کنیم',
      hint: 'اسکرول کنید تا سیستم ساخته شود', finalKicker: 'نتیجه نهایی',
      bottomSupport: 'بیایید فرصت‌های رشدتان را با هم بررسی کنیم',
      cta: 'درخواست ارزیابی رشد و اتوماسیون', secondary: 'مشاهدهٔ پروژه‌ها و ایده‌ها'
    }
  };

  const beats=[...root.querySelectorAll('[data-cinema-beat]')];
  function language(){const l=(document.documentElement.lang||'ar').toLowerCase();return copy[l]?l:'ar'}
  function applyCopy(){
    const lang=language(),dict=copy[lang];
    document.querySelectorAll('[data-cinema]').forEach(el=>{
      const key=el.getAttribute('data-cinema');
      if((key==='finalLine'&&Array.isArray(dict.finalLines))||(key==='closingLine'&&Array.isArray(dict.closingLines))){
        const lines=key==='closingLine'?dict.closingLines:dict.finalLines;
        const className=key==='closingLine'?'cinema-v25-closing-line-item':'cinema-v25-final-line-item';
        const fragment=document.createDocumentFragment();
        lines.forEach(text=>{const line=document.createElement('span');line.className=className;line.textContent=text;fragment.append(line)});
        el.replaceChildren(fragment);
      }else if(dict[key]!=null){el.textContent=dict[key]}
    });
    root.dataset.locale=lang;
  }
  function initFinalReveal(){
    const title=document.querySelector('.cinema-v25-bottom h2[data-cinema="closingLine"]');
    if(!title||window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window))return;
    title.classList.add('cinema-v25-reveal-pending');
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        requestAnimationFrame(()=>title.classList.add('cinema-v25-revealed'));
        observer.disconnect();
      }
    },{threshold:.12,rootMargin:'0px 0px -10% 0px'});
    observer.observe(title);
  }
  beats.forEach((beat,i)=>{const active=i===0;beat.setAttribute('aria-hidden',active?'false':'true');if(active)beat.removeAttribute('inert');else beat.setAttribute('inert','')});
  function update(){const total=Math.max(1,document.documentElement.scrollHeight-innerHeight),progress=Math.min(1,Math.max(0,scrollY/total));document.documentElement.style.setProperty('--document-scroll',progress.toFixed(5));window.__bdixScrollFlow={locked:false,pinned:false,bannerPreserved:true,visualScope:'document-to-footer',progress:Number(progress.toFixed(4))}}
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});new MutationObserver(applyCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});applyCopy();initFinalReveal();update();
})();
