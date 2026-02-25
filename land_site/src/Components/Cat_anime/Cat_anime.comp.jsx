
import { useMemo } from 'react';
import './Cat_anime.comp.css';

const CatAnime = ({ className = '', durationMs = 1800, size = 140 }) => {
  const style = useMemo(
    () => ({
      '--cat-duration': `${durationMs}ms`,
      '--cat-size': typeof size === 'number' ? `${size}px` : size,
    }),
    [durationMs, size],
  );

  return (
    <div className={`cat-anime ${className}`.trim()} style={style} aria-hidden="true">
      <svg
        className="cat-anime__svg"
        viewBox="0 0 520 180"
        focusable="false"
        role="img"
      >
        <line className="cat-anime__stroke cat-anime__ground" x1="40" y1="132" x2="480" y2="132" />

        <g className="cat-anime__cat" transform="translate(115 18)">
          <path
            className="cat-anime__stroke"
            d="M78 92
               C52 90 40 78 40 62
               C40 44 54 32 78 30
               C98 28 132 28 160 30
               C190 32 214 40 228 52
               C244 64 260 72 280 72
               C298 72 314 62 322 50
               C330 36 324 24 312 20
               C298 16 286 20 276 30"
          />

          <path
            className="cat-anime__stroke"
            d="M274 30
               C288 18 306 14 322 22
               C340 32 346 52 334 72
               C322 90 298 104 268 104
               C244 104 228 96 216 84"
          />

          <path
            className="cat-anime__stroke cat-anime__tail"
            d="M78 30
               C52 20 40 4 44 -12
               C48 -30 70 -40 92 -34"
          />

          <g className="cat-anime__legs">
            <path className="cat-anime__stroke cat-anime__leg cat-anime__leg--a" d="M120 102 C112 118 108 126 110 132" />
            <path className="cat-anime__stroke cat-anime__leg cat-anime__leg--b" d="M154 102 C146 120 144 128 148 132" />
            <path className="cat-anime__stroke cat-anime__leg cat-anime__leg--c" d="M202 98 C196 116 194 126 196 132" />
            <path className="cat-anime__stroke cat-anime__leg cat-anime__leg--d" d="M236 92 C232 112 232 124 234 132" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CatAnime;

