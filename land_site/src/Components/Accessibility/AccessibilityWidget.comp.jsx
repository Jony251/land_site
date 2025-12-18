import { useState, useEffect, useRef } from 'react';
import { useA11y } from '../../a11y/AccessibilityProvider';
import { useI18n } from '../../i18n/LanguageProvider';
import './AccessibilityWidget.comp.css';

const AccessibilityWidget = () => {
  const [open, setOpen] = useState(false);
  const { state, setFontScale, toggleHighContrast, toggleReduceMotion, reset } = useA11y();
  const { t } = useI18n();
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="a11y-widget" ref={widgetRef}>
      <button
        type="button"
        className={`a11y-fab ${open ? 'open' : ''}`}
        aria-label={t('a11y.title')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        A
      </button>

      {open && (
        <div className="a11y-panel" role="dialog" aria-label={t('a11y.title')}>
          <div className="a11y-panel-row">
            <div className="a11y-title">{t('a11y.title')}</div>
            <button type="button" className="a11y-link" onClick={reset}>{t('a11y.reset')}</button>
          </div>

          <div className="a11y-section">
            <div className="a11y-label">{t('a11y.textSize')}</div>
            <div className="a11y-controls">
              <button type="button" className="a11y-btn" onClick={() => setFontScale(state.fontScale - 0.1)}>-</button>
              <div className="a11y-value">{Math.round(state.fontScale * 100)}%</div>
              <button type="button" className="a11y-btn" onClick={() => setFontScale(state.fontScale + 0.1)}>+</button>
            </div>
          </div>

          <div className="a11y-section">
            <label className="a11y-toggle">
              <input type="checkbox" checked={state.highContrast} onChange={toggleHighContrast} />
              <span>{t('a11y.highContrast')}</span>
            </label>
            <label className="a11y-toggle">
              <input type="checkbox" checked={state.reduceMotion} onChange={toggleReduceMotion} />
              <span>{t('a11y.reduceMotion')}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
