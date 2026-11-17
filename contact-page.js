(() => {
  'use strict';

  const copy = {
    ar: { dir: 'rtl', pageTitle: 'تواصل — BDIX AI', home: 'الرئيسية', backHome: 'العودة للرئيسية', eyebrow: 'تقييم خاص للنمو والأتمتة', title: 'قرار أفضل يبدأ بسؤال أدق', intro: 'شاركنا السياق الأساسي لعملك لنحدد أكبر فرصة قابلة للتنفيذ. لا وعود جاهزة، بل تشخيص واضح وخطوة تالية مناسبة', proof1: 'خاص وسري', proof2: 'بدون وعود فارغة', proof3: 'أولوية قابلة للتنفيذ', start: 'ابدأ التقييم', formTitle: 'طلب التقييم الأولي', formHint: 'ثمانية حقول قصيرة لتحديد السياق', stepOne: 'معلومات التواصل', stepTwo: 'سياق العمل', fullName: 'الاسم الكامل', phone: 'الهاتف', whatsapp: 'واتساب', email: 'البريد الإلكتروني', instagram: 'اسم المستخدم على إنستغرام', instagramPh: '@username', instagramHint: 'أدخل اسم المستخدم فقط، من دون www أو رابط كامل.', instagramValid: 'صيغة المعرف تبدو صحيحة؛ افتح الأيقونة لمراجعة الملف الشخصي.', instagramInvalid: 'استخدم 1 إلى 30 حرفًا أو رقمًا أو نقطة أو شرطة سفلية.', instagramOpen: 'فتح ملف Instagram الشخصي', country: 'الدولة', countryPh: 'اختر الدولة', business: 'نوع العمل', challenge: 'التحدي ذو الأولوية', namePh: 'الاسم الكامل', phonePh: 'رقم الهاتف', whatsappPh: 'رقم واتساب', emailPh: 'البريد الإلكتروني', businessPh: 'نوع العمل', challengePh: 'ما المشكلة الأساسية؟', next: 'التالي', previous: 'السابق', introBack: 'العودة للنص', submit: 'إرسال الطلب', success: 'تم استلام طلبك بنجاح. سنتواصل معك قريبًا.', sending: 'جارٍ إرسال الطلب…', sendError: 'تعذر إرسال الطلب الآن. حاول مرة أخرى.', rateLimit: 'وصلت إلى الحد المؤقت للطلبات. حاول بعد قليل.' },
    fa: { dir: 'rtl', pageTitle: 'تماس — BDIX AI', home: 'صفحه اصلی', backHome: 'بازگشت به خانه', eyebrow: 'ارزیابی خصوصی رشد و اتوماسیون', title: 'تصمیم بهتر از سؤال دقیق‌تر شروع می‌شود', intro: 'اطلاعات ضروری کسب‌وکارتان را ثبت کنید تا بزرگ‌ترین فرصتِ قابل‌اجرا را شناسایی کنیم. به‌جای وعده‌های آماده، تشخیصی روشن و گام بعدی مناسبی ارائه می‌کنیم.', proof1: 'خصوصی و محرمانه', proof2: 'بدون وعده توخالی', proof3: 'اولویت قابل اجرا', start: 'شروع ارزیابی', formTitle: 'درخواست ارزیابی اولیه', formHint: 'هشت فیلد کوتاه برای شناخت زمینه', stepOne: 'اطلاعات تماس', stepTwo: 'زمینهٔ کسب‌وکار', fullName: 'نام و نام خانوادگی', phone: 'تلفن', whatsapp: 'واتساپ', email: 'ایمیل', instagram: 'آیدی اینستاگرام', instagramPh: '@username', instagramHint: 'فقط آیدی را وارد کنید، بدون www یا لینک کامل.', instagramValid: 'قالب آیدی درست به نظر می‌رسد؛ برای بررسی پروفایل، آیکون را باز کنید.', instagramInvalid: 'از ۱ تا ۳۰ حرف انگلیسی، عدد، نقطه یا زیرخط استفاده کنید.', instagramOpen: 'بازکردن پروفایل اینستاگرام', country: 'کشور', countryPh: 'انتخاب کشور', business: 'نوع کسب‌وکار', challenge: 'مسئله دارای اولویت', namePh: 'نام و نام خانوادگی', phonePh: 'شماره تلفن', whatsappPh: 'شماره واتساپ', emailPh: 'آدرس ایمیل', businessPh: 'نوع کسب‌وکار', challengePh: 'مسئله اصلی کسب‌وکار چیست؟', next: 'مرحله بعد', previous: 'مرحله قبل', introBack: 'بازگشت به معرفی', submit: 'ارسال درخواست', success: 'درخواست شما با موفقیت ثبت شد؛ به‌زودی پیگیری می‌کنیم.', sending: 'در حال ارسال درخواست…', sendError: 'ارسال درخواست انجام نشد؛ لطفاً دوباره تلاش کنید.', rateLimit: 'تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.' },
    en: { dir: 'ltr', pageTitle: 'Contact — BDIX AI', home: 'Home', backHome: 'Back home', eyebrow: 'Private growth and automation assessment', title: 'Better decisions start with sharper questions', intro: 'Share the essential business context so we can identify the highest-leverage opportunity. No ready-made promises—just a clear diagnosis and an appropriate next step.', proof1: 'Private by design', proof2: 'No empty promises', proof3: 'Actionable priority', start: 'Start assessment', formTitle: 'Request an initial assessment', formHint: 'Eight short fields to establish context', stepOne: 'Contact details', stepTwo: 'Business context', fullName: 'Full name', phone: 'Phone', whatsapp: 'WhatsApp', email: 'Email', instagram: 'Instagram username', instagramPh: '@username', instagramHint: 'Enter only the username, not www or a full profile URL.', instagramValid: 'Username format looks right; open the icon to review the profile.', instagramInvalid: 'Use 1–30 letters, numbers, dots, or underscores.', instagramOpen: 'Open Instagram profile', country: 'Country', countryPh: 'Select country', business: 'Business type', challenge: 'Priority challenge', namePh: 'Full name', phonePh: 'Phone number', whatsappPh: 'WhatsApp number', emailPh: 'Email address', businessPh: 'Business type', challengePh: 'What is the priority challenge?', next: 'Continue', previous: 'Previous', introBack: 'Back to overview', submit: 'Send request', success: 'Your request was received. We’ll contact you soon.', sending: 'Sending your request…', sendError: 'The request could not be sent. Please try again.', rateLimit: 'Too many requests. Please try again shortly.' },
  };

  const root = document.documentElement;
  const body = document.body;
  const form = document.querySelector('#contact-form');
  const instagramInput = form.querySelector('[name="instagram"]');
  const instagramLink = form.querySelector('[data-instagram-link]');
  const instagramFeedback = form.querySelector('#instagram-feedback');
  const statuses = [...document.querySelectorAll('.status')];
  const intro = document.querySelector('.contact-intro');
  const panel = document.querySelector('.form-panel');
  const stepOne = document.querySelector('[data-form-step="1"]');
  const stepTwo = document.querySelector('[data-form-step="2"]');
  const mobile = window.matchMedia('(max-width: 820px)');
  let view = 'intro';

  const language = () => copy[root.lang] ? root.lang : 'en';
  const updateInstagramFeedback = () => {
    const raw = instagramInput.value.trim();
    const username = raw.startsWith('@') ? raw.slice(1) : raw;
    const valid = /^[A-Za-z0-9._]{1,30}$/.test(username);
    const text = copy[language()];

    instagramInput.setAttribute('aria-invalid', String(Boolean(raw) && !valid));
    if (!raw) {
      instagramFeedback.textContent = '';
      instagramFeedback.removeAttribute('data-state');
      instagramLink.hidden = true;
      instagramLink.removeAttribute('href');
      return;
    }
    if (!valid) {
      instagramFeedback.textContent = text.instagramInvalid;
      instagramFeedback.dataset.state = 'invalid';
      instagramLink.hidden = true;
      instagramLink.removeAttribute('href');
      return;
    }

    instagramFeedback.textContent = text.instagramValid;
    instagramFeedback.dataset.state = 'valid';
    instagramLink.href = `https://www.instagram.com/${encodeURIComponent(username)}/`;
    instagramLink.hidden = false;
  };
  const headline = document.querySelector('#contact-title');
  const headlineDirections = ['right', 'top', 'left', 'bottom'];
  const prepareContactHeadline = () => {
    if (!headline) return;
    const label = headline.textContent.trim().replace(/\s+/g, ' ');
    const fragment = document.createDocumentFragment();
    label.split(' ').forEach((word, index, words) => {
      const span = document.createElement('span');
      span.className = 'chr-word';
      span.dataset.from = headlineDirections[index % headlineDirections.length];
      span.style.setProperty('--chr-order', index);
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word;
      fragment.append(span);
      if (index < words.length - 1) fragment.append(document.createTextNode(' '));
    });
    headline.setAttribute('aria-label', label);
    headline.replaceChildren(fragment);
    headline.classList.add('contact-headline-reveal');
    headline.classList.remove('contact-headline-visible');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      headline.classList.add('contact-headline-visible');
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => headline.classList.add('contact-headline-visible')));
  };
  const setLanguage = (locale) => {
    const lang = copy[locale] ? locale : 'en';
    const text = copy[lang];
    root.lang = lang;
    root.dir = text.dir;
    document.title = text.pageTitle;
    document.querySelectorAll('[data-k]').forEach((node) => {
      const value = text[node.dataset.k];
      if (value) node.textContent = value;
    });
    document.querySelectorAll('[data-ph]').forEach((node) => {
      const value = text[node.dataset.ph];
      if (value) node.placeholder = value;
    });
    document.querySelectorAll('[data-lang]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    document.querySelectorAll('[data-home-link]').forEach((link) => link.href = `index.html?lang=${encodeURIComponent(lang)}`);
    document.querySelectorAll('[data-home-label]').forEach((node) => node.setAttribute('aria-label', text.backHome));
    statuses.forEach((node) => { node.textContent = ''; });
    instagramLink.setAttribute('aria-label', text.instagramOpen);
    updateInstagramFeedback();
    localStorage.setItem('bdixai-locale', lang);
    prepareContactHeadline();
    if (typeof ensureFit === 'function') ensureFit();
  };

  const setInert = (node, value) => {
    if (!node) return;
    node.inert = value;
    node.setAttribute('aria-hidden', String(value));
  };

  const focusView = () => {
    if (!mobile.matches) return;
    const target = view === 'intro' ? intro.querySelector('h1') : panel.querySelector('h2');
    target?.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
  };

  const ensureFit = () => requestAnimationFrame(() => {
    const grid = document.querySelector('.contact-grid');
    const pageShell = document.querySelector('.page');
    const active = mobile.matches ? (view === 'intro' ? intro : panel) : grid;
    const mobileFormNeedsPageScroll = mobile.matches && view === 'form' && pageShell.scrollHeight > window.innerHeight + 8;
    const overflow = Boolean(active && (
      active.scrollHeight > active.clientHeight + 8 ||
      grid.scrollHeight > grid.clientHeight + 8 ||
      mobileFormNeedsPageScroll
    ));
    root.classList.toggle('contact-overflow-fallback', overflow);
  });

  const setView = (next, moveFocus = true) => {
    view = mobile.matches ? next : 'desktop';
    body.dataset.contactView = view;
    if (!mobile.matches) {
      setInert(intro, false); setInert(panel, false); setInert(stepOne, false); setInert(stepTwo, false);
      return;
    }
    setInert(intro, view !== 'intro');
    setInert(panel, view === 'intro');
    setInert(stepOne, view !== 'form');
    setInert(stepTwo, view !== 'form');
    if (moveFocus) requestAnimationFrame(focusView);
    ensureFit();
  };

  const validateStep = (step) => {
    const controls = [...step.querySelectorAll('input,select,textarea')];
    for (const control of controls) if (!control.reportValidity()) return false;
    return true;
  };

  instagramInput.addEventListener('input', updateInstagramFeedback);
  document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  document.querySelector('[data-start]').addEventListener('click', () => setView('form'));
  document.querySelector('[data-intro-back]').addEventListener('click', () => setView('intro'));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!(validateStep(stepOne) && validateStep(stepTwo))) return;
    const text = copy[language()];
    const submitButtons = [...form.querySelectorAll('button[type="submit"]')];
    submitButtons.forEach((button) => { button.disabled = true; });
    statuses.forEach((node) => { node.textContent = text.sending; });
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.instagram = String(payload.instagram || '').trim();
    try {
      const base = String(window.BDIX_API_BASE_URL || '').replace(/\/+$/, '');
      const response = await fetch(`${base}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = new Error('sendError');
        error.rateLimited = response.status === 429;
        throw error;
      }
      form.reset();
      updateInstagramFeedback();
      statuses.forEach((node) => { node.textContent = text.success; });
    } catch (error) {
      const message = error.rateLimited ? text.rateLimit : text.sendError;
      statuses.forEach((node) => { node.textContent = message; });
    } finally {
      submitButtons.forEach((button) => { button.disabled = false; });
    }
  });
  mobile.addEventListener('change', () => setView(mobile.matches ? 'intro' : 'desktop', false));
  window.addEventListener('resize', ensureFit, { passive: true });

  setLanguage(new URLSearchParams(location.search).get('lang') || localStorage.getItem('bdixai-locale') || 'ar');
  setView(mobile.matches ? 'intro' : 'desktop', false);

  window.__bdixContactFlow = {
    get view() { return view; },
    get mobile() { return mobile.matches; },
    showIntro: () => setView('intro'),
    showForm: () => setView('form'),
  };
})();
