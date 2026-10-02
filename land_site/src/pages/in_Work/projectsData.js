const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const TECH_ICONS = {
  'HTML5':           `${CDN}/html5/html5-original.svg`,
  'CSS3':            `${CDN}/css3/css3-original.svg`,
  'JavaScript':      `${CDN}/javascript/javascript-original.svg`,
  'TypeScript':      `${CDN}/typescript/typescript-original.svg`,
  'React':           `${CDN}/react/react-original.svg`,
  'React Native':    `${CDN}/react/react-original.svg`,
  'Vue 3':           `${CDN}/vuejs/vuejs-original.svg`,
  'Node.js':         `${CDN}/nodejs/nodejs-original.svg`,
  'Java':            `${CDN}/java/java-original.svg`,
  'Android Studio':  `${CDN}/androidstudio/androidstudio-original.svg`,
  'XML':             null,
  'Firebase':        `${CDN}/firebase/firebase-plain.svg`,
  'Vite':            '/vite.svg',
};

/**
 * Creates a technology descriptor for the UI.
 *
 * Input:
 * - `name` (string): technology name used as a label.
 *
 * Output:
 * - `{ name, icon }` where `icon` is an URL string or `null`.
 */
const tech = (name) => ({ name, icon: TECH_ICONS[name] || null });

/**
 * Projects catalog used by Works and project details pages.
 *
 * Output:
 * - Array of project objects with:
 *   - `id` (string): route id used in `/works/:id`
 *   - `category` ('web' | 'android')
 *   - `tier` ('flagship' | 'product' | 'craft'): portfolio priority level,
 *     drives visual weight on the Works grid (see docs/portfolio-strategy.md)
 *   - `titleKey`/`descKey` (string): i18n keys
 *   - `thumbnail` (string)
 *   - `images` (string[]) (first image used as hero)
 *   - optional `siteUrl`/`github`
 *   - optional `technologies` ({ name, icon }[])
 *   - optional `workTypes` (string[]): categories from the shared
 *     `works.types.*` i18n dictionary (e.g. 'frontend', 'backend')
 *   - optional `caseKeys` ({ problem, solution, stack, result }): i18n keys
 *     for the structured case-study narrative (flagship tier only)
 */
const projects = [
  {
    id: 'pet-project-crm',
    category: 'web',
    tier: 'flagship',
    titleKey: 'works.projects.crm.title',
    descKey: 'works.projects.crm.desc',
    thumbnail: 'https://github.com/user-attachments/assets/74915549-c17c-4391-8713-50eb23da5719',
    github: 'https://github.com/Jony251/pet-project-CRM',
    technologies: [tech('React'), tech('JavaScript'), tech('CSS3')],
    workTypes: ['frontend', 'backend', 'api', 'database'],
    caseKeys: {
      problem: 'works.projects.crm.case.problem',
      solution: 'works.projects.crm.case.solution',
      stack: 'works.projects.crm.case.stack',
      result: 'works.projects.crm.case.result',
    },
    images: [
      'https://github.com/user-attachments/assets/74915549-c17c-4391-8713-50eb23da5719',
      'https://github.com/user-attachments/assets/f984bed2-01c5-4c33-9078-6d8b2b2dd1f1',
      'https://github.com/user-attachments/assets/dfe12271-46dd-4430-a16b-d83cd4b5f954',
      'https://github.com/user-attachments/assets/5db9a83d-d7a6-4fde-bcdb-b0ba94c9d825',
      'https://github.com/user-attachments/assets/4421accf-a85d-4409-88b3-2643437bc890',
    ],
  },
  {
    id: 'aispace',
    category: 'web',
    tier: 'flagship',
    titleKey: 'works.projects.aispace.title',
    descKey: 'works.projects.aispace.desc',
    thumbnail: '/ended_proj/aispace_home.webp',
    github: 'https://github.com/Jony251/AI_Space',
    technologies: [tech('Vue 3'), tech('TypeScript'), tech('CSS3')],
    workTypes: ['frontend', 'uiux'],
    caseKeys: {
      problem: 'works.projects.aispace.case.problem',
      solution: 'works.projects.aispace.case.solution',
      stack: 'works.projects.aispace.case.stack',
      result: 'works.projects.aispace.case.result',
    },
    images: [
      '/ended_proj/aispace_home.webp',
      '/ended_proj/aispace_chat.webp',
      '/ended_proj/aispace_features.webp',
    ],
  },
  {
    id: 'crossplatform',
    category: 'web',
    tier: 'product',
    titleKey: 'works.projects.crossplatform.title',
    descKey: 'works.projects.crossplatform.desc',
    thumbnail: '/ended_proj/Whale_Business_land.webp',
    siteUrl: 'https://whalebiz.co.il/',
    technologies: [tech('CSS3'), tech('JavaScript'), tech('React')],
    workTypes: ['frontend', 'uiux'],
    images: [
      '/ended_proj/Whale_Business_land.webp',
      '/ended_proj/Whale_Business_login.webp',
      '/ended_proj/Whale_Business_reg.webp',
    ],
  },
  {
    id: 'landfolio',
    category: 'web',
    tier: 'product',
    titleKey: 'works.projects.landfolio.title',
    descKey: 'works.projects.landfolio.desc',
    thumbnail: '/ended_proj/landfolio_home.webp',
    siteUrl: 'https://daria-levitan.com/',
    technologies: [tech('Vue 3'), tech('Vite'), tech('JavaScript'), tech('CSS3')],
    workTypes: ['frontend', 'uiux'],
    images: [
      '/ended_proj/landfolio_home.webp',
    ],
  },
  {
    id: 'change-web',
    category: 'web',
    tier: 'product',
    titleKey: 'works.projects.change_web.title',
    descKey: 'works.projects.change_web.desc',
    thumbnail: 'https://github.com/user-attachments/assets/4d8c8ee1-d3b4-48ab-afb7-b9d231066818',
    siteUrl: 'http://money-site-bucket.s3-website.eu-central-1.amazonaws.com/',
    technologies: [tech('Vue 3'), tech('Vite'), tech('JavaScript'), tech('CSS3')],
    workTypes: ['frontend'],
    images: [
      'https://github.com/user-attachments/assets/4d8c8ee1-d3b4-48ab-afb7-b9d231066818',
      'https://github.com/user-attachments/assets/3cce7c51-8078-4038-9728-468bbacda501',
      'https://github.com/user-attachments/assets/3caa22ad-7c07-4b25-aec8-0055fc43c5d0',
    ],
  },
  {
    id: 'android',
    category: 'android',
    tier: 'craft',
    titleKey: 'works.projects.android.title',
    descKey: 'works.projects.android.desc',
    thumbnail: '/ended_proj/android_play.webp',
    technologies: [tech('Java'), tech('Android Studio'), tech('XML'), tech('Firebase')],
    workTypes: ['mobile'],
    images: [
      '/ended_proj/android_play.webp',
      '/ended_proj/android_log.webp',
      '/ended_proj/androin_log2.webp',
      '/ended_proj/android_end.webp',
    ],
  },
  {
    id: 'cross_II',
    category: 'android',
    tier: 'craft',
    titleKey: 'works.projects.cross_II.title',
    descKey: 'works.projects.cross_II.desc',
    thumbnail: '/ended_proj/cross_II_home.webp',
    technologies: [tech('React Native'), tech('JavaScript'), tech('CSS3')],
    workTypes: ['mobile'],
    images: [
      '/ended_proj/cross_II_home.webp',
      '/ended_proj/cross_II_collection.webp',
      '/ended_proj/cross_II_user.webp',
      '/ended_proj/cross_II_wanted.webp',
    ],
  },
  {
    id: 'learning',
    category: 'web',
    tier: 'craft',
    titleKey: 'works.projects.learning.title',
    descKey: 'works.projects.learning.desc',
    thumbnail: '/ended_proj/learning_home.webp',
    technologies: [tech('HTML5'), tech('CSS3'), tech('JavaScript'), tech('React')],
    workTypes: ['frontend'],
    images: [
      '/ended_proj/learning_home.webp',
      '/ended_proj/learning_games.webp',
      '/ended_proj/learning_add.webp',
    ],
  },
  {
    id: 'massage',
    category: 'web',
    tier: 'craft',
    titleKey: 'works.projects.massage.title',
    descKey: 'works.projects.massage.desc',
    thumbnail: '/ended_proj/massage_home.webp',
    github: 'https://github.com/Jony251/massage',
    technologies: [tech('HTML5'), tech('CSS3'), tech('JavaScript')],
    workTypes: ['frontend'],
    images: [
      '/ended_proj/massage_home.webp',
      '/ended_proj/massage_services.webp',
      '/ended_proj/massage_footer.webp',
    ],
  },
];

export default projects;
