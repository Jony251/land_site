const text = (en, he, ru) => ({ en, he, ru });

const pick = (value, lang) => {
  if (value && typeof value === 'object' && value.en !== undefined) {
    return value[lang] ?? value.en;
  }
  return value;
};

export const projects = [
  {
    id: 'saas-analytics',
    title: text('SaaS Analytics Console', 'קונסולת אנליטיקה ל-SaaS', 'SaaS Analytics Console'),
    category: text('Web App', 'אפליקציית ווב', 'Веб-приложение'),
    year: '2025',
    summary: text(
      'A multi-tenant dashboard for product teams to monitor activation, retention, and release impact in real time.',
      'דשבורד רב-ארגוני לצוותי מוצר למעקב בזמן אמת אחר אקטיבציה, שימור והשפעת גרסאות.',
      'Мульти-тенант дашборд для продуктовых команд с мониторингом активации, удержания и эффекта релизов.'
    ),
    challenge: text(
      'The client had siloed spreadsheets and no single source of truth for product KPIs. Leadership could not act quickly on churn signals.',
      'ללקוח היו גיליונות מפוזרים ללא מקור אמת אחד ל-KPI, ולכן הנהלה לא הצליחה להגיב מהר לסימני נטישה.',
      'У клиента были разрозненные таблицы и не было единого источника KPI, из-за чего руководство поздно реагировало на риск оттока.'
    ),
    solution: text(
      'Built a modular analytics console with event ingestion APIs, role-based access, and clear KPI storytelling through trend cards and funnels.',
      'נבנתה קונסולה מודולרית עם קליטת אירועים דרך API, הרשאות לפי תפקיד ותצוגת KPI ברורה דרך מגמות ופאנלים.',
      'Собрана модульная аналитическая консоль: ingest API событий, ролевой доступ и понятная визуализация KPI через тренды и воронки.'
    ),
    timeline: text('8 weeks', '8 שבועות', '8 недель'),
    role: text('Full-stack Developer', 'מפתח Full-stack', 'Full-stack разработчик'),
    stack: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
    tags: [
      text('Dashboards', 'דשבורדים', 'Дашборды'),
      text('APIs', 'אינטגרציות API', 'API'),
      text('Role-based access', 'הרשאות לפי תפקיד', 'Ролевой доступ'),
    ],
    results: [
      text(
        'Reduced reporting time from 6 hours to 20 minutes.',
        'קיצרנו את זמן הדיווח מ-6 שעות ל-20 דקות.',
        'Сократили время отчетности с 6 часов до 20 минут.'
      ),
      text(
        'Helped improve trial-to-paid conversion by 24% in one quarter.',
        'סייע לשפר המרת trial ל-paid ב-24% ברבעון אחד.',
        'Помогли увеличить конверсию trial-to-paid на 24% за квартал.'
      ),
      text(
        'Enabled weekly leadership reporting with automated exports.',
        'אפשרנו דיווח הנהלה שבועי עם יצוא אוטומטי.',
        'Запустили еженедельную управленческую отчетность с авто-экспортом.'
      ),
    ],
    metrics: [
      { label: text('Conversion uplift', 'שיפור המרה', 'Рост конверсии'), value: '+24%' },
      { label: text('Load time', 'זמן טעינה', 'Время загрузки'), value: '1.3s' },
      { label: text('Accessibility score', 'ציון נגישות', 'Оценка доступности'), value: '98' },
    ],
    screens: [
      {
        title: text('Executive KPI Snapshot', 'תמונת KPI להנהלה', 'KPI snapshot для руководства'),
        description: text(
          'North-star metrics, weekly trend, and anomaly highlights.',
          'מדדי ליבה, מגמה שבועית והדגשת חריגות.',
          'Ключевые метрики, недельный тренд и подсветка аномалий.'
        ),
        gradient: 'linear-gradient(135deg, #20335e, #2d4f96)',
      },
      {
        title: text('Cohort Retention Explorer', 'ניתוח שימור קוהורטי', 'Исследование когортного удержания'),
        description: text(
          'Segment retention by signup source and product plan.',
          'פילוח שימור לפי מקור הרשמה וחבילת מוצר.',
          'Сегментация удержания по источнику регистрации и тарифу.'
        ),
        gradient: 'linear-gradient(135deg, #3b2a77, #5d44bc)',
      },
      {
        title: text('Release Impact Timeline', 'ציר השפעת גרסאות', 'Таймлайн влияния релизов'),
        description: text(
          'Map deployment events to retention and NPS movement.',
          'חיבור אירועי פריסה לשינויים בשימור וב-NPS.',
          'Связка событий деплоя с изменением удержания и NPS.'
        ),
        gradient: 'linear-gradient(135deg, #143a4a, #1f657d)',
      },
    ],
  },
  {
    id: 'health-booking',
    title: text('Healthcare Booking Platform', 'פלטפורמת זימון תורים רפואית', 'Платформа записи в клинику'),
    category: text('Service Platform', 'פלטפורמת שירות', 'Сервисная платформа'),
    year: '2024',
    summary: text(
      'A patient-first scheduling platform with provider filtering, secure onboarding, and reminders for missed-appointment reduction.',
      'מערכת זימון ממוקדת מטופל עם סינון נותני שירות, אונבורדינג מאובטח ותזכורות להפחתת אי-הגעה.',
      'Платформа записи с фокусом на пациента: фильтры специалистов, безопасный онбординг и напоминания.'
    ),
    challenge: text(
      'The legacy booking flow required multiple phone calls and had high drop-off between clinic discovery and confirmed appointment.',
      'תהליך הזימון הישן דרש כמה שיחות טלפון וסבל מנשירה גבוהה בין מציאת מרפאה לקביעת תור.',
      'Старый процесс записи требовал нескольких звонков и имел высокий отток до подтверждения записи.'
    ),
    solution: text(
      'Designed a guided booking experience with location filters, instant availability checks, and form validation for clean intake data.',
      'עוצב תהליך זימון מודרך עם סינון לפי מיקום, בדיקת זמינות מיידית וולידציה לטפסים.',
      'Сделали пошаговый UX записи: фильтрация по локации, мгновенная проверка слотов и валидация форм.'
    ),
    timeline: text('10 weeks', '10 שבועות', '10 недель'),
    role: text('Frontend Lead', 'מוביל פרונטאנד', 'Frontend Lead'),
    stack: ['React', 'Django', 'Redis', 'EmailJS'],
    tags: [
      text('Conversion UX', 'UX להמרה', 'Conversion UX'),
      text('Forms', 'טפסים', 'Формы'),
      text('Scheduling', 'זימון תורים', 'Планирование'),
    ],
    results: [
      text('Increased completed bookings by 37%.', 'עלייה של 37% בהשלמת הזמנות.', 'Рост завершенных записей на 37%.'),
      text('Lowered intake form errors by 62%.', 'ירידה של 62% בשגיאות טופס.', 'Снижение ошибок формы на 62%.'),
      text(
        'Reduced no-show rate by 19% with reminders.',
        'ירידה של 19% באי-הגעה בעזרת תזכורות.',
        'Снижение no-show на 19% благодаря напоминаниям.'
      ),
    ],
    metrics: [
      { label: text('Booking completion', 'השלמת הזמנות', 'Завершенные записи'), value: '+37%' },
      { label: text('Form errors', 'שגיאות טופס', 'Ошибки формы'), value: '-62%' },
      { label: text('Mobile conversion', 'המרה במובייל', 'Мобильная конверсия'), value: '+29%' },
    ],
    screens: [
      {
        title: text('Provider Discovery', 'מציאת נותן שירות', 'Подбор специалиста'),
        description: text(
          'Smart filtering by specialty, distance, and insurance.',
          'סינון חכם לפי תחום, מרחק וביטוח.',
          'Умная фильтрация по специализации, расстоянию и страховке.'
        ),
        gradient: 'linear-gradient(135deg, #1f3e6e, #276096)',
      },
      {
        title: text('Appointment Wizard', 'אשף קביעת תור', 'Мастер записи'),
        description: text(
          'Step-by-step flow with contextual validation hints.',
          'תהליך שלב-אחר-שלב עם רמזי ולידציה בהקשר.',
          'Пошаговый flow с контекстными подсказками валидации.'
        ),
        gradient: 'linear-gradient(135deg, #2a5a4a, #37906f)',
      },
      {
        title: text('Patient Confirmation', 'אישור מטופל', 'Подтверждение пациента'),
        description: text(
          'Clear summary page with calendar and reminder settings.',
          'עמוד סיכום ברור עם הגדרות יומן ותזכורות.',
          'Понятный экран подтверждения с календарем и напоминаниями.'
        ),
        gradient: 'linear-gradient(135deg, #38486a, #546fa1)',
      },
    ],
  },
  {
    id: 'retail-relaunch',
    title: text(
      'Retail Brand Website Relaunch',
      'השקה מחדש לאתר מותג ריטייל',
      'Перезапуск сайта retail-бренда'
    ),
    category: text('Marketing Site', 'אתר שיווקי', 'Маркетинговый сайт'),
    year: '2024',
    summary: text(
      'A high-performance storefront and brand story experience focused on product discovery and lead generation.',
      'חוויית מותג וחנות בביצועים גבוהים עם דגש על גילוי מוצרים ויצירת לידים.',
      'Высокопроизводительный storefront и бренд-опыт с упором на discovery и лидогенерацию.'
    ),
    challenge: text(
      'The previous site loaded slowly, had inconsistent branding, and could not support campaign-specific landing pages quickly.',
      'האתר הקודם נטען לאט, הציג שפה מותגית לא אחידה, ולא תמך במהירות בדפי קמפיין.',
      'Старый сайт был медленным, с неединым брендингом и медленным запуском кампаний.'
    ),
    solution: text(
      'Rebuilt the site with reusable sections, lightweight media handling, and conversion-focused CTA modules across all key templates.',
      'האתר נבנה מחדש עם סקשנים חוזרים, טיפול מדיה קל ומשטחי CTA ממוקדי המרה.',
      'Сайт собран заново на переиспользуемых секциях, легком media-слое и CTA-модулях.'
    ),
    timeline: text('6 weeks', '6 שבועות', '6 недель'),
    role: text('Web Developer', 'מפתח אתרים', 'Web-разработчик'),
    stack: ['React', 'Vite', 'Headless CMS', 'Cloudflare'],
    tags: [
      text('Landing pages', 'דפי נחיתה', 'Лендинги'),
      text('SEO', 'SEO', 'SEO'),
      text('Performance', 'ביצועים', 'Производительность'),
    ],
    results: [
      text('Improved core web vitals across all templates.', 'שיפור Core Web Vitals בכל התבניות.', 'Улучшены Core Web Vitals на всех шаблонах.'),
      text(
        'Doubled average session duration on campaign pages.',
        'הכפלת משך סשן ממוצע בדפי קמפיין.',
        'Средняя длительность сессии на кампанийных страницах выросла вдвое.'
      ),
      text(
        'Increased quote requests from paid traffic by 31%.',
        'עלייה של 31% בבקשות להצעת מחיר מתנועה ממומנת.',
        'Рост запросов на оценку из платного трафика на 31%.'
      ),
    ],
    metrics: [
      { label: text('LCP', 'LCP', 'LCP'), value: '1.8s' },
      { label: text('Session duration', 'משך סשן', 'Длительность сессии'), value: '+102%' },
      { label: text('Quote requests', 'בקשות להצעת מחיר', 'Запросы на оценку'), value: '+31%' },
    ],
    screens: [
      {
        title: text('Story-driven Homepage', 'עמוד בית מונחה סיפור', 'Story-driven главная'),
        description: text(
          'Modular hero and social proof blocks for rapid campaigns.',
          'בלוקים מודולריים של Hero והוכחה חברתית לקמפיינים מהירים.',
          'Модульные hero-блоки и social proof для быстрого запуска кампаний.'
        ),
        gradient: 'linear-gradient(135deg, #582b54, #8e3f87)',
      },
      {
        title: text('Collection Landing', 'דף קולקציה', 'Лендинг коллекции'),
        description: text(
          'Filterable catalog with sticky conversion sidebar.',
          'קטלוג מסונן עם סרגל צד Sticky להמרה.',
          'Каталог с фильтрами и sticky-блоком конверсии.'
        ),
        gradient: 'linear-gradient(135deg, #4a2d2d, #7c413f)',
      },
      {
        title: text('Lead Capture Module', 'מודול לכידת לידים', 'Модуль захвата лидов'),
        description: text(
          'Trust badges and urgency messaging near contact points.',
          'תגי אמון והודעות דחיפות ליד נקודות יצירת קשר.',
          'Trust badges и urgency-месседжи рядом с контактными точками.'
        ),
        gradient: 'linear-gradient(135deg, #3d355b, #6755a1)',
      },
    ],
  },
  {
    id: 'edtech-portal',
    title: text('EdTech Student Portal', 'פורטל תלמידים EdTech', 'EdTech портал для студентов'),
    category: text('Education', 'חינוך', 'Образование'),
    year: '2023',
    summary: text(
      'An interactive portal for students with assignments, progress analytics, and gamified milestones for ongoing engagement.',
      'פורטל אינטראקטיבי לתלמידים עם משימות, אנליטיקת התקדמות ואבני דרך משחקיות.',
      'Интерактивный портал для студентов: задания, аналитика прогресса и геймифицированные этапы.'
    ),
    challenge: text(
      'Students struggled to track tasks and course progress across multiple disconnected tools.',
      'התלמידים התקשו לעקוב אחר משימות והתקדמות בין כלים מנותקים.',
      'Студентам было сложно отслеживать задачи и прогресс между разрозненными инструментами.'
    ),
    solution: text(
      'Delivered a unified portal with progress indicators, assignment boards, and personalized milestone reminders.',
      'נמסר פורטל אחוד עם אינדיקטורים להתקדמות, לוחות משימות ותזכורות מותאמות.',
      'Собран единый портал с индикаторами прогресса, досками задач и персональными напоминаниями.'
    ),
    timeline: text('12 weeks', '12 שבועות', '12 недель'),
    role: text('Product Engineer', 'מהנדס מוצר', 'Product Engineer'),
    stack: ['React', 'Python', 'REST API', 'PostgreSQL'],
    tags: [
      text('Portal', 'פורטל', 'Портал'),
      text('Gamification', 'גיימיפיקציה', 'Геймификация'),
      text('Engagement', 'מעורבות', 'Вовлеченность'),
    ],
    results: [
      text('Raised weekly active users by 43%.', 'עלייה של 43% במשתמשים פעילים שבועית.', 'Рост WAU на 43%.'),
      text('Increased assignment completion by 28%.', 'עלייה של 28% בהשלמת משימות.', 'Рост завершения заданий на 28%.'),
      text(
        'Reduced support tickets around deadlines by 35%.',
        'ירידה של 35% בפניות תמיכה סביב דדליינים.',
        'Снижение тикетов поддержки по дедлайнам на 35%.'
      ),
    ],
    metrics: [
      { label: text('WAU', 'WAU', 'WAU'), value: '+43%' },
      { label: text('Completion rate', 'שיעור השלמה', 'Completion rate'), value: '+28%' },
      { label: text('Support tickets', 'פניות תמיכה', 'Тикеты поддержки'), value: '-35%' },
    ],
    screens: [
      {
        title: text('Personal Dashboard', 'דשבורד אישי', 'Личный дашборд'),
        description: text(
          'Daily priorities and upcoming due dates at a glance.',
          'עדיפויות יומיות ודדליינים קרובים במבט אחד.',
          'Ежедневные приоритеты и ближайшие дедлайны на одном экране.'
        ),
        gradient: 'linear-gradient(135deg, #1f4d55, #297f8c)',
      },
      {
        title: text('Learning Path Progress', 'התקדמות מסלול למידה', 'Прогресс учебного пути'),
        description: text(
          'Skill map with milestones and completion forecasts.',
          'מפת מיומנויות עם אבני דרך ותחזית השלמה.',
          'Карта навыков с этапами и прогнозом завершения.'
        ),
        gradient: 'linear-gradient(135deg, #2e4374, #4063b3)',
      },
      {
        title: text('Assignment Workspace', 'מרחב משימות', 'Рабочее пространство заданий'),
        description: text(
          'Submission tracking with status and instructor notes.',
          'מעקב הגשות עם סטטוס והערות מרצה.',
          'Трекинг сдачи заданий со статусами и комментариями преподавателя.'
        ),
        gradient: 'linear-gradient(135deg, #5a3a2a, #875532)',
      },
    ],
  },
  {
    id: 'property-leads',
    title: text('Real Estate Lead Funnel', 'משפך לידים לנדל"ן', 'Лидогенерация для недвижимости'),
    category: text('Landing Funnel', 'משפך נחיתה', 'Лендинг-воронка'),
    year: '2025',
    summary: text(
      'A conversion-focused funnel for property agencies to capture qualified buyers and renters from paid traffic.',
      'משפך המרה ממוקד לסוכנויות נדל"ן ללכידת לידים איכותיים מתנועה ממומנת.',
      'Конверсионная воронка для агентств недвижимости для сбора качественных лидов из платного трафика.'
    ),
    challenge: text(
      'The campaign landing pages had high traffic but low lead quality and significant form abandonment on mobile.',
      'לדפי הקמפיין הייתה תנועה גבוהה אך איכות לידים נמוכה ונשירה גבוהה בטופס במובייל.',
      'Кампанийные лендинги имели высокий трафик, но низкое качество лидов и высокий мобильный abandon.'
    ),
    solution: text(
      'Introduced audience-specific pages, trust modules, and a progressive form flow with validation and step persistence.',
      'הוספנו דפי קהל ייעודיים, מודולי אמון וזרימת טופס מדורגת עם ולידציה ושמירת שלבים.',
      'Внедрили сегментированные страницы, trust-модули и пошаговую форму с валидацией и сохранением прогресса.'
    ),
    timeline: text('5 weeks', '5 שבועות', '5 недель'),
    role: text('Conversion-focused Web Developer', 'מפתח אתרים ממוקד המרה', 'Web-разработчик с фокусом на конверсию'),
    stack: ['React', 'Vite', 'Google Analytics', 'EmailJS'],
    tags: [
      text('Lead generation', 'יצירת לידים', 'Лидогенерация'),
      text('A/B testing', 'בדיקות A/B', 'A/B тестирование'),
      text('Mobile UX', 'חוויית מובייל', 'Mobile UX'),
    ],
    results: [
      text('Boosted qualified leads by 46%.', 'עלייה של 46% בלידים איכותיים.', 'Рост квалифицированных лидов на 46%.'),
      text('Reduced mobile form abandonment by 34%.', 'ירידה של 34% בנשירת טפסים במובייל.', 'Снижение мобильного abandon форм на 34%.'),
      text(
        'Cut cost per lead by 27% from campaign traffic.',
        'ירידה של 27% בעלות לליד מתנועה ממומנת.',
        'Снижение стоимости лида на 27% из кампанийного трафика.'
      ),
    ],
    metrics: [
      { label: text('Qualified leads', 'לידים איכותיים', 'Квалифицированные лиды'), value: '+46%' },
      { label: text('Abandonment', 'נשירה', 'Abandonment'), value: '-34%' },
      { label: text('Cost per lead', 'עלות לליד', 'Стоимость лида'), value: '-27%' },
    ],
    screens: [
      {
        title: text('Campaign Landing Hero', 'הירו לדף קמפיין', 'Hero кампанийного лендинга'),
        description: text(
          'Location-first messaging with clear urgency and CTA.',
          'מסרים לפי מיקום עם דחיפות ברורה וקריאה לפעולה.',
          'Локационно-ориентированный месседжинг с явным CTA.'
        ),
        gradient: 'linear-gradient(135deg, #2d3958, #4f679f)',
      },
      {
        title: text('Lead Qualification Form', 'טופס סינון לידים', 'Форма квалификации лида'),
        description: text(
          'Two-step form with confidence indicators and progress.',
          'טופס דו-שלבי עם חיווי ביטחון והתקדמות.',
          'Двухшаговая форма с индикаторами доверия и прогресса.'
        ),
        gradient: 'linear-gradient(135deg, #4a3c1f, #7b662c)',
      },
      {
        title: text('Consultation Booking', 'הזמנת ייעוץ', 'Запись на консультацию'),
        description: text(
          'Action summary with instant confirmation flow.',
          'סיכום פעולה עם אישור מיידי.',
          'Итоговый экран действия с мгновенным подтверждением.'
        ),
        gradient: 'linear-gradient(135deg, #2a4f47, #3f8075)',
      },
    ],
  },
];

export const localizeProject = (project, lang) => ({
  ...project,
  title: pick(project.title, lang),
  category: pick(project.category, lang),
  summary: pick(project.summary, lang),
  challenge: pick(project.challenge, lang),
  solution: pick(project.solution, lang),
  timeline: pick(project.timeline, lang),
  role: pick(project.role, lang),
  tags: project.tags.map((tag) => pick(tag, lang)),
  results: project.results.map((result) => pick(result, lang)),
  metrics: project.metrics.map((metric) => ({ ...metric, label: pick(metric.label, lang) })),
  screens: project.screens.map((screen) => ({
    ...screen,
    title: pick(screen.title, lang),
    description: pick(screen.description, lang),
  })),
});

export const getLocalizedProjects = (lang) => projects.map((project) => localizeProject(project, lang));

export const getLocalizedFeaturedProjects = (lang) =>
  getLocalizedProjects(lang).slice(0, 3);

export const getLocalizedProjectCategories = (lang) => [
  text('All', 'הכל', 'Все')[lang] ?? 'All',
  ...new Set(getLocalizedProjects(lang).map((project) => project.category)),
];

export const getLocalizedProjectById = (projectId, lang) => {
  const project = projects.find((item) => item.id === projectId);
  return project ? localizeProject(project, lang) : null;
};
