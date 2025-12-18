import { useState, useEffect, useRef } from 'react';
import './CatAvatar.css';

const CatAvatar = ({ isVisible = true, chatRef = null }) => {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const avatarRef = useRef(null);

  // Entry animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowCat(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowCat(false);
    }
  }, [isVisible]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouse tracking for eyes
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!avatarRef.current) return;

      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxOffset = 3;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 50, 1) * maxOffset : 0;
      const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 50, 1) * maxOffset : 0;

      setEyeOffset({ x: normalizedX, y: normalizedY });
    };

    const handleMouseLeave = () => {
      setEyeOffset({ x: 0, y: 0 });
    };

    const chatElement = chatRef?.current;
    if (chatElement) {
      chatElement.addEventListener('mousemove', handleMouseMove);
      chatElement.addEventListener('mouseleave', handleMouseLeave);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (chatElement) {
        chatElement.removeEventListener('mousemove', handleMouseMove);
        chatElement.removeEventListener('mouseleave', handleMouseLeave);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [chatRef]);

  return (
    <div 
      ref={avatarRef}
      className={`cat-avatar-container ${showCat ? 'visible' : ''}`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="cat-avatar-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse 
          cx="50" cy="75" rx="22" ry="18" 
          fill="#668cf5" 
          className="cat-body"
        />
        
        {/* Head */}
        <ellipse 
          cx="50" cy="48" rx="32" ry="28" 
          fill="#668cf5" 
          className="cat-head"
        />
        
        {/* Left Ear */}
        <polygon 
          points="22,35 30,10 42,30" 
          fill="#668cf5" 
          className="cat-ear"
        />
        <polygon 
          points="26,32 32,16 38,30" 
          fill="#ffb6c1" 
          className="cat-ear-inner"
        />
        
        {/* Right Ear */}
        <polygon 
          points="78,35 70,10 58,30" 
          fill="#668cf5" 
          className="cat-ear"
        />
        <polygon 
          points="74,32 68,16 62,30" 
          fill="#ffb6c1" 
          className="cat-ear-inner"
        />
        
        {/* Left Eye White */}
        <ellipse 
          cx="38" cy="45" rx="10" ry={isBlinking ? 1 : 11} 
          fill="white" 
          className="cat-eye-white"
          style={{ transition: 'ry 0.1s ease' }}
        />
        
        {/* Left Eye Pupil */}
        {!isBlinking && (
          <ellipse 
            cx={38 + eyeOffset.x} 
            cy={45 + eyeOffset.y} 
            rx="5" ry="6" 
            fill="#1a1a2e" 
            className="cat-eye-pupil"
            style={{ transition: 'cx 0.1s ease, cy 0.1s ease' }}
          />
        )}
        
        {/* Left Eye Highlight */}
        {!isBlinking && (
          <circle 
            cx={40 + eyeOffset.x * 0.5} 
            cy={42 + eyeOffset.y * 0.5} 
            r="2" 
            fill="white" 
            className="cat-eye-highlight"
          />
        )}
        
        {/* Right Eye White */}
        <ellipse 
          cx="62" cy="45" rx="10" ry={isBlinking ? 1 : 11} 
          fill="white" 
          className="cat-eye-white"
          style={{ transition: 'ry 0.1s ease' }}
        />
        
        {/* Right Eye Pupil */}
        {!isBlinking && (
          <ellipse 
            cx={62 + eyeOffset.x} 
            cy={45 + eyeOffset.y} 
            rx="5" ry="6" 
            fill="#1a1a2e" 
            className="cat-eye-pupil"
            style={{ transition: 'cx 0.1s ease, cy 0.1s ease' }}
          />
        )}
        
        {/* Right Eye Highlight */}
        {!isBlinking && (
          <circle 
            cx={64 + eyeOffset.x * 0.5} 
            cy={42 + eyeOffset.y * 0.5} 
            r="2" 
            fill="white" 
            className="cat-eye-highlight"
          />
        )}
        
        {/* Nose */}
        <polygon 
          points="50,55 46,60 54,60" 
          fill="#ff8fa3" 
        />
        
        {/* Mouth */}
        <path 
          d="M 42 64 Q 50 72 58 64" 
          stroke="#1a1a2e" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Left Whiskers */}
        <line x1="20" y1="52" x2="35" y2="55" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="58" x2="34" y2="58" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="64" x2="35" y2="61" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Right Whiskers */}
        <line x1="80" y1="52" x2="65" y2="55" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="82" y1="58" x2="66" y2="58" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="64" x2="65" y2="61" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default CatAvatar;
