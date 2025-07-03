import debug from 'debug';

export const logParse = debug('jump2:parse');     // For Puppeteer-related logging
export const logApi = debug('jump2:api');         // For general API request logs
export const logRender = debug('jump2:render');   // For deployment-specific insights

export function logEvent(event: string, metadata?: Record<string, any>): void {
  console.log(`[EVENT] ${event}`, metadata ?? {});
}
