import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSentry } from './config/sentry'
import ErrorBoundary from './components/error/ErrorBoundary'

// Initialize Sentry before rendering the app
initSentry();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
