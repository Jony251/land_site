export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'ru', label: 'RU', dir: 'ltr' },
  { code: 'he', label: 'HE', dir: 'rtl' },
];

export const DEFAULT_LANGUAGE = 'en';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      works: 'Works',
      services: 'Services',
      contact: 'Contact',
    },
    home: {
      eyebrow: 'Full-stack development studio',
      title: 'We build sites people trust — and systems businesses run on.',
      subtitle: 'From one-page landing sites to full web applications and role-based CRM systems — plus AI features like on-site chat assistants and predictive analytics, built in when your product needs them.',
      ctaContact: 'Start a project',
      ctaWorks: 'View works',
      flagshipEyebrow: 'Featured system',
      flagshipCta: 'See the case study',
      capabilitiesTitle: 'What we build',
      capabilitiesLead: 'Five levels, one team — pick where your project starts.',
      featuredTitle: 'Proof, not promises',
      featuredLead: 'Real projects that show the range, from clean UI to full backend systems.',
    },
    about: {
      title: 'About us',
      intro: 'We are a small team of developers building modern websites and web applications for businesses.',
      skills: 'Our team includes frontend and backend specialists. We work with HTML, CSS, JavaScript, React, Node.js, Python, and REST APIs to deliver fast, responsive, and user-friendly products.',
      approach: 'We focus on clean code, clear communication, and predictable timelines. Beyond new builds, we also support and redesign existing websites: improve UX/UI, reconnect integrations, update content, and help with database/content population when needed. Whether you need a landing page, a full website, or backend integrations — we build solutions you can rely on.',
      range: 'Our range runs from fast one-page sites to full-stack web apps and role-based CRM systems with their own database — and we can add AI on top: chat assistants for your visitors, or predictive analytics inside your dashboards.',
      cta: "Let's work together. Get in touch.",
      githubTitle: 'GitHub',
      githubText: 'Code samples, projects, and experiments',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Professional background and experience',
    },
    works: {
      title: 'Our works',
      body: 'A curated selection of projects we’ve delivered — from clean landing pages to full web experiences.',
      filters: {
        all: 'All',
        flagship: 'Systems',
        product: 'Business sites',
        craft: 'Quick builds',
      },
      tier: {
        flagship: 'Web App / System',
        product: 'Business site',
        craft: 'Landing',
      },
      case: {
        problem: 'Problem',
        solution: 'Solution',
        stack: 'Stack',
        result: 'What it demonstrates',
      },
      projects: {
        crm: {
          title: 'Pet Project CRM',
          desc: 'A CRM pet project aimed at small teams: authentication, roles, and a clean workspace for managing customers, deals, and tasks. The focus is on a modern UI, clear information hierarchy, and scalable architecture — built as a full‑stack learning project with production‑like patterns.',
          case: {
            problem: 'Small teams often run sales on spreadsheets: no deal stages, no permission levels between managers and admins, no visibility into who is converting.',
            solution: 'A full CRM with a drag‑and‑drop Kanban pipeline, customer records with interaction history, task deadlines, three access roles (admin / manager / viewer), and an analytics dashboard for conversion and revenue.',
            stack: 'React + TypeScript, Redux Toolkit, Material UI, Recharts on the frontend. Node.js + Express, JWT auth, Zod validation on the backend. PostgreSQL + Prisma for data, Docker Compose for deployment, Swagger for API docs.',
            result: 'Demonstrates a complete production‑style full‑stack cycle: typed state management, a protected REST API, role‑based access, containerized deployment, and a relational database via an ORM.',
          },
        },
        android: {
          title: 'Android Game App',
          desc: 'A mobile game app built in Android Studio with authentication, Firebase integration, and gameplay flow. The project explores UI screens, state handling, navigation, and a complete user journey — from onboarding/login to core gameplay and progress screens.',
        },
        crossplatform: {
          title: 'Whale Business',
          desc: 'A business platform / startup landing experience with authentication and registration. The emphasis is on a premium first impression: clear value proposition, a polished sign‑in flow, responsive layout, and a consistent UI system that can scale as the product grows.',
        },
        cross_II: {
          title: 'Cross-Platform App II',
          desc: 'An advanced cross‑platform app concept featuring profiles, collection management, and wishlist flows. Built to validate UX patterns across devices: structured navigation, reusable components, and “product‑like” screens that demonstrate how features connect end‑to‑end.',
        },
        learning: {
          title: 'Learning Platform',
          desc: 'An educational platform with interactive mini‑games and content screens. The project is focused on clarity and engagement: lightweight UI, simple navigation, and a structure that supports expanding content, tracking progress, and delivering a smooth learning experience.',
        },
        massage: {
          title: 'Massage Website',
          desc: 'A landing page for a massage studio designed to convert visitors into bookings. Includes clear service sections, strong visual hierarchy, trust‑building blocks, and a direct contact path — optimized for mobile and fast loading.',
        },
        change_web: {
          title: 'Change Web',
          desc: 'A modern Vue 3 + Vite website prototype with a custom teal‑based design system. Built as a clean, responsive UI foundation with reusable sections and a contact flow (EmailJS-ready) — designed to feel premium, load fast, and be easy to extend as the product evolves.',
        },
        landfolio: {
          title: 'Portfolio Landing',
          desc: 'A portfolio landing page built with Vue 3 and Vite — a fast, modern SPA that presents projects and expertise with a clean structure, responsive layout, and smooth interactions. Designed to build trust, showcase work with clear visuals, and guide visitors to contact or booking.',
        },
        aispace: {
          title: 'AI Space',
          desc: 'A modern AI‑themed web UI concept with a chat‑like flow and feature sections. Built to experiment with UX patterns, layout systems, responsive components, and a clean “product demo” presentation that can later be connected to real AI APIs.',
          case: {
            problem: 'Products that add an AI chat layer need an interface that feels native, not bolted on: a real conversation flow, not just a text box.',
            solution: 'A typed, component‑based chat interface with dedicated feature sections — a product‑demo shell ready to connect to a real AI backend.',
            stack: 'Vue 3, TypeScript, CSS3 — a typed component architecture built for a conversational UI.',
            result: 'Shows the frontend side of AI‑product work: chat UX, layout systems for feature‑rich screens, and a demo shell ready to wire up to a live AI API — the same approach we use for AI‑integration work (see Services).',
          },
        },
      },
    },
    contact: {
      title: 'Contact',
      body: 'Send a message and I’ll get back to you.',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send',
        reset: 'Reset',
        sending: 'Sending...',
        success: 'Message sent successfully.',
        error: 'Failed to send message. Please try again.',
        notConfigured: 'Email service is not configured yet. Add EmailJS keys to your .env file.',
        hint: 'To enable email sending, set EmailJS keys in a .env file.',
      },
    },
    tech: {
      title: 'Technologies used',
    },
    services: {
      title: 'Our Services',
      s1: {
        title: 'Landing Page (One-page)',
        desc: 'Conversion-focused landing pages with clear structure, strong copy, and fast load time — built to turn visitors into leads and customers.',
      },
      s2: {
        title: 'Ongoing Support',
        desc: 'We keep your website stable and secure: monitoring, bug fixes, small improvements, and quick iterations when your business needs changes.',
      },
      s3: {
        title: 'Website Updates & Upgrades',
        desc: 'Need new features or a refresh? We add new sections, improve UX, optimize performance/SEO, and update content without breaking what already works.',
      },
      s4: {
        title: 'Backend & API Integrations',
        desc: 'We connect forms, payments, CRM, and other services via APIs. From simple automations to custom backend logic — everything works end‑to‑end.',
      },
      s5: {
        title: 'AI Integrations',
        desc: 'Add AI where it earns its place: chat assistants that support your visitors on‑site, and predictive analytics inside CRMs and dashboards — deal scoring, revenue forecasts, LLM‑driven automation.',
      },
    },
    a11y: {
      title: 'Accessibility',
      reset: 'Reset',
      textSize: 'Text size',
      highContrast: 'High contrast',
      reduceMotion: 'Reduce motion',
    },
    finalCta: {
      aria: 'Contact us call to action',
      title: 'Contact us',
      subtitle: 'Get a modern website for your business. Order now and get 1 month of support for free.',
      lead: 'Have a question, need a quote, or want to discuss your project? Send a message — I’ll reply quickly and help you choose the best solution.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      scroll: 'Or send a message below',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'Обо мне',
      works: 'Работы',
      services: 'Услуги',
      contact: 'Контакты',
    },
    home: {
      eyebrow: 'Студия full-stack разработки',
      title: 'Строим сайты, которым доверяют — и системы, на которых держится бизнес.',
      subtitle: 'От одностраничного лендинга до полноценных веб‑приложений и CRM-систем с ролями — а также AI-возможности: чат-ассистенты на сайте и прогнозная аналитика там, где это нужно продукту.',
      ctaContact: 'Обсудить проект',
      ctaWorks: 'Портфолио',
      flagshipEyebrow: 'Флагманская система',
      flagshipCta: 'Смотреть кейс',
      capabilitiesTitle: 'Что мы строим',
      capabilitiesLead: 'Пять уровней, одна команда — выбирайте, с чего начать.',
      featuredTitle: 'Доказательства, а не обещания',
      featuredLead: 'Реальные проекты, которые показывают диапазон — от аккуратного UI до полноценного бэкенда.',
    },
    about: {
      title: 'О нас',
      intro: 'Мы — небольшая команда разработчиков, которая создаёт современные сайты и веб‑приложения для бизнеса.',
      skills: 'У нас есть специалисты по фронтенду и бэкенду. Работаем с HTML, CSS, JavaScript, React, Node.js, Python и REST API — делаем быстрые, адаптивные и удобные продукты.',
      approach: 'Мы ценим качественный код, понятную коммуникацию и соблюдение сроков. Помимо разработки с нуля, берём в поддержку и редизайн существующие сайты: улучшаем UX/UI, переподключаем интеграции, обновляем контент, при необходимости помогаем с наполнением базы/данных. Лендинг, полноценный сайт или интеграции с бэкендом — результат, на который можно положиться.',
      range: 'Наш диапазон — от быстрых лендингов до full-stack веб-приложений и CRM-систем с ролями и собственной базой данных. Поверх этого можем внедрить AI: чат-ассистента для посетителей сайта или прогнозную аналитику внутри дашбордов.',
      cta: 'Давайте работать вместе. Свяжитесь с нами.',
      githubTitle: 'GitHub',
      githubText: 'Примеры кода, проекты и эксперименты',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Опыт и профессиональный профиль',
    },
    works: {
      title: 'Наши работы',
      body: 'Подборка проектов, которые мы уже реализовали — от лендингов до полноценных веб‑решений.',
      filters: {
        all: 'Все',
        flagship: 'Системы',
        product: 'Сайты для бизнеса',
        craft: 'Быстрые проекты',
      },
      tier: {
        flagship: 'Web App / Система',
        product: 'Сайт для бизнеса',
        craft: 'Лендинг',
      },
      case: {
        problem: 'Проблема',
        solution: 'Решение',
        stack: 'Стек',
        result: 'Что демонстрирует',
      },
      projects: {
        crm: {
          title: 'Pet Project CRM',
          desc: 'CRM pet‑проект для небольших команд: авторизация, роли, понятное рабочее пространство для клиентов, сделок и задач. Акцент на современный интерфейс, читабельность, структуру данных и масштабируемую архитектуру — учебный full‑stack проект в стиле «как в продакшене».',
          case: {
            problem: 'Небольшие команды часто ведут продажи в таблицах: без стадий сделки, без разграничения прав между менеджерами и админом, без видимости по конверсии и выручке.',
            solution: 'Полноценная CRM с Kanban-доской сделок (drag-and-drop по стадиям), карточками клиентов с историей взаимодействий, задачами с дедлайнами, тремя уровнями доступа (админ / менеджер / наблюдатель) и дашбордом аналитики по конверсии и выручке.',
            stack: 'Frontend: React + TypeScript, Redux Toolkit, Material UI, Recharts. Backend: Node.js + Express, JWT-аутентификация, валидация Zod. База данных: PostgreSQL + Prisma. Деплой: Docker Compose. Документация API: Swagger.',
            result: 'Демонстрирует полный production-цикл full-stack разработки: типизированный фронтенд с менеджментом состояния, защищённый REST API, ролевую модель доступа, контейнеризацию и работу с реляционной БД через ORM.',
          },
        },
        android: {
          title: 'Android-игра',
          desc: 'Мобильная игра на Android Studio: авторизация, интеграция с Firebase и полноценный пользовательский сценарий. Проект проработан как продукт: экраны входа/онбординга, навигация, игровой процесс и экраны прогресса.',
        },
        crossplatform: {
          title: 'Whale Business',
          desc: 'Платформа/стартап‑проект с лендингом и входом в систему: регистрация, авторизация и аккуратный премиальный интерфейс. Основная идея — «сильный первый экран»: понятный оффер, продуманный вход, адаптивность и единая дизайн‑система для дальнейшего развития продукта.',
        },
        cross_II: {
          title: 'Кроссплатформенное приложение II',
          desc: 'Продвинутое кроссплатформенное приложение: профили, управление коллекциями и wishlist‑сценарии. Сделано для демонстрации UX‑паттернов на разных устройствах: структура экранов, переиспользуемые компоненты и логика фич «сквозным» потоком.',
        },
        learning: {
          title: 'Образовательная платформа',
          desc: 'Образовательная платформа с интерактивными мини‑играми и контент‑экранами. Фокус на простоте и вовлечении: понятная навигация, лёгкий интерфейс и структура, которую можно расширять новыми уроками, прогрессом и заданиями.',
        },
        massage: {
          title: 'Сайт массажного салона',
          desc: 'Конверсионный лендинг для массажного салона: чёткая структура услуг, визуальные акценты, блоки доверия и быстрый путь к записи/контакту. Оптимизирован под мобильные устройства и быструю загрузку.',
        },
        change_web: {
          title: 'Change Web',
          desc: 'Современный сайт‑прототип на Vue 3 + Vite с кастомной дизайн‑системой в бирюзовой палитре. Сделан как чистая, адаптивная UI‑основа: переиспользуемые секции, аккуратная типографика и контактный сценарий (готов к EmailJS). Подходит как «премиальный фундамент» — быстро загружается и легко расширяется по мере развития проекта.',
        },
        landfolio: {
          title: 'Портфолио-лендинг',
          desc: 'Портфолио‑лендинг на Vue 3 и Vite — быстрый современный SPA, который аккуратно показывает проекты и экспертизу: понятная структура, адаптивная верстка и плавные взаимодействия. Задача — повысить доверие, красиво презентовать кейсы и привести посетителя к контакту/заявке.',
        },
        aispace: {
          title: 'AI Space',
          desc: 'Концепт современного интерфейса в AI‑стиле: чат‑флоу, секции фич и аккуратная подача как «демо продукта». Проект для экспериментов с UX‑паттернами, компоновкой, адаптивными компонентами и дальнейшей интеграции с AI‑API.',
          case: {
            problem: 'Продуктам, где появляется AI-чат, нужен интерфейс, который ощущается органичной частью продукта, а не «приклеенным» текстовым полем.',
            solution: 'Типизированный, компонентный чат-интерфейс с отдельными блоками фич — готовая оболочка «демо продукта» для подключения к реальному AI-бэкенду.',
            stack: 'Vue 3, TypeScript, CSS3 — типизированная компонентная архитектура, спроектированная под диалоговый UI.',
            result: 'Показывает фронтенд-сторону работы с AI-продуктами: UX чата, системы компоновки для насыщенных фичами экранов и готовую демо-оболочку для подключения к живому AI API — тот же подход, что мы используем в услуге «AI-интеграции» (см. Услуги).',
          },
        },
      },
    },
    contact: {
      title: 'Контакты',
      body: 'Напишите сообщение — я отвечу как можно быстрее.',
      form: {
        name: 'Имя',
        email: 'Email',
        message: 'Сообщение',
        send: 'Отправить',
        reset: 'Сброс',
        sending: 'Отправка...',
        success: 'Сообщение отправлено.',
        error: 'Не удалось отправить сообщение. Попробуйте ещё раз.',
        notConfigured: 'Email сервис не настроен. Добавьте ключи EmailJS в .env файл.',
        hint: 'Чтобы включить отправку email, добавьте ключи EmailJS в .env файл.',
      },
    },
    tech: {
      title: 'Технологии',
    },
    services: {
      title: 'Наши услуги',
      s1: {
        title: 'Лендинг (One-page)',
        desc: 'Конверсионные лендинги с понятной структурой, сильным оффером и высокой скоростью загрузки — чтобы посетители становились лидами и клиентами.',
      },
      s2: {
        title: 'Поддержка и сопровождение',
        desc: 'Держим сайт в форме: мониторинг, исправление багов, мелкие улучшения и быстрые правки, когда бизнесу нужно что‑то поменять.',
      },
      s3: {
        title: 'Обновление и доработка сайтов',
        desc: 'Добавим новые фичи и секции, улучшим UX, оптимизируем скорость/SEO, обновим контент и дизайн — без поломки существующей логики.',
      },
      s4: {
        title: 'Интеграции бэкенда и API',
        desc: 'Подключаем формы, оплаты, CRM и другие сервисы через API. От простых автоматизаций до кастомной серверной логики — всё под ключ.',
      },
      s5: {
        title: 'AI-интеграции',
        desc: 'Добавляем AI там, где он реально полезен: чат-ассистенты для поддержки посетителей на сайте и прогнозная аналитика внутри CRM/дашбордов — скоринг сделок, прогноз выручки, автоматизация на основе LLM.',
      },
    },
    a11y: {
      title: 'Доступность',
      reset: 'Сброс',
      textSize: 'Размер текста',
      highContrast: 'Высокий контраст',
      reduceMotion: 'Без анимаций',
    },
    finalCta: {
      aria: 'Призыв связаться с нами',
      title: 'Связаться с нами',
      subtitle: 'Сделаем современный сайт для вашего бизнеса. Закажите сейчас и получите 1 месяц поддержки бесплатно.',
      lead: 'Есть вопрос, нужен расчёт или хотите обсудить проект? Напишите — отвечу оперативно и помогу выбрать лучший вариант.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      scroll: 'Или отправьте сообщение ниже',
    },
  },
  he: {
    nav: {
      home: 'בית',
      about: 'אודות',
      works: 'עבודות',
      services: 'שירותים',
      contact: 'צור קשר',
    },
    home: {
      eyebrow: 'סטודיו לפיתוח Full-Stack',
      title: 'בונים אתרים שסומכים עליהם — ומערכות שהעסק שלכם רץ עליהן.',
      subtitle: 'מדף נחיתה אחד ועד אפליקציות ווב מלאות ומערכות CRM עם הרשאות — ועוד יכולות AI כמו צ׳אט-בוט באתר וניתוח חיזוי, במקום שבו המוצר שלכם צריך את זה.',
      ctaContact: 'בואו נתחיל פרויקט',
      ctaWorks: 'לתיק העבודות',
      flagshipEyebrow: 'מערכת נבחרת',
      flagshipCta: 'לצפייה בקייס',
      capabilitiesTitle: 'מה אנחנו בונים',
      capabilitiesLead: 'חמש רמות, צוות אחד — בחרו מאיפה להתחיל.',
      featuredTitle: 'הוכחות, לא הבטחות',
      featuredLead: 'פרויקטים אמיתיים שמציגים את הטווח — מ-UI מסודר ועד מערכת בקאנד מלאה.',
    },
    about: {
      title: 'עלינו',
      intro: 'אנחנו צוות קטן של מפתחים שבונה אתרים ואפליקציות ווב מודרניים לעסקים.',
      skills: 'בצוות שלנו יש מומחי פרונטאנד ובקאנד. אנחנו עובדים עם HTML, CSS, JavaScript, React, Node.js, Python ו-REST API כדי לספק מוצרים מהירים, רספונסיביים וידידותיים למשתמש.',
      approach: 'אנחנו מתמקדים בקוד איכותי, תקשורת ברורה ועמידה בזמנים. מעבר לפיתוח מאפס, אנחנו גם נותנים תמיכה ורידיזיין לאתרים קיימים: שיפור UX/UI, חיבור מחדש של אינטגרציות, עדכון תוכן, ובמידת הצורך עזרה בהזנת נתונים/מאגר. דף נחיתה, אתר מלא או אינטגרציות בקאנד — אנחנו מספקים פתרונות שאפשר לסמוך עליהם.',
      range: 'הטווח שלנו נע מדפי נחיתה מהירים ועד אפליקציות ווב full-stack ומערכות CRM עם הרשאות ומסד נתונים משלהן. מעבר לזה אפשר להוסיף AI: צ׳אט-בוט לתמיכה במבקרי האתר, או ניתוח חיזוי בתוך הדשבורדים.',
      cta: 'בואו נעבוד יחד. צרו קשר.',
      githubTitle: 'GitHub',
      githubText: 'דוגמאות קוד, פרויקטים וניסויים',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'פרופיל מקצועי וניסיון',
    },
    works: {
      title: 'העבודות שלנו',
      body: 'מבחר פרויקטים שביצענו — מדפי נחיתה נקיים ועד חוויות ווב מלאות.',
      filters: {
        all: 'הכל',
        flagship: 'מערכות',
        product: 'אתרים לעסקים',
        craft: 'פרויקטים מהירים',
      },
      tier: {
        flagship: 'Web App / מערכת',
        product: 'אתר לעסק',
        craft: 'דף נחיתה',
      },
      case: {
        problem: 'הבעיה',
        solution: 'הפתרון',
        stack: 'הטכנולוגיות',
        result: 'מה זה מדגים',
      },
      projects: {
        crm: {
          title: 'Pet Project CRM',
          desc: 'פרויקט CRM ללמידה עבור צוותים קטנים: הרשאות ותפקידים, סביבת עבודה מסודרת לניהול לקוחות, עסקאות ומשימות. הדגש הוא על UI מודרני, היררכיית מידע ברורה וארכיטקטורה שניתנת להרחבה — פרויקט full‑stack בסגנון פרודקשן.',
          case: {
            problem: 'צוותים קטנים מנהלים לעיתים קרובות מכירות בטבלאות: בלי שלבי עסקה, בלי הפרדת הרשאות בין מנהלים לאדמין, ובלי ראות על קצב ההמרה וההכנסות.',
            solution: 'מערכת CRM מלאה עם לוח Kanban לגרירה בין שלבי העסקה, כרטיסי לקוח עם היסטוריית אינטראקציות, משימות עם תאריכי יעד, שלוש רמות הרשאה (אדמין / מנהל / צופה) ודשבורד אנליטיקה להמרה ולהכנסות.',
            stack: 'פרונטאנד: React + TypeScript, Redux Toolkit, Material UI, Recharts. בקאנד: Node.js + Express, אימות JWT, ולידציה עם Zod. מסד נתונים: PostgreSQL + Prisma. פריסה: Docker Compose. תיעוד API: Swagger.',
            result: 'מדגים מחזור פיתוח full-stack מלא ברמת פרודקשן: פרונטאנד מוקלד עם ניהול מצב, REST API מאובטח, מודל הרשאות לפי תפקיד, קונטיינריזציה ועבודה עם מסד נתונים יחסי דרך ORM.',
          },
        },
        android: {
          title: 'אפליקציית משחק לאנדרואיד',
          desc: 'אפליקציית משחק מובייל שנבנתה ב-Android Studio עם אימות משתמשים, Firebase וזרימת משחק מלאה. הפרויקט בוחן מסכים, ניווט, ניהול מצב וחוויית משתמש מקצה לקצה — מהתחברות ועד התקדמות במשחק.',
        },
        crossplatform: {
          title: 'Whale Business',
          desc: 'חוויית מוצר/סטארטאפ עם דף נחיתה וזרימת התחברות: הרשמה, אימות וממשק פרימיום עקבי. המטרה היא “רושם ראשון חזק” — מסר ברור, כניסה חלקה, רספונסיביות ועיצוב שניתן להרחבה ככל שהמוצר מתקדם.',
        },
        cross_II: {
          title: 'קרוספלטפורם II',
          desc: 'אפליקציה מתקדמת חוצת פלטפורמות: פרופילים, ניהול אוספים וזרימות wishlist. נבנתה כדי להדגים UX בין‑מכשירי: מבנה מסכים, רכיבים חוזרים וזרימה “מוצרית” שמחברת פיצ׳רים מקצה לקצה.',
        },
        learning: {
          title: 'פלטפורמת למידה',
          desc: 'פלטפורמת למידה עם מיני‑משחקים אינטראקטיביים ומסכי תוכן. הדגש הוא על חוויה ברורה ומעודדת שימוש: ניווט פשוט, ממשק קליל ומבנה שמאפשר להוסיף תכנים, לעקוב אחרי התקדמות ולהרחיב את המערכת.',
        },
        massage: {
          title: 'אתר עיסוי',
          desc: 'דף נחיתה לסטודיו לעיסוי שמיועד להמרה: מבנה שירותים ברור, היררכיית טקסט חזקה, אלמנטים שמייצרים אמון וקריאה לפעולה ישירה. מותאם למובייל ומכוון לביצועים מהירים.',
        },
        change_web: {
          title: 'Change Web',
          desc: 'אב‑טיפוס אתר מודרני ב‑Vue 3 + Vite עם Design System מותאם בצבעי טורקיז. נבנה כבסיס UI נקי ורספונסיבי עם סקשנים חוזרים וזרימת יצירת קשר (מוכן ל‑EmailJS) — נראה פרימיום, נטען מהר וקל להרחבה ככל שהמוצר מתקדם.',
        },
        landfolio: {
          title: 'דף נחיתה לתיק עבודות',
          desc: 'דף נחיתה לתיק עבודות שנבנה עם Vue 3 ו-Vite — SPA מהיר ומודרני שמציג פרויקטים ומומחיות בצורה נקייה ומסודרת: מבנה ברור, עיצוב רספונסיבי ואינטראקציות חלקות. מתאים לבניית אמון, להצגת עבודות בצורה חזקה, ולהובלת מבקרים ליצירת קשר/השארת פרטים.',
        },
        aispace: {
          title: 'AI Space',
          desc: 'קונספט UI מודרני בסגנון AI עם זרימת צ׳אט וסקשנים של פיצ׳רים — מוצג כמו דמו של מוצר אמיתי. הפרויקט נועד לניסויי UX, פריסה ורכיבים רספונסיביים, ויכול בהמשך להתחבר ל‑AI APIs אמיתיים.',
          case: {
            problem: 'מוצרים שמוסיפים שכבת צ׳אט AI צריכים ממשק שמרגיש טבעי, לא ״מודבק״ — זרימת שיחה אמיתית, לא רק תיבת טקסט.',
            solution: 'ממשק צ׳אט מוקלד ומבוסס-רכיבים עם סקשנים ייעודיים לפיצ׳רים — מעטפת ״דמו מוצר״ מוכנה לחיבור לבקאנד AI אמיתי.',
            stack: 'Vue 3, TypeScript, CSS3 — ארכיטקטורת רכיבים מוקלדת שנבנתה עבור ממשק שיחתי.',
            result: 'מציג את הצד הפרונטאלי של עבודה עם מוצרי AI: UX של צ׳אט, מערכות פריסה למסכים עתירי פיצ׳רים, ומעטפת דמו מוכנה לחיבור ל-AI API אמיתי — אותה גישה שבה אנחנו משתמשים בשירות ״אינטגרציות AI״ (ראו שירותים).',
          },
        },
      },
    },
    contact: {
      title: 'צור קשר',
      body: 'שלח הודעה ואחזור אליך בהקדם.',
      form: {
        name: 'שם',
        email: 'אימייל',
        message: 'הודעה',
        send: 'שלח',
        reset: 'איפוס',
        sending: 'שולח...',
        success: 'ההודעה נשלחה בהצלחה.',
        error: 'שליחת ההודעה נכשלה. נסה שוב.',
        notConfigured: 'שירות המייל לא מוגדר עדיין. הוסף מפתחות EmailJS לקובץ .env.',
        hint: 'כדי להפעיל שליחת מייל, הוסף מפתחות EmailJS לקובץ .env.',
      },
    },
    tech: {
      title: 'טכנולוגיות',
    },
    services: {
      title: 'השירותים שלנו',
      s1: {
        title: 'עמוד נחיתה (One-page)',
        desc: 'דפי נחיתה ממוקדי המרה עם מבנה ברור, מסרים חזקים וזמן טעינה מהיר — כדי להפוך מבקרים ללידים וללקוחות.',
      },
      s2: {
        title: 'תמיכה וליווי מתמשך',
        desc: 'שומרים על האתר יציב ומאובטח: ניטור, תיקון תקלות, שיפורים קטנים ועדכונים מהירים כשצריך לשנות משהו בעסק.',
      },
      s3: {
        title: 'עדכון ושדרוג אתרים קיימים',
        desc: 'הוספת פיצ׳רים וסקשנים, שיפור UX, אופטימיזציה למהירות/SEO ועדכון תוכן ועיצוב — בלי לשבור מה שכבר עובד.',
      },
      s4: {
        title: 'אינטגרציות בקאנד ו-API',
        desc: 'מחברים טפסים, תשלומים, CRM ושירותים נוספים דרך APIs. מאוטומציות פשוטות ועד לוגיקה מותאמת אישית — מקצה לקצה.',
      },
      s5: {
        title: 'אינטגרציות AI',
        desc: 'מוסיפים AI במקום שבו הוא באמת מועיל: צ׳אט-בוטים לתמיכה במבקרי האתר, וניתוח חיזוי בתוך CRM ודשבורדים — דירוג עסקאות, תחזיות הכנסות, אוטומציה מבוססת LLM.',
      },
    },
    a11y: {
      title: 'נגישות',
      reset: 'איפוס',
      textSize: 'גודל טקסט',
      highContrast: 'ניגודיות גבוהה',
      reduceMotion: 'ללא אנימציות',
    },
    finalCta: {
      aria: 'קריאה לפעולה יצירת קשר',
      title: 'צור קשר',
      subtitle: 'נבנה עבורך אתר מודרני לעסק. הזמן עכשיו וקבל חודש תמיכה חינם.',
      lead: 'יש שאלה, צריך הצעת מחיר או רוצה לדבר על הפרויקט? שלחו הודעה — אחזור אליכם במהירות ואעזור לבחור את הפתרון המתאים.',
      whatsapp: 'WhatsApp',
      email: 'אימייל',
      scroll: 'או שלחו הודעה כאן למטה',
    },
  },
};
