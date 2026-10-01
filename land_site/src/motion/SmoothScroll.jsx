import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './gsap';
import useMotionAllowed from './useMotionAllowed';

/**
 * Smooth scrolling for the whole page.
 *
 * Input:
 * - `children` (React.ReactNode). Must be rendered inside a Router.
 *
 * Side effects:
 * - While motion is allowed: one Lenis instance driven by the GSAP ticker, synced with ScrollTrigger.
 * - On every pathname change: scrolls to the top instantly.
 *
 * Output:
 * - `children` unchanged.
 */
const SmoothScroll = ({ children }) => {
  const motionAllowed = useMotionAllowed();
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!motionAllowed) return undefined;

    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motionAllowed]);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default SmoothScroll;
