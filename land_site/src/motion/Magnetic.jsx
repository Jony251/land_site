import { useRef } from 'react';
import { gsap, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import './motion.css';

const SPRING = { duration: 0.6, ease: 'elastic.out(1, 0.4)' };

/**
 * Pulls its content toward the mouse pointer.
 *
 * Input:
 * - `strength` (number): fraction of the pointer offset to follow, default 0.35.
 * - `children` (React.ReactNode).
 *
 * Output:
 * - `<span class="magnetic">`. Active only with a fine pointer and motion allowed.
 */
const Magnetic = ({ strength = 0.35, children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();

  useGSAP(
    () => {
      const el = ref.current;
      if (!motionAllowed || !window.matchMedia?.('(pointer: fine)').matches) return undefined;

      const xTo = gsap.quickTo(el, 'x', SPRING);
      const yTo = gsap.quickTo(el, 'y', SPRING);

      const onMove = (event) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: ref, dependencies: [motionAllowed, strength], revertOnUpdate: true }
  );

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
};

export default Magnetic;
