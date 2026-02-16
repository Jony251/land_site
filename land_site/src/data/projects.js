export const projects = [
  {
    id: 'saas-analytics',
    title: 'SaaS Analytics Console',
    category: 'Web App',
    year: '2025',
    summary:
      'A multi-tenant dashboard for product teams to monitor activation, retention, and release impact in real time.',
    challenge:
      'The client had siloed spreadsheets and no single source of truth for product KPIs. Leadership could not act quickly on churn signals.',
    solution:
      'Built a modular analytics console with event ingestion APIs, role-based access, and clear KPI storytelling through trend cards and funnels.',
    timeline: '8 weeks',
    role: 'Full-stack Developer',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
    tags: ['Dashboards', 'APIs', 'Role-based access'],
    results: [
      'Reduced reporting time from 6 hours to 20 minutes.',
      'Helped improve trial-to-paid conversion by 24% in one quarter.',
      'Enabled weekly leadership reporting with automated exports.',
    ],
    metrics: [
      { label: 'Conversion uplift', value: '+24%' },
      { label: 'Load time', value: '1.3s' },
      { label: 'Accessibility score', value: '98' },
    ],
    screens: [
      {
        title: 'Executive KPI Snapshot',
        description: 'North-star metrics, weekly trend, and anomaly highlights.',
        gradient: 'linear-gradient(135deg, #20335e, #2d4f96)',
      },
      {
        title: 'Cohort Retention Explorer',
        description: 'Segment retention by signup source and product plan.',
        gradient: 'linear-gradient(135deg, #3b2a77, #5d44bc)',
      },
      {
        title: 'Release Impact Timeline',
        description: 'Map deployment events to retention and NPS movement.',
        gradient: 'linear-gradient(135deg, #143a4a, #1f657d)',
      },
    ],
  },
  {
    id: 'health-booking',
    title: 'Healthcare Booking Platform',
    category: 'Service Platform',
    year: '2024',
    summary:
      'A patient-first scheduling platform with provider filtering, secure onboarding, and reminders for missed-appointment reduction.',
    challenge:
      'The legacy booking flow required multiple phone calls and had high drop-off between clinic discovery and confirmed appointment.',
    solution:
      'Designed a guided booking experience with location filters, instant availability checks, and form validation for clean intake data.',
    timeline: '10 weeks',
    role: 'Frontend Lead',
    stack: ['React', 'Django', 'Redis', 'EmailJS'],
    tags: ['Conversion UX', 'Forms', 'Scheduling'],
    results: [
      'Increased completed bookings by 37%.',
      'Lowered intake form errors by 62%.',
      'Reduced no-show rate by 19% with reminders.',
    ],
    metrics: [
      { label: 'Booking completion', value: '+37%' },
      { label: 'Form errors', value: '-62%' },
      { label: 'Mobile conversion', value: '+29%' },
    ],
    screens: [
      {
        title: 'Provider Discovery',
        description: 'Smart filtering by specialty, distance, and insurance.',
        gradient: 'linear-gradient(135deg, #1f3e6e, #276096)',
      },
      {
        title: 'Appointment Wizard',
        description: 'Step-by-step flow with contextual validation hints.',
        gradient: 'linear-gradient(135deg, #2a5a4a, #37906f)',
      },
      {
        title: 'Patient Confirmation',
        description: 'Clear summary page with calendar and reminder settings.',
        gradient: 'linear-gradient(135deg, #38486a, #546fa1)',
      },
    ],
  },
  {
    id: 'retail-relaunch',
    title: 'Retail Brand Website Relaunch',
    category: 'Marketing Site',
    year: '2024',
    summary:
      'A high-performance storefront and brand story experience focused on product discovery and lead generation.',
    challenge:
      'The previous site loaded slowly, had inconsistent branding, and could not support campaign-specific landing pages quickly.',
    solution:
      'Rebuilt the site with reusable sections, lightweight media handling, and conversion-focused CTA modules across all key templates.',
    timeline: '6 weeks',
    role: 'Web Developer',
    stack: ['React', 'Vite', 'Headless CMS', 'Cloudflare'],
    tags: ['Landing pages', 'SEO', 'Performance'],
    results: [
      'Improved core web vitals across all templates.',
      'Doubled average session duration on campaign pages.',
      'Increased quote requests from paid traffic by 31%.',
    ],
    metrics: [
      { label: 'LCP', value: '1.8s' },
      { label: 'Session duration', value: '+102%' },
      { label: 'Quote requests', value: '+31%' },
    ],
    screens: [
      {
        title: 'Story-driven Homepage',
        description: 'Modular hero and social proof blocks for rapid campaigns.',
        gradient: 'linear-gradient(135deg, #582b54, #8e3f87)',
      },
      {
        title: 'Collection Landing',
        description: 'Filterable catalog with sticky conversion sidebar.',
        gradient: 'linear-gradient(135deg, #4a2d2d, #7c413f)',
      },
      {
        title: 'Lead Capture Module',
        description: 'Trust badges and urgency messaging near contact points.',
        gradient: 'linear-gradient(135deg, #3d355b, #6755a1)',
      },
    ],
  },
  {
    id: 'edtech-portal',
    title: 'EdTech Student Portal',
    category: 'Education',
    year: '2023',
    summary:
      'An interactive portal for students with assignments, progress analytics, and gamified milestones for ongoing engagement.',
    challenge:
      'Students struggled to track tasks and course progress across multiple disconnected tools.',
    solution:
      'Delivered a unified portal with progress indicators, assignment boards, and personalized milestone reminders.',
    timeline: '12 weeks',
    role: 'Product Engineer',
    stack: ['React', 'Python', 'REST API', 'PostgreSQL'],
    tags: ['Portal', 'Gamification', 'Engagement'],
    results: [
      'Raised weekly active users by 43%.',
      'Increased assignment completion by 28%.',
      'Reduced support tickets around deadlines by 35%.',
    ],
    metrics: [
      { label: 'WAU', value: '+43%' },
      { label: 'Completion rate', value: '+28%' },
      { label: 'Support tickets', value: '-35%' },
    ],
    screens: [
      {
        title: 'Personal Dashboard',
        description: 'Daily priorities and upcoming due dates at a glance.',
        gradient: 'linear-gradient(135deg, #1f4d55, #297f8c)',
      },
      {
        title: 'Learning Path Progress',
        description: 'Skill map with milestones and completion forecasts.',
        gradient: 'linear-gradient(135deg, #2e4374, #4063b3)',
      },
      {
        title: 'Assignment Workspace',
        description: 'Submission tracking with status and instructor notes.',
        gradient: 'linear-gradient(135deg, #5a3a2a, #875532)',
      },
    ],
  },
  {
    id: 'property-leads',
    title: 'Real Estate Lead Funnel',
    category: 'Landing Funnel',
    year: '2025',
    summary:
      'A conversion-focused funnel for property agencies to capture qualified buyers and renters from paid traffic.',
    challenge:
      'The campaign landing pages had high traffic but low lead quality and significant form abandonment on mobile.',
    solution:
      'Introduced audience-specific pages, trust modules, and a progressive form flow with validation and step persistence.',
    timeline: '5 weeks',
    role: 'Conversion-focused Web Developer',
    stack: ['React', 'Vite', 'Google Analytics', 'EmailJS'],
    tags: ['Lead generation', 'A/B testing', 'Mobile UX'],
    results: [
      'Boosted qualified leads by 46%.',
      'Reduced mobile form abandonment by 34%.',
      'Cut cost per lead by 27% from campaign traffic.',
    ],
    metrics: [
      { label: 'Qualified leads', value: '+46%' },
      { label: 'Abandonment', value: '-34%' },
      { label: 'Cost per lead', value: '-27%' },
    ],
    screens: [
      {
        title: 'Campaign Landing Hero',
        description: 'Location-first messaging with clear urgency and CTA.',
        gradient: 'linear-gradient(135deg, #2d3958, #4f679f)',
      },
      {
        title: 'Lead Qualification Form',
        description: 'Two-step form with confidence indicators and progress.',
        gradient: 'linear-gradient(135deg, #4a3c1f, #7b662c)',
      },
      {
        title: 'Consultation Booking',
        description: 'Action summary with instant confirmation flow.',
        gradient: 'linear-gradient(135deg, #2a4f47, #3f8075)',
      },
    ],
  },
];

export const featuredProjects = projects.slice(0, 3);

export const projectCategories = ['All', ...new Set(projects.map((project) => project.category))];

export const getProjectById = (projectId) =>
  projects.find((project) => project.id === projectId);
