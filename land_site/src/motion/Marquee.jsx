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
 * - `repeat` (number): segments per copy, default 2. Segment width × `repeat` should be
 *   at least the viewport width for a seamless loop.
 * - `className` (string, optional).
 * - `children` (React.ReactNode): content of one loop segment.
 *
 * Output:
 * - Two identical copies, each holding `repeat` segments of `children`; only the first
 *   segment is exposed to assistive tech. Moves left in LTR, right in RTL;
 *   static with reduced motion.
 */
const Marquee = ({ duration = 30, repeat = 2, className = '', children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();
  const { dir } = useI18n();
  const isRtl = dir === 'rtl';
  const segments = () =>
    Array.from({ length: repeat }, (_, i) => (
      <span
        key={i}
        className="marquee-segment"
        aria-hidden={i > 0 ? 'true' : undefined}
      >
        {children}
      </span>
    ));

  useGSAP(
    (context, contextSafe) => {
      if (!motionAllowed) return;
      const track = ref.current.querySelector('.marquee-track');
      const loop = gsap.fromTo(
        track,
        { xPercent: isRtl ? -50 : 0 },
        {
          xPercent: isRtl ? 0 : -50,
          duration,
          ease: 'none',
          repeat: -1,
          // A reversed repeat:-1 loop stalls at time 0 (GSAP removes it from the timeline);
          // jump far ahead so it keeps running backwards.
          onReverseComplete() {
            this.totalTime(this.rawTime() + this.duration() * 100);
          },
        }
      );

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: contextSafe((self) => {
          const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 400);
          loop.timeScale(self.direction * boost);
          gsap.to(loop, { timeScale: self.direction, duration: 0.8, overwrite: true });
        }),
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
        <div className="marquee-item">{segments()}</div>
        <div className="marquee-item" aria-hidden="true">
          {segments()}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
