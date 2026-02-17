import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/LanguageProvider';
import './Works.css';

const projects = [
  {
    id: 'android',
    titleKey: 'works.projects.android.title',
    descKey: 'works.projects.android.desc',
    thumbnail: '/ended_proj/android_play.png',
    images: [
      '/ended_proj/android_play.png',
      '/ended_proj/android_log.png',
      '/ended_proj/androin_log2.png',
      '/ended_proj/android_end.png',
    ],
  },
  {
    id: 'crossplatform',
    titleKey: 'works.projects.crossplatform.title',
    descKey: 'works.projects.crossplatform.desc',
    thumbnail: '/ended_proj/cross_platform.png',
    images: [
      '/ended_proj/cross_platform.png',
      '/ended_proj/cross_platform_home.png',
      '/ended_proj/cross_platform_psw.png',
    ],
  },
  {
    id: 'cross_II',
    titleKey: 'works.projects.cross_II.title',
    descKey: 'works.projects.cross_II.desc',
    thumbnail: '/ended_proj/cross_II_home.png',
    images: [
      '/ended_proj/cross_II_home.png',
      '/ended_proj/cross_II_collection.png',
      '/ended_proj/cross_II_user.png',
      '/ended_proj/cross_II_wanted.png',
    ],
  },
  {
    id: 'learning',
    titleKey: 'works.projects.learning.title',
    descKey: 'works.projects.learning.desc',
    thumbnail: '/ended_proj/learning_home.png',
    images: [
      '/ended_proj/learning_home.png',
      '/ended_proj/learning_games.png',
      '/ended_proj/learning_add.png',
    ],
  },
];

const ProjectModal = ({ project, onClose, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-gallery">
          <img
            src={project.images[currentIndex]}
            alt={t(project.titleKey)}
            className="modal-gallery-image"
          />
          {project.images.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={prevImage} aria-label="Previous">
                ‹
              </button>
              <button className="gallery-nav next" onClick={nextImage} aria-label="Next">
                ›
              </button>
            </>
          )}
        </div>

        {project.images.length > 1 && (
          <div className="gallery-dots">
            {project.images.map((_, index) => (
              <button
                key={index}
                className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="modal-info">
          <h2>{t(project.titleKey)}</h2>
          <p>{t(project.descKey)}</p>
        </div>
      </div>
    </div>
  );
};

const Works = () => {
  const { t } = useI18n();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="works-route">
      <div className="page-content">
        <div className="works-head">
          <h1>{t('works.title')}</h1>
          <p>{t('works.body')}</p>
        </div>

        <div className="works-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
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

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          t={t}
        />
      )}
    </main>
  );
};

export default Works;
