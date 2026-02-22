import './TechStrip.comp.css';

const TechStrip = () => {
  const tech = [
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Vite', icon: '/vite.svg' }
  ];

  const TechPill = ({ item }) => (
    <div className="tech-pill">
      {item.icon && (
        <img className="tech-logo" src={item.icon} alt={item.name} />
      )}
      <span>{item.name}</span>
    </div>
  );

  return (
    <section className="tech-strip">
      <div className="tech-strip-track" aria-label="Technologies used">
        <div className="tech-strip-inner">
          {tech.map((item) => <TechPill key={item.name} item={item} />)}
        </div>
      </div>
    </section>
  );
};

export default TechStrip;
