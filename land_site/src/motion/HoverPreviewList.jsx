import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import './motion.css';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const FOLLOW = { duration: 0.5, ease: 'power3' };

/**
 * Accessible list of project links with a pointer-following image preview.
 *
 * Input:
 * - `items` ({ id, href, title, meta, image }[]): one row per item.
 * - `className` (string, optional).
 *
 * Output:
 * - A list of links. With a fine pointer and motion allowed, one floating image follows the
 *   pointer and shows the hovered row's image. Otherwise every row shows a card thumbnail.
 *   Images that fail to load are hidden; the row stays a working text link.
 */
const HoverPreviewList = ({ items, className = '' }) => {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const motionAllowed = useMotionAllowed();
  const [finePointer] = useState(() => Boolean(window.matchMedia?.(FINE_POINTER).matches));
  const [activeId, setActiveId] = useState(null);
  const [failed, setFailed] = useState(() => new Set());
  const previewEnabled = motionAllowed && finePointer;

  const markFailed = (id) => setFailed((prev) => new Set(prev).add(id));

  useGSAP(
    () => {
      if (!previewEnabled) return undefined;
      const xTo = gsap.quickTo(previewRef.current, 'x', FOLLOW);
      const yTo = gsap.quickTo(previewRef.current, 'y', FOLLOW);
      const list = listRef.current;
      const onMove = (event) => {
        xTo(event.clientX);
        yTo(event.clientY);
      };
      list.addEventListener('mousemove', onMove);
      return () => list.removeEventListener('mousemove', onMove);
    },
    { scope: rootRef, dependencies: [previewEnabled], revertOnUpdate: true }
  );

  const activeItem = items.find((item) => item.id === activeId);
  const showPreview = Boolean(previewEnabled && activeItem && !failed.has(activeItem.id));

  return (
    <div ref={rootRef} className="hpl-root">
      <ul
        ref={listRef}
        className={`hpl ${previewEnabled ? 'hpl--preview' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
        onMouseLeave={() => setActiveId(null)}
      >
        {items.map((item) => (
          <li key={item.id} className="hpl-row" onMouseEnter={() => setActiveId(item.id)}>
            <Link className="hpl-link" to={item.href}>
              {!previewEnabled && !failed.has(item.id) && (
                <img
                  className="hpl-thumb"
                  src={item.image}
                  alt=""
                  loading="lazy"
                  onError={() => markFailed(item.id)}
                />
              )}
              <span className="hpl-title">{item.title}</span>
              <span className="hpl-meta">{item.meta}</span>
            </Link>
          </li>
        ))}
      </ul>
      {previewEnabled && (
        <div ref={previewRef} className={`hpl-preview ${showPreview ? 'is-visible' : ''}`.trim()} aria-hidden="true">
          {showPreview && (
            <img
              className="hpl-preview-img"
              src={activeItem.image}
              alt=""
              onError={() => markFailed(activeItem.id)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HoverPreviewList;
