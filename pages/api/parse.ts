import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { logParse, logApi } from "@/lib/log";
import { Readability } from "@mozilla/readability";
import createDOMPurify from "dompurify";

interface Article {
  content: string;
}
interface ResponseData {
  article: Article;
  error?: string;
}

// Only remove dangerous/invisible nodes, not visible text
function sanitizeArticleHtml(html: string, url: string): string {
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;
  // Remove dangerous/invisible elements
  doc.querySelectorAll("script, style, noscript, iframe, object, embed, form, header, footer, nav, aside, [aria-hidden='true'], [hidden]").forEach(el => el.remove());
  // Use Readability for main content (if possible)
  let articleHtml = "";
  try {
    const reader = new Readability(doc);
    const article = reader.parse();
    if (article && article.content && article.content.length > 100) {
      articleHtml = article.content;
    }
  } catch {}
  if (!articleHtml) articleHtml = doc.body.innerHTML;
  // Sanitized, but don't touch visible text
  const DOMPurify = createDOMPurify(dom.window as any);
  return DOMPurify.sanitize(articleHtml, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus']
  });
}

// The ultimate gold-standard bulletproof parser (used as fallback)
async function tryDirectFetchAndParse(url: string): Promise<{content: string, error?: string}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Jump2Bot/1.0; +https://jump2.link/)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!resp.ok) return { content: "", error: `Direct fetch failed: ${resp.status}` };
    const html = await resp.text();
    const cleaned = sanitizeArticleHtml(html, url);
    if (!cleaned || cleaned.length < 100) {
      return { content: "", error: "Fetched content too short or not found (after exhaustive parsing)." };
    }
    return { content: cleaned };
  } catch (err: any) {
    return { content: "", error: "Direct fetch error: " + (err.message || err)};
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  logApi("Received request", req.query);
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return res
      .status(400)
      .json({ article: { content: "" }, error: "Missing or invalid URL parameter" });
  }

  try {
    const API_KEY = process.env.SCRAPINGBEE_API_KEY;
    if (!API_KEY) {
      throw new Error("Missing ScrapingBee API key");
    }

    const extractRules = JSON.stringify({
      article: [
        "article, main, .content, section, .caas-body, [data-type='text'], [data-test-locator='article-body'], section[name='articleBody'], .ssrcss-uf6wea-RichTextComponentWrapper, .article__content, .article-body, .content__article-body, article .section-inner, .body, .post-content, .entry-content, .blog-post, .story-content"
      ].join(", ")
    });
    const apiUrl = `https://app.scrapingbee.com/api/v1?api_key=${API_KEY}&url=${encodeURIComponent(
      url
    )}&extract_rules=${encodeURIComponent(extractRules)}&render_js=true`;

    logParse("Fetching from ScrapingBee:", apiUrl);
    const response = await fetch(apiUrl);

    let beeError = "";
    let html = "";
    if (response.ok) {
      try {
        const data = (await response.json()) as { article?: string };
        html = data.article || "";
      } catch {
        beeError = "Invalid response from ScrapingBee";
      }
    } else {
      let errorMessage = `ScrapingBee error: ${response.status}`;
      try {
        const errJson = await response.json() as { error?: string };
        errorMessage += " " + (errJson.error || JSON.stringify(errJson));
      } catch {}
      beeError = errorMessage;
    }

    let cleaned = "";
    let scrapingBeeWorked = false;

    if (html.length >= 100) {
      try {
        cleaned = sanitizeArticleHtml(html, url);
        scrapingBeeWorked = !!cleaned && cleaned.length >= 100;
      } catch (jsdomErr: any) {
        beeError = "Could not parse content from ScrapingBee preview.";
      }
    }

    if (scrapingBeeWorked) {
      logParse("Cleaned content length (bee):", cleaned.length);
      return res.status(200).json({ article: { content: cleaned } });
    }

    // Fallback: try fetching directly
    logParse("ScrapingBee failed/too short, trying direct fetch fallback", { beeError });
    const fallbackResult = await tryDirectFetchAndParse(url);

    if (fallbackResult.content && fallbackResult.content.length >= 100) {
      logParse("Fallback direct fetch worked, content length:", fallbackResult.content.length);
      return res.status(200).json({ article: { content: fallbackResult.content } });
    }

    logParse("Fallback direct fetch failed", fallbackResult);

    // Both failed, return error
    return res.status(200).json({
      article: { content: "" },
      error: `Both ScrapingBee and direct fetch failed: ${beeError} / ${fallbackResult.error || "No content found or site blocks scraping."}`
    });
  } catch (err: any) {
    console.error("[parse.ts] Error:", err);
    return res
      .status(200)
      .json({ article: { content: "" }, error: err.message || "Internal server error" });
  }
}