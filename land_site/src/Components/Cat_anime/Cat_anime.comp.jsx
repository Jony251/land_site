
import { useMemo } from 'react';
import catPng from '../../assets/cat.png';
import './Cat_anime.comp.css';

const CatAnime = ({ className = '', durationMs = 12000, size = 64 }) => {
  const style = useMemo(
    () => ({
      '--cat-duration': `${durationMs}ms`,
      '--cat-size': typeof size === 'number' ? `${size}px` : size,
    }),
    [durationMs, size],
  );

  return (
    <div
      className={`cat-anime ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <div className="cat-anime__walker">
        <div className="cat-anime__img-wrap">
          <img className="cat-anime__img" src={catPng} alt="" />
        </div>
      </div>
    </div>
  );
};

export default CatAnime;

