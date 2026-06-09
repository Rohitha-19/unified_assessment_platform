import { useState, useCallback } from 'react';

export const useTheme = () => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return [theme, setTheme];
};
