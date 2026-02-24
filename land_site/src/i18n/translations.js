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
      title: 'Blue Cat',
      subtitle: 'Websites that look premium, load fast, and convert. We design and build landing pages and web experiences tailored to your business goals.',
      ctaContact: 'Contact',
      ctaWorks: 'View works',
    },
    about: {
      title: 'About us',
      intro: 'We are a small team of developers building modern websites and web applications for businesses.',
      skills: 'Our team includes frontend and backend specialists. We work with HTML, CSS, JavaScript, React, Node.js, Python, and REST APIs to deliver fast, responsive, and user-friendly products.',
      approach: 'We focus on clean code, clear communication, and predictable timelines. Beyond new builds, we also support and redesign existing websites: improve UX/UI, reconnect integrations, update content, and help with database/content population when needed. Whether you need a landing page, a full website, or backend integrations — we build solutions you can rely on.',
      cta: "Let's work together. Get in touch.",
      githubTitle: 'GitHub',
      githubText: 'Code samples, projects, and experiments',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Professional background and experience',
    },
    works: {
      title: 'Our works',
      body: 'A curated selection of projects we’ve delivered — from clean landing pages to full web experiences.',
      projects: {
        crm: {
          title: 'Pet Project CRM',
          desc: 'A CRM pet project aimed at small teams: authentication, roles, and a clean workspace for managing customers, deals, and tasks. The focus is on a modern UI, clear information hierarchy, and scalable architecture — built as a full‑stack learning project with production‑like patterns.',
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
      title: 'Blue Cat',
      subtitle: 'Сайты премиального уровня: быстрые, понятные и конверсионные. Делаем лендинги и веб‑решения под задачи вашего бизнеса.',
      ctaContact: 'Связаться',
      ctaWorks: 'Портфолио',
    },
    about: {
      title: 'О нас',
      intro: 'Мы — небольшая команда разработчиков, которая создаёт современные сайты и веб‑приложения для бизнеса.',
      skills: 'У нас есть специалисты по фронтенду и бэкенду. Работаем с HTML, CSS, JavaScript, React, Node.js, Python и REST API — делаем быстрые, адаптивные и удобные продукты.',
      approach: 'Мы ценим качественный код, понятную коммуникацию и соблюдение сроков. Помимо разработки с нуля, берём в поддержку и редизайн существующие сайты: улучшаем UX/UI, переподключаем интеграции, обновляем контент, при необходимости помогаем с наполнением базы/данных. Лендинг, полноценный сайт или интеграции с бэкендом — результат, на который можно положиться.',
      cta: 'Давайте работать вместе. Свяжитесь с нами.',
      githubTitle: 'GitHub',
      githubText: 'Примеры кода, проекты и эксперименты',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Опыт и профессиональный профиль',
    },
    works: {
      title: 'Наши работы',
      body: 'Подборка проектов, которые мы уже реализовали — от лендингов до полноценных веб‑решений.',
      projects: {
        crm: {
          title: 'Pet Project CRM',
          desc: 'CRM pet‑проект для небольших команд: авторизация, роли, понятное рабочее пространство для клиентов, сделок и задач. Акцент на современный интерфейс, читабельность, структуру данных и масштабируемую архитектуру — учебный full‑stack проект в стиле «как в продакшене».',
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
      title: 'Blue Cat',
      subtitle: 'אתרי פרימיום: נראים מצוין, נטענים מהר וממירים. אנחנו בונים דפי נחיתה וחוויות ווב לפי מטרות העסק שלך.',
      ctaContact: 'צור קשר',
      ctaWorks: 'תיק עבודות',
    },
    about: {
      title: 'עלינו',
      intro: 'אנחנו צוות קטן של מפתחים שבונה אתרים ואפליקציות ווב מודרניים לעסקים.',
      skills: 'בצוות שלנו יש מומחי פרונטאנד ובקאנד. אנחנו עובדים עם HTML, CSS, JavaScript, React, Node.js, Python ו-REST API כדי לספק מוצרים מהירים, רספונסיביים וידידותיים למשתמש.',
      approach: 'אנחנו מתמקדים בקוד איכותי, תקשורת ברורה ועמידה בזמנים. מעבר לפיתוח מאפס, אנחנו גם נותנים תמיכה ורידיזיין לאתרים קיימים: שיפור UX/UI, חיבור מחדש של אינטגרציות, עדכון תוכן, ובמידת הצורך עזרה בהזנת נתונים/מאגר. דף נחיתה, אתר מלא או אינטגרציות בקאנד — אנחנו מספקים פתרונות שאפשר לסמוך עליהם.',
      cta: 'בואו נעבוד יחד. צרו קשר.',
      githubTitle: 'GitHub',
      githubText: 'דוגמאות קוד, פרויקטים וניסויים',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'פרופיל מקצועי וניסיון',
    },
    works: {
      title: 'העבודות שלנו',
      body: 'מבחר פרויקטים שביצענו — מדפי נחיתה נקיים ועד חוויות ווב מלאות.',
      projects: {
        crm: {
          title: 'Pet Project CRM',
          desc: 'פרויקט CRM ללמידה עבור צוותים קטנים: הרשאות ותפקידים, סביבת עבודה מסודרת לניהול לקוחות, עסקאות ומשימות. הדגש הוא על UI מודרני, היררכיית מידע ברורה וארכיטקטורה שניתנת להרחבה — פרויקט full‑stack בסגנון פרודקשן.',
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
