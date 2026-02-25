
import { useEffect, useMemo, useRef } from 'react';
import catPng from '../../assets/cat.png';
import './Cat_anime.comp.css';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const CatAnime = ({ className = '', durationMs = 12000, size = 64 }) => {
  const rootRef = useRef(null);
  const rafRef = useRef(0);

  const style = useMemo(
    () => ({
      '--cat-duration': `${durationMs}ms`,
      '--cat-size': typeof size === 'number' ? `${size}px` : size,
    }),
    [durationMs, size],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const state = { x: 0, y: 0 };
    const update = () => {
      rafRef.current = 0;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = state.x - cx;
      const dy = state.y - cy;

      const nx = clamp(dx / 240, -1, 1);
      const ny = clamp(dy / 180, -1, 1);

      const rot = nx * 7;

      el.style.setProperty('--cat-rot', `${rot}deg`);
    };

    const onMove = (e) => {
      state.x = e.clientX;
      state.y = e.clientY;
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
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

