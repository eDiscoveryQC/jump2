// lib/log.ts
import debug from 'debug';

type Metadata = Record<string, unknown>;

type LogScope = {
  info: (msg: string, meta?: Metadata) => void;
  warn: (msg: string, meta?: Metadata) => void;
  error: (msg: string, meta?: Metadata) => void;
};

function createLogger(scope: string): LogScope {
  const base = debug(scope);
  return {
    info: (msg, meta) => base(`[INFO] ${msg}`, meta ?? {}),
    warn: (msg, meta) => base(`[WARN] ${msg}`, meta ?? {}),
    error: (msg, meta) => base(`[ERROR] ${msg}`, meta ?? {}),
  };
}

// Scoped loggers
export const Log = {
  Parse: createLogger('jump2:parse'),     // Puppeteer-related processing
  API: createLogger('jump2:api'),         // Route/API interactions
  Render: createLogger('jump2:render'),   // Frontend-specific logs
  DB: createLogger('jump2:db'),           // Database operations
  Auth: createLogger('jump2:auth'),       // Auth flow insights
  Upload: createLogger('jump2:upload'),   // File storage handling
};

// Structured event logger for analytics or observability
export async function logEvent(
  event: string,
  metadata: Metadata = {}
): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[EVENT] ${event}`,
