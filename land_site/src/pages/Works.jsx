import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageProvider';
import projects from './in_Work/projectsData';
import './Works.css';


const Works = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('web');

  const visibleProjects = projects.filter((p) => p.category === selectedCategory);

  return (
    <main className="works-route">
      <div className="works-filterbar">
        <div className="page-content">
          <nav className="works-categories" aria-label="Works categories">
            <button
              type="button"
              className={`works-category ${selectedCategory === 'web' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('web')}
            >
              WEB
            </button>
            <button
              type="button"
              className={`works-category ${selectedCategory === 'android' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('android')}
            >
              ANDROID
            </button>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="works-grid">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => navigate(`/works/${project.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/works/${project.id}`)}
            >
              <img
                src={project.thumbnail}
                alt={t(project.titleKey)}
                className="project-card-image"
              />
              <div className="project-card-content">
                <h3>{t(project.titleKey)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
};

export default Works;
