// lib/log.ts
import debug from "debug";

export const logParse = debug("jump2:parse");     // Puppeteer logs
export const logApi = debug("jump2:api");         // API request logs
export const logRender = debug("jump2:render");   // Deployment/rendering insights

/**
 * Event logger for analytics and debugging.
 * Logs to console only in development.
 */
export function logEvent(event: string, metadata?: Record<string, any>): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[EVENT] ${event}`, metadata ?? {});
  }

  // Future-proof: send to analytics pipeline here if needed
  // e.g., sendToSegment(event, metadata);
}
