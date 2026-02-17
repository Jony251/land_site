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
        android: {
          title: 'Android Game App',
          desc: 'A mobile game application built with Android Studio featuring user authentication and gameplay mechanics.',
        },
        crossplatform: {
          title: 'Cross-Platform App',
          desc: 'A cross-platform application designed to work seamlessly across multiple devices and operating systems.',
        },
        cross_II: {
          title: 'Cross-Platform App II',
          desc: 'An advanced cross-platform application with collection management, user profiles, and wishlist features.',
        },
        learning: {
          title: 'Learning Platform',
          desc: 'An educational platform with interactive games and content management for effective learning.',
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
        android: {
          title: 'Android-игра',
          desc: 'Мобильное игровое приложение на Android Studio с авторизацией и игровой механикой.',
        },
        crossplatform: {
          title: 'Кроссплатформенное приложение',
          desc: 'Приложение, работающее на разных устройствах и операционных системах.',
        },
        cross_II: {
          title: 'Кроссплатформенное приложение II',
          desc: 'Продвинутое кроссплатформенное приложение с управлением коллекциями, профилями пользователей и списками желаемого.',
        },
        learning: {
          title: 'Образовательная платформа',
          desc: 'Платформа для обучения с интерактивными играми и управлением контентом.',
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
        android: {
          title: 'אפליקציית משחק לאנדרואיד',
          desc: 'אפליקציית משחק מובייל שנבנתה ב-Android Studio עם אימות משתמשים ומכניקת משחק.',
        },
        crossplatform: {
          title: 'אפליקציה חוצת פלטפורמות',
          desc: 'אפליקציה שתוכננה לעבוד בצורה חלקה על מכשירים ומערכות הפעלה שונות.',
        },
        cross_II: {
          title: 'אפליקציה חוצת פלטפורמות II',
          desc: 'אפליקציה מתקדמת חוצת פלטפורמות עם ניהול אוספים, פרופילי משתמשים ורשימות משאלות.',
        },
        learning: {
          title: 'פלטפורמת למידה',
          desc: 'פלטפורמה חינוכית עם משחקים אינטראקטיביים וניהול תוכן ללמידה יעילה.',
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
