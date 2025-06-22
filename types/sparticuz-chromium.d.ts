declare module "@sparticuz/chromium" {
  const executablePath: string | Promise<string>;
  const args: string[];
  const defaultViewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  };
  const headless: boolean;
  export default {
    executablePath,
    args,
    defaultViewport,
    headless,
  };
}
