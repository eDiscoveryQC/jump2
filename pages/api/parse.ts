import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
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
    const executablePath = await chromium.executablePath;

    console.log("[parse.ts] Puppeteer launching with:", executablePath);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    console.log("[parse.ts] Browser launched");
  }
  return browser;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  logApi("Received request with query: %o", req.query);
  console.log("[parse.ts] Request received:", req.query);

  const { url } = req.query;
  if (!url || typeof url !== "string") {
    console.log("[parse.ts] Invalid URL parameter");
    return res.status(400).json({ error: "Missing or invalid URL parameter" });
  }

  let page: puppeteer.Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    console.log("[parse.ts] Created new page");

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

    console.log("[parse.ts] Navigating to URL:", url);
    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    if (!response || !response.ok()) {
      const status = response?.status();
      console.log(`[parse.ts] Failed to load URL. Status: ${status}`);
      throw new Error(`Failed to load URL, status: ${status}`);
    }

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
      console.log("[parse.ts] Content too short or empty");
      return res.status(204).json({ article: { content: "" } });
    }

    console.log("[parse.ts] Successfully extracted content");
    return res.status(200).json({ article: { content } });
  } catch (error: any) {
    console.error("[parse.ts] Error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    if (page) {
      await page.close();
      console.log("[parse.ts] Closed Puppeteer page");
    }
  }
}
