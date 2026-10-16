import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { key } = useLocation();

  useLayoutEffect(() => {
    // браузърът да не връща сам стария скрол
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const before = window.scrollY;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // ВРЕМЕННО: диагностика, ще я махнем след като намерим причината
    console.log('[ScrollToTop]', {
      before,
      after: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      viewport: window.innerHeight,
      htmlOverflow: getComputedStyle(document.documentElement).overflowY,
      bodyOverflow: getComputedStyle(document.body).overflowY,
    });
  }, [key]);

  return null;
}