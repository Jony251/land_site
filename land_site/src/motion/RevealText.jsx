import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from './gsap';
import useMotionAllowed from './useMotionAllowed';

/**
 * Text that reveals line by line when scrolled into view.
 *
 * Input:
 * - `as` (string): element tag, default `div`.
 * - `className` (string, optional).
 * - `children` (React.ReactNode): the text.
 *
 * Output:
 * - The element; with motion allowed, its lines slide up from a mask once on enter.
 *   With reduced motion, plain static text.
 */
// eslint-disable-next-line no-unused-vars
const RevealText = ({ as: Tag = 'div', className, children }) => {
  const ref = useRef(null);
  const motionAllowed = useMotionAllowed();

  useGSAP(
    () => {
      if (!motionAllowed) return;
      SplitText.create(ref.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          }),
      });
    },
    { scope: ref, dependencies: [motionAllowed, children], revertOnUpdate: true }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default RevealText;
