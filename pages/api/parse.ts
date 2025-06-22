import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";
import type puppeteer from "puppeteer-core";
import { logParse, logApi } from "@/lib/log";

interface Article {
  content: string;
}

interface ResponseData {
  article?: Article;
  error?: string;
}

let browser: puppeteer.Browser | null = null;

async function getBrowser(): Promise<puppeteer.Browser> {
  if (!browser) {
    const executablePath = await chromium.executablePath || '/usr/bin/chromium-browser';
    logParse("Launching new Puppeteer browser");
    console.log("[parse.ts] Launching Puppeteer with executable path:", executablePath);

    browser = await chromium.puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', ...chromium.args],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    logParse("Browser launched successfully");
    console.log("[parse.ts] Browser launched successfully");
  } else {
    logParse("Reusing existing Puppeteer browser");
    console.log("[parse.ts] Reusing existing Puppeteer browser");
  }
  return browser;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  logApi("Received request with query: %o", req.query);
  console.log("[parse.ts] Received request:", req.query);

  const { url } = req.query;
  if (!url || typeof url !== "string") {
    logApi("Invalid or missing URL");
    console.log("[parse.ts] Invalid or missing URL");
    res.status(400).json({ error: "Missing or invalid URL parameter" });
    return;
  }

  let page: puppeteer.Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    console.log("[parse.ts] Created new page");

    logParse("Setting up request interception for resource optimization");
    console.log("[parse.ts] Setting up request interception");
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const type = request.resourceType();
      if (["image", "stylesheet", "font", "media", "manifest", "other"].includes(type)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    logParse("Navigating to URL: %s", url);
    console.log(`[parse.ts] Navigating to URL: ${url}`);
    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    if (!response || !response.ok()) {
      const status = response?.status();
      logParse("Failed to load URL. Status: %s", status);
      console.log(`[parse.ts] Failed to load URL. Status: ${status}`);
      throw new Error(`Failed to load URL, status: ${status}`);
    }

    console.log("[parse.ts] Page loaded, extracting content");
    const content = await page.evaluate(() => {
      const selectors = [
        "article",
        "main",
        "section.article-body",
        ".article-content",
        "#article-body",
        ".content",
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && (el as HTMLElement).innerText.length > 100) {
          return el.innerHTML.trim();
        }
      }
      return document.body.innerHTML || "";
    });

    if (!content || content.length < 100) {
      logParse("Content too short or empty");
      console.log("[parse.ts] Content too short or empty");
      res.status(204).json({ article: { content: "" } });
      return;
    }

    logApi("Successfully extracted content");
    console.log("[parse.ts] Successfully extracted content");
    res.status(200).json({ article: { content } });
  } catch (error: any) {
    logApi("Error occurred: %s", error.message);
    console.error("[parse.ts] Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    if (page) {
      await page.close();
      logParse("Closed Puppeteer page");
      console.log("[parse.ts] Closed Puppeteer page");
    }
  }
}
