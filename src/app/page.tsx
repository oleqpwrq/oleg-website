"use client";
import React, { useEffect, useState } from "react";

// Self-contained React TSX component without external UI libraries
// - Modern gradient background + glassmorphism cards
// - Photo at the very top
// - Single-chevron accordion (native <details>/<summary>)
// - Telegram & Call actions
// - Sections: About, Experience, Skills, Qualities, Hobbies, Contacts
// - Footer note: «Хочу работать в Яндекс»

export default function VisitingCard() {
  // Smooth scroll + single-open accordions — hardened against SSR/nulls/text nodes
  useEffect(() => {
    const isClient = typeof window !== "undefined" && typeof document !== "undefined";
    if (!isClient) return; // SSR guard — useEffect doesn't run on SSR, but we double-guard

    // --- Helper: walk up from any event target to find an internal <a href="#..."> ---
    const getInternalAnchor = (e: MouseEvent): HTMLAnchorElement | null => {
      try {
        let node: Node | null = (e.target as Node | null);
        while (node) {
          if (node instanceof HTMLAnchorElement) {
            const href = node.getAttribute("href");
            if (href && href.startsWith("#") && href !== "#") return node;
            return null; // external/other anchors — stop
          }
          node = (node as Node).parentNode; // walk up for Element/Text nodes
        }
      } catch {
        // never throw from helper
      }
      return null;
    };

    // --- Smooth scroll on internal anchors (no-ops safely when section not found) ---
    const onDocumentClick = (e: MouseEvent) => {
      const a = getInternalAnchor(e);
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id) return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onDocumentClick);

    // --- Single-open accordion behavior for #experience ---
    const attachExperienceToggle = (): (() => void) | undefined => {
      const exp = document.getElementById("experience");
      if (!exp) return undefined;
      const onToggle = (ev: Event) => {
        const t = ev.target;
        if (!(t instanceof HTMLDetailsElement) || !t.open) return;
        exp.querySelectorAll<HTMLDetailsElement>("details").forEach((x) => {
          if (x !== t) x.open = false;
        });
      };
      exp.addEventListener("toggle", onToggle, true);
      return () => exp.removeEventListener("toggle", onToggle, true);
    };

    let cleanupExperience = attachExperienceToggle();

    // If #experience renders later, attach once via MutationObserver (when available)
    let mo: MutationObserver | undefined;
    if (typeof MutationObserver !== "undefined") {
      mo = new MutationObserver(() => {
        if (!cleanupExperience) cleanupExperience = attachExperienceToggle();
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }

        // Cleanup
    return () => {
      document.removeEventListener("click", onDocumentClick);
      cleanupExperience?.();
      mo?.disconnect();
    };
  }, []);

  // === Content settings (change if needed) ===
  const tgHandle = "oleqpwrq";
  const phone = "+7 926 794-35-37";
  const email = "oleq.prok@yandex.ru";
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Try to resolve an available avatar file from /public using a HEAD request
  useEffect(() => {
    if (typeof fetch === "undefined") return;
    const candidates = ["/avatar.jpeg", "/avatar.jpg", "/avatar.JPEG", "/avatar.JPG"]; // JPEG-only
    const test = async (url: string): Promise<boolean> => {
      try {
        const r = await fetch(url, { method: "HEAD", cache: "no-store" });
        return r.ok;
      } catch {
        return false;
      }
    };
    (async () => {
      for (const url of candidates) {
        if (await test(url)) { setPhotoUrl(url); return; }
      }
      setPhotoUrl(undefined);
    })();
  }, []);

  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const tgHref = `https://t.me/${tgHandle}`;

  return (
    <div className="app gradient-bg">
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@700;800&display=swap');
        :root{--glass-bg:rgba(255,255,255,.06);--glass-border:rgba(255,255,255,.12)}
        *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:#020617}
        html,body,#__next{min-height:100%}
        .app{isolation:isolate}
        body{overflow-x:hidden}
        .app{min-height:100vh;color:#fff;background:
          radial-gradient(60% 80% at 20% 10%, #3b82f6 0%, transparent 60%),
          radial-gradient(60% 80% at 80% 10%, #8b5cf6 0%, transparent 55%),
          radial-gradient(120% 120% at 50% 120%, #0f172a 10%, #020617 60%);
          font-family:Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"}
        a{color:inherit;text-decoration:none}
        .container{max-width:1100px;margin:0 auto;padding:0 1rem}
        .nav{position:sticky;top:0;z-index:50;border-bottom:1px solid var(--glass-border);backdrop-filter:blur(10px);background:rgba(0,0,0,.35)}
        .row{display:flex;align-items:center;justify-content:space-between;height:64px}
        .menu a{margin-left:1rem;opacity:.85}
        .menu a:hover{opacity:1}
        .brand{display:inline-flex;align-items:center;gap:.6rem}
        .brand-name{font-family:Rubik, Inter, ui-sans-serif, system-ui; font-weight:800; letter-spacing:-0.02em}
        .logo{width:26px;height:26px;display:inline-grid;place-items:center;border-radius:6px;background:transparent;box-shadow:none}
        .glass{background:var(--glass-bg);border:1px solid var(--glass-border);backdrop-filter:blur(10px);border-radius:24px}
        .hero{padding:72px 0}
        .avatar{height:160px;width:160px;border-radius:9999px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,.35);border:4px solid rgba(255,255,255,.2);position:relative}
        .avatar .initials{height:100%;width:100%;display:grid;place-items:center;font-weight:800;font-size:40px;color:#ffffffcc;background:linear-gradient(135deg,#334155,#0f172a)}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1rem;border-radius:16px;border:1px solid transparent;background:#6366f1;color:#fff;font-weight:600}
        .btn:hover{filter:brightness(1.08); transform:translateY(-2px); box-shadow:0 10px 24px rgba(99,102,241,.35)}
        .btn-outline{background:transparent;border-color:var(--glass-border)}
        .btn-ghost{background:transparent;border-color:transparent}
        .btn,.badge,.glass{transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease, filter .2s ease}
        .btn-outline:hover{border-color:rgba(255,255,255,.35); background:rgba(255,255,255,.04)}
        .btn-ghost:hover{background:rgba(255,255,255,.06)}
        /* Hover glow for skills & qualities */
        #skills .glass.card, #qualities .badge{cursor:pointer}
        #skills .glass.card:hover, #qualities .badge:hover{transform:translateY(-3px); box-shadow:0 12px 32px rgba(99,102,241,.35), 0 0 0 1px rgba(255,255,255,.15) inset; background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.2)}
        .badge{padding:.5rem .75rem;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);font-size:.9rem}
        .grid{display:grid;gap:1rem}
        .grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
        .grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
        @media (max-width:900px){.grid-2,.grid-3{grid-template-columns:1fr}}
        @media (max-width:1200px){.menu{display:none}}
        section{padding:64px 0}
        /* Tighter spacing specifically for hobbies */
        #hobbies{padding:32px 0}
        h1{margin:0}
        h2{margin:0 0 16px 0}
        .card{padding:24px}
        .details{margin-bottom:8px}
        summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-radius:16px}
        summary::-webkit-details-marker{display:none}
        summary::marker{content:''}
        .hero-row{display:flex; align-items:center; gap:24px; flex-wrap:wrap}
        .cta{display:flex; gap:12px; flex-wrap:wrap}
        .meta{display:flex; gap:16px; align-items:center; flex-wrap:wrap}
        @media (max-width:900px){.hero-row{justify-content:center; text-align:center}}
        @media (max-width:900px){.cta,.meta{justify-content:center}}
        /* Tablet fix: центрируем аватар и текст на планшетах (вкл. iPad landscape) */
        @media (max-width:1200px){.hero-row{justify-content:center; text-align:center} .hero .avatar{margin:0 auto}}
        .chevron{transition:transform .25s ease}
        details[open] .chevron{transform:rotate(180deg)}
        .footer{border-top:1px solid var(--glass-border);padding:24px 0;margin-top:16px;text-align:center;color:rgba(255,255,255,.75)}
        .small{opacity:.8;font-size:.95rem}
        /* Facts styling */
        .facts{font-size:1.1rem}
        .facts .fact{display:flex; gap:.5rem; margin:.35rem 0}
        .facts .fact-label{font-weight:700}

        /* Explicit bullet symbol for experience lists */
        #experience .bullets{margin:0; padding-left:1.25rem; line-height:1.7}
        #experience .bullets li{list-style:none; position:relative}
        #experience .bullets li::before{content:"•"; position:absolute; left:-1.1rem; top:0;}
        summary::-webkit-details-marker{display:none}
        summary::marker{content:''}
        .hero-row{display:flex; align-items:center; gap:24px; flex-wrap:wrap}
        .cta{display:flex; gap:12px; flex-wrap:wrap}
        .meta{display:flex; gap:16px; align-items:center; flex-wrap:wrap}
        @media (max-width:900px){.hero-row{justify-content:center; text-align:center}}
        @media (max-width:900px){.cta,.meta{justify-content:center}}
        .chevron{transition:transform .25s ease}
        details[open] .chevron{transform:rotate(180deg)}
        .footer{border-top:1px solid var(--glass-border);padding:24px 0;margin-top:16px;text-align:center;color:rgba(255,255,255,.75)}
        .small{opacity:.8;font-size:.95rem}
        /* Facts styling */
        .facts{font-size:1.1rem}
        .facts .fact{display:flex; gap:.5rem; margin:.35rem 0}
        .facts .fact-label{font-weight:700}

        /* Explicit bullet symbol for experience lists */
        #experience .bullets{margin:0; padding-left:1.25rem; line-height:1.7}
        #experience .bullets li{list-style:none; position:relative}
        #experience .bullets li::before{content:"•"; position:absolute; left:-1.1rem; top:0;}
      `}</style>

      {/* NAV */}
      <header className="nav">
        <div className="container row">
          <a href="#top" className="brand">
            <span className="logo" aria-hidden="true"><img src="/logo.png" alt="" width={26} height={26} /></span>
            <span className="brand-name">Олег Прокуронов</span>
          </a>
          <nav className="menu" aria-label="Навигация">
            <a href="#about">Обо мне</a>
            <a href="#experience">Опыт</a>
            <a href="#skills">Навыки</a>
            <a href="#qualities">Качества</a>
            <a href="#hobbies">Хобби</a>
            <a href="#education">Образование</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <a className="btn" href={tgHref} target="_blank" rel="noreferrer"><IconSend/>Написать в TG</a>
        </div>
      </header>

      {/* HERO with photo on top */}
      <div id="top" className="container hero">
        <div className="hero-row">
          <div className="avatar">
            {photoUrl ? (
              <img src={photoUrl ?? ""} alt="Фото Олега" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
            ) : (
              <div className="initials">ОП</div>
            )}
          </div>
          <div>
            <h1 style={{fontSize:"42px", lineHeight:1.1, fontWeight:800}}>Прокуронов Олег</h1>
            <p className="small" style={{marginTop:8, fontSize:18}}>Руководитель отдела маркетинга · Маркетолог (Москва)</p>
            <div className="cta" style={{marginTop:16}}>
              <a className="btn" href="https://t.me/hynzi" target="_blank" rel="noreferrer"><IconSend/>Связаться в Telegram</a>
              <a className="btn btn-outline" href="callto:+79267943537"><IconPhone/>Позвонить</a>
              <a className="btn btn-ghost" href="#experience">Портфолио / Опыт <IconArrowRight/></a>
            </div>
            <div className="small meta" style={{marginTop:12}}>
              <span style={{display:"inline-flex", alignItems:"center", gap:6}}><IconMapPin/>Москва, м. Свиблово</span>
              <a style={{display:"inline-flex", alignItems:"center", gap:6, textDecoration:"underline"}} href={`mailto:${email}`}><IconMail/>{email}</a>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="container grid grid-2">
          <div className="glass card" style={{gridColumn:"span 1 / span 1"}}>
            <p>
              Маркетолог с опытом разработки комплексных стратегий продвижения и управления digital‑рекламой (SEO, SMM, контекст, e‑mail). Руководил командой, выстраивал лидогенерацию, развивал бренды от глэмпинга до международной логистики.
            </p>
            <p style={{marginTop:12}}>
              Сильные стороны: аналитика (ROI/ROMI), построение воронок, маркетплейсы, PR и инфлюенс‑маркетинг, ивенты. Нацелен на ощутимый бизнес‑результат.
            </p>
          </div>
          <div className="glass card facts">
            <div className="fact"><span className="fact-label">Английский:</span> <span className="fact-value">C1 (Продвинутый)</span></div>
            <div className="fact"><span className="fact-label">Гражданство:</span> <span className="fact-value">РФ</span></div>
            <div className="fact"><span className="fact-label">Занятость:</span> <span className="fact-value">Полная, гибкий график</span></div>
            <div className="fact"><span className="fact-label">Командировки:</span> <span className="fact-value">Возможны</span></div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE – single chevron per item */}
      <section id="experience">
        <div className="container">
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", marginBottom:16}}>Опыт работы</h2>

          <div className="glass card">
            {[
              {
                company: 'ООО "Корпоративная Механика"',
                role: 'Руководитель отдела маркетинга',
                dates: '',
                bullets: [
                  'Разработка маркетинговых стратегий: Формирование и реализация комплексных стратегий продвижения для различных бизнес-направлений, включая аутсорсинг бухгалтерии, маркетинговое агентство, загородный глэмпинг и международную логистику.',
                  'Управление рекламными кампаниями: Планирование и координация рекламных активностей по всем видам бизнеса с акцентом на digital-каналы (SEO, SMM, контекстная реклама, e-mail маркетинг).',
                  'Анализ конкурентной среды: Оценка рыночной ситуации и создание уникальных торговых предложений (УТП) для каждой компании в группе.',
                  'Продвижение бренда: Построение узнаваемости брендов на локальном и международном уровнях через PR-мероприятия, работу с инфлюенсерами, участие в выставках и конференциях.',
                  'Лидогенерация: Настройка и оптимизация каналов получения лидов, включая создание контента, таргетированную рекламу и парсинг данных из Telegram для маркетингового агентства.',
                  'Управление бюджетом: Эффективное распределение и контроль маркетинговых расходов, оценка рентабельности инвестиций (ROI, ROMI).',
                  'Организация мероприятий: Организация семинаров, вебинаров и других мероприятий для привлечения клиентов и повышения лояльности. Работа с партнёрами и платформами:',
                  'Сотрудничество с OTA-платформами (например, Booking, Airbnb) и специализированными сайтами для продвижения услуг, таких как глэмпинг.',
                  'Координация команды и управление проектами: Постановка задач команде и контроль выполнения проектов, особенно в области разработки лидогенерационных продуктов.',
                  'Аналитика и отчётность: Построение и ведение систем аналитики для мониторинга эффективности маркетинговых кампаний и поведения целевой аудитории.'
                ]
              },
              {
                company: 'ООО "Корпоративный Маркетинг"',
                role: 'Тимлид',
                dates: '03.2024 — н.в.',
                bullets: [
                  'Постановка четких задач и приоритизация работы команды.',
                  'Личная ответственность за проект и соблюдение сроков.',
                  'Поддержка и развитие команды — помощь коллегам в повышении квалификации и решении сложных задач.',
                  'Постоянная коммуникация с заинтересованными сторонами и обеспечение прозрачности процессов.',
                  'Использование Agile-методологий, планирование спринтов и ретроспектив для улучшения качества.'
                ]
              },
              {
                company: 'ООО «Гуд-Зем»',
                role: 'Руководитель отдела маркетинга',
                dates: '08.2023 — 03.2024',
                bullets: [
                  'Разработка и поддержание всех действующих рекламных компаний.',
                  'Координация деятельности всех функциональных подразделений по сбору и анализу коммерческо-экономической информации, созданию банка данных по маркетингу продукции предприятия.',
                  'Осуществление надзора за правильностью транспортировки, хранения и использования продукции.',
                  'Руководство работниками отдела.',
                  'Организация изучения мнения потребителей о выпускаемой предприятием продукции, влияния потребительского мнения на сбыт продукции и подготовку предложений по повышению ее качества и конкурентоспособности.',
                  'Контроль своевременности устранения недостатков, указанных в поступающих от потребителей претензиях и рекламациях.',
                  'Организация разработки стратегии проведения рекламных мероприятий с целью информирования потенциальных покупателей и расширения рынков сбыта.',
                  'Создание предложений по формированию фирменного стиля предприятия и Разработка маркетинговой политики на предприятии',
                  'Проведение исследований основных факторов, которые формируют динамику потребительских качеств конкурирующей продукции.'
                ]
              },
              {
                company: 'ООО «РУСХИМТЕК» (Labim Inc.)',
                role: 'Маркетолог',
                dates: '03.2023 — 08.2023',
                bullets: [
                  'Анализ компании, целевой аудитории, конкурентов, действенных методов рекламы. Анализ текущего состояния рынка.',
                  'Работа с маркетплейсами, анализ продаж и работа с карточками товаров. (Вайлдберис, Озон, Я.Маркет)',
                  'Поиск лидеров мнений для размещения эффективной и высоко окупаемой рекламы.',
                  'Разработка или выбор подходящих форматов рекламы совместно с блогером.',
                  'Запуск рекламных кампаний, отслеживание выполнения задач и оценка эффективности.',
                  'Контроль работы команды: фотограф, дизайнер.',
                  'Анализ эффективности и корректировка стратегии.'
                ]
              },
              {
                company: 'ООО «Новая Земля»',
                role: 'Маркетолог',
                dates: '09.2022 — 03.2023',
                bullets: [
                  'Формирование комплексной стратегии продвижения продукта и бренда компании',
                  'Привлечение смежных подразделений и внешних подрядчиков для реализации стратегии',
                  'Регулярная актуализация используемых каналов и инструментов',
                  'Управление маркетинговым бюджетом, ведение отчётности',
                  'Анализ эффективности используемых каналов и инструментов',
                  'Создание воронки продаж',
                  'Проработка семантики',
                  'Помощь в создании и наполнении сайта',
                  'Проведение рекламных кампаний',
                  'Создание контента, участие в съемках и пр.'
                ]
              },
              {
                company: 'ООО "Интерьерные решения" (ГК "Smart")',
                role: 'Помощник маркетолога (Junior)',
                dates: '10.2021 — 08.2022',
                bullets: [
                  'Анализ экономических показателей рынка',
                  'Анализ экономических показателей компании',
                  'Анализ конкурентов и их положения на рынке',
                  'Проведение маркетинговых мероприятий по поддержанию лояльности клиентов',
                  'Работа с полиграфией, печатными изданиями',
                  'Мониторинг внешней среды',
                  'Разработка маркетинговой стратегии и медиа планирование',
                  'Проведение маркетинговых исследований',
                  'Адаптация маркетинговой стратегии'
                ]
              },
              {
                company: 'ИП ПОПОВ ИВ',
                role: 'Маркетолог, логист',
                dates: '04.2021 — 09.2021',
                bullets: [
                  'Мониторинг за товарной дистрибьюцией',
                  'Мониторинг поставок из Китая в Россию',
                  'Поддержание, редактирование и обновление карточки товара на WildBerries и Ozon',
                  'Настройка Я.Директ',
                  'Работа с полиграфией, печатными изданиями',
                  'Мониторинг внешней среды'
                ]
              }
            ].map((job) => (
              <details key={job.company} className="details">
                <summary className="glass" aria-label={job.company}>
                  <div>
                    <div style={{fontWeight:600}}>{job.company}</div>
                    <div className="small" style={{opacity:.8}}>{job.role}</div>
                    <div className="small" style={{opacity:.65}}>{job.dates}</div>
                  </div>
                  <IconChevron className="chevron"/>
                </summary>
                <div style={{padding:"12px 18px 0 18px"}}>
                  <ul className="bullets">
                    {job.bullets.map((b) => (<li key={b}>{b}</li>))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", marginBottom:16}}>Ключевые навыки</h2>
          <div className="grid grid-3">
            {[
              "Стратегия продвижения",
              "Лидогенерация",
              "SEO, SMM, контекст",
              "Маркетплейсы (WB, Ozon, Я.Маркет)",
              "ROI / ROMI аналитика",
              "Calltouch, Roistat",
              "Яндекс.Метрика, Google Analytics",
              "PR и инфлюенс‑маркетинг",
              "Организация мероприятий",
              "Воронки продаж",
              "Контент и продакшн",
              "Управление командой",
            ].map((s) => (
              <div key={s} className="glass card" style={{display:"flex", alignItems:"center"}}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* QUALITIES */}
      <section id="qualities">
        <div className="container">
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", marginBottom:16}}>Личные качества</h2>
          <div className="grid grid-3">
            {[
              "Энергичность","Инициативность","Самостоятельность","Ответственность","Коммуникабельность","Быстрая обучаемость","Стрессоустойчивость","Трудолюбие","Пунктуальность","Вежливость","Гибкость в общении","Умение работать в коллективе","Четкая дикция","Грамотная речь","Позитивность",
            ].map((q)=> (
              <div key={q} className="badge">{q}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOBBIES */}
      <section id="hobbies">
        <div className="container">
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", marginBottom:16}}>Хобби</h2>
          <div className="glass card small">
            Фитнес, музеи и выставки, баскетбол, гастрономия, прогулки, сноубординг, фильмы, чтение.
          </div>
        </div>
      </section>

      {/* EDUCATION & COURSES */}
      <section id="education">
        <div className="container">
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", marginBottom:16}}>Образование</h2>
          <div className="glass card small">
            <div><strong>РЭУ им. Г.В. Плеханова</strong>, Высшее (2022) — Маркетинга, Маркетолог (38.03.02)</div>
          </div>
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", margin:"24px 0 16px"}}>Курсы</h2>
          <div className="glass card small" style={{display:"grid", gap:6}}>
            <div><strong>РЭУ им. Г.В. Плеханова</strong> (2022) — Экономические курсы для магистров</div>
            <div><strong>Skillbox</strong> (2023) — Профессия Маркетолог (Таргетинг, SMM)</div>
          </div>
        </div>
      </section>

      <section id="contacts">
        <div className="container">
          <h2 style={{fontSize:28, fontWeight:600, letterSpacing:"-0.01em", marginBottom:16}}>Контакты</h2>
          <div className="glass card" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap"}}>
            <div className="small" style={{display:"grid", gap:6}}>
              <div>Телефон: <a style={{textDecoration:"underline"}} href={telHref}>{phone}</a></div>
              <div>E‑mail: <a style={{textDecoration:"underline"}} href={`mailto:${email}`}>{email}</a></div>
              <div>Telegram: <a style={{textDecoration:"underline"}} target="_blank" rel="noreferrer" href={tgHref}>@{tgHandle}</a></div>
            </div>
            <div style={{display:"flex", gap:12}}>
              <a className="btn" href={tgHref} target="_blank" rel="noreferrer"><IconSend/>Написать</a>
              <a className="btn btn-outline" href="callto:+79267943537"><IconPhone/>Позвонить</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="footer">
        <div className="container">
          <div style={{fontWeight:600}}>Хочу работать в Яндекс</div>
          <div style={{marginTop:6}}>© {new Date().getFullYear()} Олег Прокуронов</div>
        </div>
      </div>
    </div>
  );
}

// --- Inline SVG icons (no external deps) ---
function IconSend(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 2L11 13"/>
      <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  );
}
function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0  0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.2a2 2 0 0 1 2.11-.45 12.7 12.7 0 0 0 2.61.62A2 2 0  0 1 22 16.92z"/>
    </svg>
  );
}
function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/>
      <path d="M12 5l7 7-7 7"/>
    </svg>
  );
}
function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16v16H4z"/>
      <path d="M22 6l-10 7L2 6"/>
    </svg>
  );
}
function IconMapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
