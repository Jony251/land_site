import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { gsap, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import { PageTransitionContext } from './PageTransitionContext';
import { MASCOT_IMAGE } from '../config/owner';
import './motion.css';

const CURTAIN_IN = { yPercent: 0, duration: 0.45, ease: 'power3.inOut' };
const CURTAIN_OUT = { yPercent: -100, duration: 0.45, ease: 'power3.inOut', delay: 0.05 };

/** Moves keyboard focus to the new page's main heading without scrolling. */
const focusHeading = () => {
  const heading = document.querySelector('main h1') || document.querySelector('h1');
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
};

/**
 * Curtain page transitions.
 *
 * Input:
 * - `children` (React.ReactNode). Must be rendered inside a Router.
 *
 * Output:
 * - `children` plus a full-screen curtain (mascot + page name), and `PageTransitionContext`
 *   with `start(to, label)`: curtain in → navigate → curtain out. Motion off → plain navigation.
 *   Browser back/forward → curtain out only. After every route change, focus moves to `<h1>`.
 */
export const PageTransitionProvider = ({ children }) => {
  const curtainRef = useRef(null);
  const busyRef = useRef(false);
  const lastKeyRef = useRef(null);
  const [label, setLabel] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const motionAllowed = useMotionAllowed();
  const { contextSafe } = useGSAP({ scope: curtainRef });

  if (lastKeyRef.current === null) lastKeyRef.current = location.key;

  const hide = contextSafe(() => {
    gsap.set(curtainRef.current, { visibility: 'hidden' });
    busyRef.current = false;
  });

  const curtainOut = contextSafe(() => {
    gsap.to(curtainRef.current, { ...CURTAIN_OUT, onComplete: hide });
  });

  const start = contextSafe((to, nextLabel = '') => {
    if (busyRef.current || to === location.pathname) return;
    busyRef.current = true;
    setLabel(nextLabel);
    gsap.fromTo(
      curtainRef.current,
      { yPercent: 100, visibility: 'visible' },
      { ...CURTAIN_IN, onComplete: () => navigate(to) }
    );
  });

  useEffect(() => {
    if (lastKeyRef.current === location.key) return;
    lastKeyRef.current = location.key;
    focusHeading();

    if (busyRef.current) {
      if (motionAllowed) curtainOut();
      else hide();
      return;
    }
    if (motionAllowed && navigationType === 'POP') {
      busyRef.current = true;
      gsap.set(curtainRef.current, { yPercent: 0, visibility: 'visible' });
      curtainOut();
    }
    // Runs only when the location changes; motion state is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <PageTransitionContext.Provider value={{ start }}>
      {children}
      <div ref={curtainRef} className="curtain" aria-hidden="true">
        <img className="curtain-cat" src={MASCOT_IMAGE} alt="" />
        <span className="curtain-label">{label}</span>
      </div>
    </PageTransitionContext.Provider>
  );
};
