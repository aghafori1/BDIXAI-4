# BDIX AI — دستورالعمل ایجنت‌ها / Agent Instructions

> این فایل را هر ایجنت کدنویسی که روی این پروژه کار می‌کند باید بخواند
> (Codex · Cursor · Claude Code · Letta Code · Gemini · Copilot · …)
>
> **هدف:** پروژه همیشه تمیز، سبک و بدون نسخه‌های تکراری بماند.
>
> خلاصهٔ فارسی در انتهای همین فایل است.

---

## Project

Static, framework-free marketing site for **BDIX AI** — a growth & automation
agency (web + AI) targeting GCC businesses. Trilingual: **Arabic (default, RTL),
Persian, English**, switched with `?lang=ar|fa|en`.

Vanilla **HTML + CSS + JS**. No build step, no package manager, no dependencies,
no backend. Open `index.html` in a browser to run it.

---

# THE THREE RULES

## RULE 1 — One living handoff file. Update it in place.

`PROJECT-HANDOFF.md` is the **only** handoff document in this
project.

- After **every** edit to the project, rewrite it so it describes the **current**
  state.
- **Replace** its content. Never append. Never keep the previous version's text.
- **Never create a sibling.** No `CONVERSATION-TRANSFER-v3.6.md`, no dated copy,
  no `handoff-v2/` folder, no numbered series.
- Keep the exact section order already present in `PROJECT-HANDOFF.md`.
- Write in Persian, keeping technical terms in Latin script.

## RULE 2 — Never create versioned copies. Edit files in place.

The project must always contain **only the current version**. Do **NOT** create:

- versioned file copies — `foo-v3.6.js`, `styles-v2.css`
- per-version snapshot folders — `source/v3.6/`, `versions/`, `backup/`, `old/`
- per-version manifests or reports — `BUILD-MANIFEST-v3.6.json`, `QA-v3.6.json`
- dated duplicates — `index-2026-10-14.html`

Instead:

- **Edit the existing file in place.** Git already stores every previous version —
  that is what version control is for. `git log -p <file>` recovers any old state.
- Put the version number **inside** the handoff file (and, if useful, in a comment
  at the top of a changed file) — **never in a filename**.
- If an artifact is genuinely superseded, remove it only after checking all live
  references; do not keep superseded copies inside the active baseline.

**Why this rule exists:** the project once accumulated **17 handoff files** and
**10 per-version snapshot folders**. That bloated the folder past every upload
limit and made it impossible to tell which file was current. Do not repeat it.

## RULE 3 — Hard boundaries

- The active baseline must not contain `_archive/`, snapshot folders, or duplicate historical assets. Git is the history store.
- Do not recreate an archive inside the active baseline just to preserve old versions.
- Do not deploy, change DNS, add a backend or database, add analytics, or publish
  anything publicly without explicit owner approval. Record such a request under
  `مرزها` in the handoff file as `نیازمند تأیید صریح مالک` and stop.
- Never fabricate testimonials, client logos, ROI figures, or case studies.
  Portfolio content is `Concept` only until the owner supplies real material.

---

## Naming convention — filenames carry NO version numbers

Every live file is named for **what it is**, never for when it was made:

```
index.html                 contact.html              favicon.ico
README.md                  README_FA.md

adaptive-navigation.js     adaptive-neural.css       astra-orbit.css
astra-orbit.js             brand-motion.js           cinema-flow.js
contact-background.js      contact-page.js           future-ui.css
hero-cinema.js             mobile-app-dock.js        particle-background.js
portfolio-arc.css
scroll-cinema.css          scroll-flow.css
```

When you change one of these, **edit it in place — the filename does not change.**
The current state is documented in `PROJECT-HANDOFF.md`; filenames remain version-free.

This convention replaced the old scheme where the live files were named
`adaptive-neural-v30.css`, `scroll-cinema-v27.css`, `portfolio-fan-v35.css` and
so on. That scheme was actively dangerous: the live files had **low** version
numbers while their higher-numbered siblings were dead, so "keep the newest"
would have deleted the wrong file.

## ⚠️ Live CSS selectors — do not rename

The markup and stylesheets still contain class names carrying old version
numbers: `scroll-cinema-v25`, `cinema-v25-*`, `neural-mesh-v27`, `bdix-v35`.

These are **live CSS selectors**, not filenames. Renaming one means changing both
the markup and every stylesheet that targets it. Leave them alone unless the task
is explicitly to rename selectors.

---

## Verify before you claim

1. Every local asset reference in `index.html` and `contact.html`
   (`<script src>`, `<link href>`, `<img src>`, `srcset`, `<source src>`,
   inline `url(...)`, favicon) must resolve on disk.
2. A headless Chrome load of `index.html` must report **0 console errors** and
   **0 failed requests**.
3. Record the actual result in the handoff file's `نتیجه QA` section. If you did
   not run a check, write `اجرا نشده`.

---

## فارسی (خلاصه برای مالک پروژه)

**قانون ۱ — یک فایل انتقال، همیشه به‌روز.** فایل
`PROJECT-HANDOFF.md` تنها سند انتقال این پروژه است. با هر تغییر،
همان فایل از نو نوشته می‌شود — نه نسخهٔ جدید. هرگز فایل هم‌نام با شمارهٔ نسخه
نسازید.

**قانون ۲ — نسخهٔ جدید نسازید؛ همان فایل را ویرایش کنید.** پروژه باید همیشه فقط
نسخهٔ فعلی را داشته باشد. کپی نسخه‌دار (`foo-v3.6.js`)، پوشهٔ اسنپ‌شات
(`source/v3.6/`)، مانیفست نسخه‌دار (`BUILD-MANIFEST-v3.6.json`) و فایل تاریخ‌دار
ممنوع است. شمارهٔ نسخه **داخل** فایل نوشته می‌شود، نه در نام فایل. تاریخچهٔ
قدیمی در گیت محفوظ است — با `git log -p <file>` هر نسخهٔ قبلی را می‌بینید.

**قانون ۳ — مرزها.** پوشهٔ `_archive/` در baseline فعال ایجاد نمی‌شود. هیچ دیپلوی، تغییر
DNS، بک‌اند یا انتشار عمومی بدون تأیید صریح مالک انجام نمی‌شود.

**نام‌گذاری:** نام هیچ فایل زنده‌ای شمارهٔ نسخه ندارد. فایل‌های زنده فقط با نام
کاریشان شناخته می‌شوند (`adaptive-neural.css` و `scroll-cinema.css`). با هر تغییر، همان فایل ویرایش می‌شود و نامش عوض نمی‌شود.

**سلکتورهای زندهٔ CSS:** کلاس‌هایی مثل `scroll-cinema-v25` و `neural-mesh-v27`
و `bdix-v35` هنوز شمارهٔ نسخه دارند، ولی این‌ها **نام کلاس** هستند نه نام فایل.
تغییرشان نیازمند ویرایش هم‌زمان HTML و CSS است — دست نزنید.
