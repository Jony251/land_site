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

const tech = (name) => ({ name, icon: TECH_ICONS[name] || null });

const projects = [
  {
    id: 'android',
    category: 'android',
    titleKey: 'works.projects.android.title',
    descKey: 'works.projects.android.desc',
    thumbnail: '/ended_proj/android_play.png',
    technologies: [tech('Java'), tech('Android Studio'), tech('XML'), tech('Firebase')],
    images: [
      '/ended_proj/android_play.png',
      '/ended_proj/android_log.png',
      '/ended_proj/androin_log2.png',
      '/ended_proj/android_end.png',
    ],
  },
  {
    id: 'crossplatform',
    category: 'web',
    titleKey: 'works.projects.crossplatform.title',
    descKey: 'works.projects.crossplatform.desc',
    thumbnail: '/ended_proj/Whale_Business_land.png',
    siteUrl: 'https://whalebiz.co.il/',
    technologies: [tech('CSS3'), tech('JavaScript'), tech('React')],
    images: [
      '/ended_proj/Whale_Business_land.png',
      '/ended_proj/Whale_Business_login.png',
      '/ended_proj/Whale_Business_reg.png',
    ],
  },
  {
    id: 'cross_II',
    category: 'android',
    titleKey: 'works.projects.cross_II.title',
    descKey: 'works.projects.cross_II.desc',
    thumbnail: '/ended_proj/cross_II_home.png',
    technologies: [tech('React Native'), tech('JavaScript'), tech('CSS3')],
    images: [
      '/ended_proj/cross_II_home.png',
      '/ended_proj/cross_II_collection.png',
      '/ended_proj/cross_II_user.png',
      '/ended_proj/cross_II_wanted.png',
    ],
  },
  {
    id: 'learning',
    category: 'web',
    titleKey: 'works.projects.learning.title',
    descKey: 'works.projects.learning.desc',
    thumbnail: '/ended_proj/learning_home.png',
    technologies: [tech('HTML5'), tech('CSS3'), tech('JavaScript'), tech('React')],
    images: [
      '/ended_proj/learning_home.png',
      '/ended_proj/learning_games.png',
      '/ended_proj/learning_add.png',
    ],
  },
  {
    id: 'massage',
    category: 'web',
    titleKey: 'works.projects.massage.title',
    descKey: 'works.projects.massage.desc',
    thumbnail: '/ended_proj/massage_home.png',
    github: 'https://github.com/Jony251/massage',
    technologies: [tech('HTML5'), tech('CSS3'), tech('JavaScript')],
    images: [
      '/ended_proj/massage_home.png',
      '/ended_proj/massage_services.png',
      '/ended_proj/massage_footer.png',
    ],
  },
  {
    id: 'change-web',
    category: 'web',
    titleKey: 'works.projects.change_web.title',
    descKey: 'works.projects.change_web.desc',
    thumbnail: 'https://github.com/user-attachments/assets/4d8c8ee1-d3b4-48ab-afb7-b9d231066818',
    github: 'https://github.com/Jony251/Change_Web',
    technologies: [tech('Vue 3'), tech('Vite'), tech('JavaScript'), tech('CSS3')],
    images: [
      'https://github.com/user-attachments/assets/4d8c8ee1-d3b4-48ab-afb7-b9d231066818',
      'https://github.com/user-attachments/assets/3cce7c51-8078-4038-9728-468bbacda501',
      'https://github.com/user-attachments/assets/3caa22ad-7c07-4b25-aec8-0055fc43c5d0',
    ],
  },
  {
    id: 'landfolio',
    category: 'web',
    titleKey: 'works.projects.landfolio.title',
    descKey: 'works.projects.landfolio.desc',
    thumbnail: '/ended_proj/landfolio_home.png',
    siteUrl: 'https://daria-levitan.com/',
    technologies: [tech('Vue 3'), tech('Vite'), tech('JavaScript'), tech('CSS3')],
    images: [
      '/ended_proj/landfolio_home.png',
    ],
  },
  {
    id: 'aispace',
    category: 'web',
    titleKey: 'works.projects.aispace.title',
    descKey: 'works.projects.aispace.desc',
    thumbnail: '/ended_proj/aispace_home.png',
    github: 'https://github.com/Jony251/AI_Space',
    technologies: [tech('Vue 3'), tech('TypeScript'), tech('CSS3')],
    images: [
      '/ended_proj/aispace_home.png',
      '/ended_proj/aispace_chat.png',
      '/ended_proj/aispace_features.png',
    ],
  },
  {
    id: 'pet-project-crm',
    category: 'web',
    titleKey: 'works.projects.crm.title',
    descKey: 'works.projects.crm.desc',
    thumbnail: 'https://github.com/user-attachments/assets/74915549-c17c-4391-8713-50eb23da5719',
    github: 'https://github.com/Jony251/pet-project-CRM',
    technologies: [tech('React'), tech('JavaScript'), tech('CSS3')],
    images: [
      'https://github.com/user-attachments/assets/74915549-c17c-4391-8713-50eb23da5719',
      'https://github.com/user-attachments/assets/f984bed2-01c5-4c33-9078-6d8b2b2dd1f1',
      'https://github.com/user-attachments/assets/dfe12271-46dd-4430-a16b-d83cd4b5f954',
      'https://github.com/user-attachments/assets/5db9a83d-d7a6-4fde-bcdb-b0ba94c9d825',
      'https://github.com/user-attachments/assets/4421accf-a85d-4409-88b3-2643437bc890',
    ],
  },
];

export default projects;
