import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PageTransitionContext } from './PageTransitionContext';
import useMotionAllowed from './useMotionAllowed';

const isPlainLeftClick = (event) =>
  event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;

/**
 * Drop-in replacement for the router `Link` that plays the curtain transition.
 *
 * Input:
 * - `to` (string): internal path.
 * - `label` (string, optional): page name shown on the curtain.
 * - Any other `Link` props (`className`, `onClick`, `target`, `aria-*`, …).
 *
 * Output:
 * - A `Link`. A plain left click with motion allowed and a `PageTransitionProvider` above
 *   starts the curtain transition; anything else behaves exactly like `Link`.
 */
const TransitionLink = ({ to, label = '', onClick, target, children, ...rest }) => {
  const transition = useContext(PageTransitionContext);
  const motionAllowed = useMotionAllowed();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || !transition || !motionAllowed) return;
    if (!isPlainLeftClick(event) || (target && target !== '_self')) return;
    event.preventDefault();
    transition.start(to, label);
  };

  return (
    <Link to={to} target={target} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
