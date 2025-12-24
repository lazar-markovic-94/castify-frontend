import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';
import App from './App.tsx';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { initWebVitals } from './shared/utils/webVitals';

// Initialize Web Vitals monitoring
initWebVitals({
  logToConsole: import.meta.env.DEV, // Only log in development
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
