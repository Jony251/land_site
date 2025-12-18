export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'ru', label: 'RU', dir: 'ltr' },
  { code: 'uk', label: 'UA', dir: 'ltr' },
  { code: 'he', label: 'HE', dir: 'rtl' },
];

export const DEFAULT_LANGUAGE = 'en';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      works: 'Works',
      contact: 'Contact',
    },
    home: {
      title: 'Blue Cat',
      subtitle: 'Landing pages and modern web experiences built with performance and clarity in mind.',
      ctaContact: 'Contact',
      ctaWorks: 'View works',
    },
    about: {
      title: 'About',
      intro: "I'm Evgeny Nemchenko, a Software Engineering graduate with hands-on experience building websites and web applications.",
      skills: 'I work with HTML, CSS, JavaScript, React, Node.js, Python, and REST APIs to create responsive, clean, and user-friendly solutions.',
      approach: 'I focus on quality code, clear communication, and meeting deadlines. Whether you need a landing page, a full website, or backend integration — I deliver results you can rely on.',
      cta: "Let's work together. Check out my projects or get in touch.",
      githubTitle: 'GitHub',
      githubText: 'Code samples, projects, and experiments',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Professional background and experience',
    },
    works: {
      title: 'Works',
      body: 'A selection of projects I have worked on.',
      projects: {
        android: {
          title: 'Android Game App',
          desc: 'A mobile game application built with Android Studio featuring user authentication and gameplay mechanics.',
        },
        crossplatform: {
          title: 'Cross-Platform App',
          desc: 'A cross-platform application designed to work seamlessly across multiple devices and operating systems.',
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
      s1: { title: 'Landing Page (One-page)', desc: 'Conversion-focused landing pages and brand websites.' },
      s2: { title: 'Ongoing Support', desc: 'Maintenance, monitoring, and regular updates on a retainer basis.' },
      s3: { title: 'Website Updates & Upgrades', desc: 'Content and design fixes, new sections, and performance improvements.' },
      s4: { title: 'Backend & API Integrations', desc: 'Payment gateways, CRM/ERP, and third-party services via API.' },
    },
    a11y: {
      title: 'Accessibility',
      reset: 'Reset',
      textSize: 'Text size',
      highContrast: 'High contrast',
      reduceMotion: 'Reduce motion',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'Обо мне',
      works: 'Работы',
      contact: 'Контакты',
    },
    home: {
      title: 'Blue Cat',
      subtitle: 'Лендинги и современные веб‑сайты с акцентом на скорость, дизайн и понятную структуру.',
      ctaContact: 'Связаться',
      ctaWorks: 'Портфолио',
    },
    about: {
      title: 'Обо мне',
      intro: 'Я Евгений Немченко, выпускник по специальности «Программная инженерия» с практическим опытом создания сайтов и веб‑приложений.',
      skills: 'Работаю с HTML, CSS, JavaScript, React, Node.js, Python и REST API. Создаю адаптивные, чистые и удобные решения.',
      approach: 'Делаю ставку на качественный код, понятную коммуникацию и соблюдение сроков. Лендинг, полноценный сайт или интеграция с бэкендом — результат, на который можно положиться.',
      cta: 'Давайте работать вместе. Посмотрите мои проекты или свяжитесь со мной.',
      githubTitle: 'GitHub',
      githubText: 'Примеры кода, проекты и эксперименты',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Опыт и профессиональный профиль',
    },
    works: {
      title: 'Работы',
      body: 'Подборка проектов, над которыми я работал.',
      projects: {
        android: {
          title: 'Android-игра',
          desc: 'Мобильное игровое приложение на Android Studio с авторизацией и игровой механикой.',
        },
        crossplatform: {
          title: 'Кроссплатформенное приложение',
          desc: 'Приложение, работающее на разных устройствах и операционных системах.',
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
      s1: { title: 'Лендинг (One-page)', desc: 'Лендинги и сайты-визитки с фокусом на конверсию.' },
      s2: { title: 'Поддержка и сопровождение', desc: 'Техподдержка, мониторинг и регулярные обновления на ретейнере.' },
      s3: { title: 'Обновление и доработка сайтов', desc: 'Правки контента и дизайна, новые секции, улучшение производительности.' },
      s4: { title: 'Интеграции бэкенда и API', desc: 'Платёжные шлюзы, CRM/ERP и сторонние сервисы через API.' },
    },
    a11y: {
      title: 'Доступность',
      reset: 'Сброс',
      textSize: 'Размер текста',
      highContrast: 'Высокий контраст',
      reduceMotion: 'Без анимаций',
    },
  },
  uk: {
    nav: {
      home: 'Головна',
      about: 'Про мене',
      works: 'Роботи',
      contact: 'Контакти',
    },
    home: {
      title: 'Blue Cat',
      subtitle: 'Лендінги та сучасні веб‑сайти з фокусом на швидкість, дизайн і зрозумілу структуру.',
      ctaContact: "Зв'язатися",
      ctaWorks: 'Портфоліо',
    },
    about: {
      title: 'Про мене',
      intro: 'Я Євген Немченко, випускник спеціальності «Програмна інженерія» з практичним досвідом створення сайтів і веб‑додатків.',
      skills: 'Працюю з HTML, CSS, JavaScript, React, Node.js, Python та REST API. Створюю адаптивні, чисті та зручні рішення.',
      approach: 'Роблю ставку на якісний код, зрозумілу комунікацію та дотримання термінів. Лендінг, повноцінний сайт чи інтеграція з бекендом — результат, на який можна покластися.',
      cta: 'Давайте працювати разом. Перегляньте мої проєкти або зв\'яжіться зі мною.',
      githubTitle: 'GitHub',
      githubText: 'Приклади коду, проєкти та експерименти',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'Досвід та професійний профіль',
    },
    works: {
      title: 'Роботи',
      body: 'Добірка проєктів, над якими я працював.',
      projects: {
        android: {
          title: 'Android-гра',
          desc: 'Мобільний ігровий додаток на Android Studio з авторизацією та ігровою механікою.',
        },
        crossplatform: {
          title: 'Кросплатформний додаток',
          desc: 'Додаток, що працює на різних пристроях та операційних системах.',
        },
        learning: {
          title: 'Освітня платформа',
          desc: 'Платформа для навчання з інтерактивними іграми та керуванням контентом.',
        },
      },
    },
    contact: {
      title: 'Контакти',
      body: 'Напишіть повідомлення — я відповім якнайшвидше.',
      form: {
        name: "Ім'я",
        email: 'Email',
        message: 'Повідомлення',
        send: 'Надіслати',
        reset: 'Скинути',
        sending: 'Надсилання...',
        success: 'Повідомлення надіслано.',
        error: 'Не вдалося надіслати повідомлення. Спробуйте ще раз.',
        notConfigured: 'Email сервіс не налаштований. Додайте ключі EmailJS у .env файл.',
        hint: 'Щоб увімкнути відправку email, додайте ключі EmailJS у .env файл.',
      },
    },
    tech: {
      title: 'Технології',
    },
    services: {
      title: 'Наші послуги',
      s1: { title: 'Лендінг (One-page)', desc: 'Лендінги та сайти-візитки з фокусом на конверсію.' },
      s2: { title: 'Підтримка та супровід', desc: 'Техпідтримка, моніторинг і регулярні оновлення на ретейнері.' },
      s3: { title: 'Оновлення та доопрацювання сайтів', desc: 'Правки контенту й дизайну, нові секції, покращення продуктивності.' },
      s4: { title: 'Інтеграції бекенду та API', desc: 'Платіжні шлюзи, CRM/ERP та сторонні сервіси через API.' },
    },
    a11y: {
      title: 'Доступність',
      reset: 'Скинути',
      textSize: 'Розмір тексту',
      highContrast: 'Високий контраст',
      reduceMotion: 'Без анімацій',
    },
  },
  he: {
    nav: {
      home: 'בית',
      about: 'אודות',
      works: 'עבודות',
      contact: 'צור קשר',
    },
    home: {
      title: 'Blue Cat',
      subtitle: 'דפי נחיתה ואתרים מודרניים עם דגש על מהירות, עיצוב ומבנה ברור.',
      ctaContact: 'צור קשר',
      ctaWorks: 'תיק עבודות',
    },
    about: {
      title: 'אודות',
      intro: 'אני יבגני נמצ\'נקו. בונה אפליקציות ואתרי תדמית: UI מודרני, קוד תחזיק ומהירות ביצוע.',
      skills: 'עובד עם HTML, CSS, JavaScript, React, Node.js, Python ו-REST API. יוצר פתרונות רספונסיביים, נקיים וידידותיים למשתמש.',
      approach: 'מתמקד בקוד איכותי, תקשורת ברורה ועמידה בלוחות זמנים. בין אם מדובר בדף נחיתה, אתר מלא או אינטגרציית בקאנד — אני מספק תוצאות שאפשר לסמוך עליהן.',
      cta: 'בואו נעבוד יחד. צפו בפרויקטים שלי או צרו קשר.',
      githubTitle: 'GitHub',
      githubText: 'דוגמאות קוד, פרויקטים וניסויים',
      linkedinTitle: 'LinkedIn',
      linkedinText: 'פרופיל מקצועי וניסיון',
    },
    works: {
      title: 'עבודות',
      body: 'מבחר פרויקטים שעבדתי עליהם.',
      projects: {
        android: {
          title: 'אפליקציית משחק לאנדרואיד',
          desc: 'אפליקציית משחק מובייל שנבנתה ב-Android Studio עם אימות משתמשים ומכניקת משחק.',
        },
        crossplatform: {
          title: 'אפליקציה חוצת פלטפורמות',
          desc: 'אפליקציה שתוכננה לעבוד בצורה חלקה על מכשירים ומערכות הפעלה שונות.',
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
      s1: { title: 'עמוד נחיתה (One-page)', desc: 'דפי נחיתה ואתרי תדמית ממוקדי המרה.' },
      s2: { title: 'תמיכה וליווי מתמשך', desc: 'תחזוקה, ניטור ועדכונים שוטפים במתכונת ריטיינר.' },
      s3: { title: 'עדכון ושדרוג אתרים קיימים', desc: 'תיקוני תוכן ועיצוב, הוספת סקשנים ושיפורי ביצועים.' },
      s4: { title: 'אינטגרציות בקאנד ו-API', desc: 'חיבורי תשלום, CRM/ERP ושירותי צד שלישי דרך API.' },
    },
    a11y: {
      title: 'נגישות',
      reset: 'איפוס',
      textSize: 'גודל טקסט',
      highContrast: 'ניגודיות גבוהה',
      reduceMotion: 'ללא אנימציות',
    },
  },
};
