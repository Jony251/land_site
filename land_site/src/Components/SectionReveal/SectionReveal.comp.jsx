import { useEffect, useRef, useState } from 'react';

const SectionReveal = ({ children, as = 'div', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const Component = as;

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </Component>
  );
};

export default SectionReveal;
