const text = (en, he, ru) => ({ en, he, ru });
const pick = (value, lang) => (value?.en !== undefined ? value[lang] ?? value.en : value);

const trustStats = [
  { label: text('Projects shipped', 'פרויקטים שסופקו', 'Запущенных проектов'), value: '40+' },
  { label: text('Avg. lighthouse score', 'ציון Lighthouse ממוצע', 'Средний Lighthouse score'), value: '95+' },
  { label: text('Client satisfaction', 'שביעות רצון לקוחות', 'Удовлетворенность клиентов'), value: '4.9/5' },
];

const testimonials = [
  {
    name: 'Maya Levin',
    role: text('Marketing Director, NovaRetail', 'מנהלת שיווק, NovaRetail', 'Директор по маркетингу, NovaRetail'),
    quote: text(
      'The redesign looked premium and, more importantly, converted better. We saw more qualified leads in the first month than in the previous quarter.',
      'העיצוב החדש נראה פרימיום, ובעיקר המיר טוב יותר. כבר בחודש הראשון קיבלנו יותר לידים איכותיים מהרבעון הקודם.',
      'Редизайн выглядит премиально и, главное, конвертирует лучше. Уже в первый месяц мы получили больше качественных лидов, чем за прошлый квартал.'
    ),
  },
  {
    name: 'Daniel Smirnov',
    role: text('Product Lead, LearnLoop', 'מוביל מוצר, LearnLoop', 'Product Lead, LearnLoop'),
    quote: text(
      'Clear communication, fast iterations, and polished execution. The portal UX feels significantly more intuitive for both students and staff.',
      'תקשורת ברורה, איטרציות מהירות וביצוע מוקפד. חוויית הפורטל הרבה יותר אינטואיטיבית לתלמידים ולצוות.',
      'Понятная коммуникация, быстрые итерации и качественная реализация. UX портала стал заметно удобнее для студентов и команды.'
    ),
  },
  {
    name: 'Irina Melnik',
    role: text('Operations Manager, HealthBridge', 'מנהלת תפעול, HealthBridge', 'Operations Manager, HealthBridge'),
    quote: text(
      'The booking experience is now smooth on mobile and desktop. Drop-offs reduced immediately after launch.',
      'תהליך קביעת התור הפך לחלק גם במובייל וגם בדסקטופ. הנשירה ירדה מיד אחרי ההשקה.',
      'Процесс записи стал удобным и на мобильных, и на десктопе. Отток снизился сразу после запуска.'
    ),
  },
];

const skillGroups = [
  {
    title: text('Frontend Engineering', 'Frontend Engineering', 'Frontend Engineering'),
    items: [
      { label: text('React / Component Architecture', 'React / ארכיטקטורת קומפוננטות', 'React / Компонентная архитектура'), level: 92 },
      { label: text('UX-focused CSS Systems', 'מערכות CSS ממוקדות UX', 'CSS-системы с фокусом на UX'), level: 90 },
      { label: text('Performance Optimization', 'אופטימיזציית ביצועים', 'Оптимизация производительности'), level: 86 },
    ],
  },
  {
    title: text('Backend & Integrations', 'Backend ואינטגרציות', 'Backend и интеграции'),
    items: [
      { label: text('REST API Design', 'תכנון REST API', 'Проектирование REST API'), level: 88 },
      { label: text('Python / Node Services', 'שירותי Python / Node', 'Сервисы Python / Node'), level: 82 },
      { label: text('Automation & Webhooks', 'אוטומציות ו-Webhooks', 'Автоматизация и webhooks'), level: 79 },
    ],
  },
  {
    title: text('Growth & Delivery', 'Growth ו-Delivery', 'Growth и delivery'),
    items: [
      { label: text('SEO Foundations', 'יסודות SEO', 'База SEO'), level: 84 },
      { label: text('Conversion-focused UX', 'UX ממוקד המרה', 'UX с фокусом на конверсию'), level: 91 },
      { label: text('Cross-team Communication', 'תקשורת בין צוותים', 'Коммуникация между командами'), level: 93 },
    ],
  },
];

const processSteps = [
  {
    title: text('Discovery', 'אפיון', 'Discovery'),
    body: text(
      'Align on business goals, audience, and conversion actions.',
      'מיישרים קו על מטרות עסקיות, קהל יעד ופעולות המרה.',
      'Согласуем бизнес-цели, аудиторию и действия конверсии.'
    ),
  },
  {
    title: text('Design & Validation', 'עיצוב ואימות', 'Дизайн и валидация'),
    body: text(
      'Prototype clean layouts and validate key user flows early.',
      'בונים פרוטוטייפ נקי ומאמתים זרימות מרכזיות בשלב מוקדם.',
      'Создаем чистые макеты и заранее валидируем ключевые сценарии.'
    ),
  },
  {
    title: text('Build & Optimize', 'פיתוח ואופטימיזציה', 'Разработка и оптимизация'),
    body: text(
      'Implement component-based UI with performance and SEO in mind.',
      'מיישמים UI מבוסס קומפוננטות עם דגש על ביצועים ו-SEO.',
      'Реализуем компонентный UI с фокусом на производительность и SEO.'
    ),
  },
  {
    title: text('Launch & Iterate', 'השקה ושיפור', 'Запуск и итерации'),
    body: text(
      'Track behavior, refine content, and improve conversion over time.',
      'עוקבים אחרי התנהגות, משפרים תוכן ומעלים המרות לאורך זמן.',
      'Отслеживаем поведение, улучшаем контент и повышаем конверсию.'
    ),
  },
];

const insights = [
  {
    title: text(
      'How to design landing pages that convert',
      'איך לעצב דפי נחיתה שממירים',
      'Как проектировать лендинги с высокой конверсией'
    ),
    description: text(
      'A practical breakdown of layout, social proof, and CTA placement for higher lead quality.',
      'פירוק פרקטי של מבנה עמוד, הוכחה חברתית ומיקום CTA לשיפור איכות הלידים.',
      'Практический разбор структуры, social proof и CTA для повышения качества лидов.'
    ),
    readTime: text('5 min read', '5 דקות קריאה', '5 минут чтения'),
  },
  {
    title: text(
      'Performance checklist before going live',
      'צ\'קליסט ביצועים לפני עלייה לאוויר',
      'Чек-лист производительности перед запуском'
    ),
    description: text(
      'A concise pre-launch audit for image delivery, script budgets, and Core Web Vitals.',
      'אודיט קצר לפני השקה לטיפול בתמונות, משקל סקריפטים ו-Core Web Vitals.',
      'Краткий pre-launch аудит по картинкам, скриптам и Core Web Vitals.'
    ),
    readTime: text('4 min read', '4 דקות קריאה', '4 минуты чтения'),
  },
  {
    title: text(
      'Mobile UX mistakes that cost conversions',
      'טעויות UX במובייל שעולות בהמרות',
      'Ошибки мобильного UX, которые снижают конверсию'
    ),
    description: text(
      'Common navigation and form usability issues that quietly reduce conversion rates.',
      'טעויות נפוצות בניווט ובטפסים שמורידות שיעורי המרה.',
      'Типовые ошибки навигации и форм, которые незаметно ухудшают конверсию.'
    ),
    readTime: text('6 min read', '6 דקות קריאה', '6 минут чтения'),
  },
];

export const getLocalizedSiteContent = (lang) => ({
  trustStats: trustStats.map((item) => ({ ...item, label: pick(item.label, lang) })),
  testimonials: testimonials.map((item) => ({
    ...item,
    role: pick(item.role, lang),
    quote: pick(item.quote, lang),
  })),
  skillGroups: skillGroups.map((group) => ({
    ...group,
    title: pick(group.title, lang),
    items: group.items.map((item) => ({ ...item, label: pick(item.label, lang) })),
  })),
  processSteps: processSteps.map((step) => ({
    ...step,
    title: pick(step.title, lang),
    body: pick(step.body, lang),
  })),
  insights: insights.map((item) => ({
    ...item,
    title: pick(item.title, lang),
    description: pick(item.description, lang),
    readTime: pick(item.readTime, lang),
  })),
});
