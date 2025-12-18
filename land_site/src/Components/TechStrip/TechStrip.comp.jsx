import './TechStrip.comp.css';
import reactLogo from '../../assets/react.svg';

const TechStrip = () => {
  const tech = [
    { name: 'React', logo: reactLogo },
    { name: 'Vite', logo: '/vite.svg' },
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'EmailJS' },
  ];

  return (
    <section className="tech-strip">
      <div className="page-content">
        <div className="tech-strip-inner" aria-label="Technologies used">
          {tech.map((item) => (
            <div key={item.name} className="tech-pill">
              {item.logo && (
                <img className="tech-logo" src={item.logo} alt={item.name} />
              )}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStrip;
