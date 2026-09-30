import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';
import useI18n from '../i18n/useI18n';
import './motion.css';

/**
 * Infinite horizontal text loop that reacts to scroll speed and direction.
 *
 * Input:
 * - `duration` (number): seconds for one full loop at rest, default 30.
 * - `className` (string, optional).
 * - `children` (React.ReactNode): content of one loop segment.
 *
 * Output:
 * - Two copies of `children` (second `aria-hidden`). Moves left in LTR, right in RTL;
 *   static with reduced motion.
 */
const Marquee = ({ duration = 30, className = '', children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();
  const { dir } = useI18n();
  const isRtl = dir === 'rtl';

  useGSAP(
    () => {
      if (!motionAllowed) return;
      const track = ref.current.querySelector('.marquee-track');
      const loop = gsap.fromTo(
        track,
        { xPercent: isRtl ? -50 : 0 },
        { xPercent: isRtl ? 0 : -50, duration, ease: 'none', repeat: -1 }
      );

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 400);
          loop.timeScale(self.direction * boost);
          gsap.to(loop, { timeScale: self.direction, duration: 0.8, overwrite: true });
        },
      });
    },
    { scope: ref, dependencies: [motionAllowed, isRtl, duration], revertOnUpdate: true }
  );

  return (
    <div
      ref={ref}
      className={`marquee ${className}`.trim()}
      dir="ltr"
      data-direction={isRtl ? 'right' : 'left'}
    >
      <div className="marquee-track">
        <div className="marquee-item">{children}</div>
        <div className="marquee-item" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
