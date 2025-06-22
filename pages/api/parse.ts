import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Browser, Page } from "puppeteer";

interface Article {
  content: string;
}

interface ResponseData {
  article?: Article;
  error?: string;
}

let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: { width: 1280, height: 800 },
    });
  }
  return browserPromise;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing or invalid URL parameter" });
    return;
  }

  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Block images/fonts/stylesheets to speed up page load and reduce bandwidth
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (
        ["image", "stylesheet", "font", "media", "manifest", "other"].includes(
          resourceType
        )
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Set user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load URL, status: ${response?.status()}`);
    }

    // Extract article content by trying common selectors or fallback to full body HTML
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
        // Cast el to HTMLElement to access innerText
        if (el && (el as HTMLElement).innerText.length > 100) {
          return el.innerHTML.trim();
        }
      }
      return document.body.innerHTML || "";
    });

    if (!content || content.length < 100) {
      res.status(204).json({ article: { content: "" } });
      return;
    }

    res.status(200).json({ article: { content } });
  } catch (error: any) {
    console.error("[parse.ts]", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    if (page) await page.close();
  }
}
