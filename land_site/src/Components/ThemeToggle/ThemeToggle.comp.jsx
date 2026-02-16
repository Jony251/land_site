import { useTheme } from '../../theme/ThemeProvider';
import { useSiteCopy } from '../../i18n/siteCopy';
import './ThemeToggle.comp.css';

const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const sc = useSiteCopy();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? sc('theme.switchToLight') : sc('theme.switchToDark')}
      title={isDark ? sc('theme.switchToLight') : sc('theme.switchToDark')}
    >
      <span className={`theme-toggle-thumb ${isDark ? 'dark' : 'light'}`} />
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;
