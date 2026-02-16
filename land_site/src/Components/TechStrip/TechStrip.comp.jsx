import './TechStrip.comp.css';
import { useI18n } from '../../i18n/LanguageProvider';

const TechStrip = () => {
  const { t } = useI18n();

  const tech = [
    'React',
    'JavaScript',
    'Node.js',
    'Python',
    'REST APIs',
    'Responsive UI',
    'SEO',
    'Accessibility',
    'Performance',
    'Analytics',
    'EmailJS',
    'Automation',
  ];

  const stripItems = [...tech, ...tech];

  return (
    <section className="tech-strip">
      <div className="tech-strip-track" aria-label={t('tech.title')}>
        <div className="tech-strip-inner">
          {stripItems.map((item, index) => (
            <span key={`${item}-${index}`} className="tech-pill">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStrip;
