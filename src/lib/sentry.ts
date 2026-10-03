import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
  });
}

// Wrapper for Mastra Agent Tracing
export async function withSentryTracing<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return await Sentry.startSpan({ name, op: 'agent.execution' }, async () => {
    return await fn();
  });
}
