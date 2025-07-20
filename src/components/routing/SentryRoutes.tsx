import { withSentryRouting } from '@sentry/react';
import { Routes } from 'react-router-dom';

// Wrap React Router's Routes component with Sentry's routing instrumentation
const SentryRoutes = withSentryRouting(Routes);

export default SentryRoutes;