import * as Sentry from "@sentry/react";

// Initialize Sentry for error monitoring
const initSentry = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (sentryDsn && import.meta.env.PROD) {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.MODE,
      // Setting this option to true will send default PII data to Sentry.
      sendDefaultPii: false,
      // Performance monitoring
      tracesSampleRate: 1.0,
      // Session replay
      integrations: [Sentry.replayIntegration()],
      // Session Replay sample rate
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  } else if (sentryDsn && import.meta.env.DEV) {
    // Development mode - limited Sentry
    Sentry.init({
      dsn: sentryDsn,
      environment: "development",
      sendDefaultPii: false,
      tracesSampleRate: 0.1, // Reduced for development
    });
  }
};

// Test error function for development
export const testSentryError = () => {
  throw new Error("VealthX Sentry Test Error - Everything is working!");
};

// Export Sentry for use in components
export { Sentry };
export default initSentry;
