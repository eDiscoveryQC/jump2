import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { logParse, logApi } from "@/lib/log";
import { Readability } from "@mozilla/readability";

interface Article {
  content: string;
}
interface ResponseData {
  article: Article;
  error?: string;
}

function cleanArticleText(html: string): string {
  let cleaned = html.replace(/<(style|script|noscript)[^>]*>[\s\S]*?<\/\1>/gi, "");
  cleaned = cleaned.replace(/[#.@\w\s\-]+{[^}]+}/g, "");
  cleaned = cleaned.replace(/@media[^{]+{[^}]+}/g, "");
  cleaned = cleaned.replace(/.*advertisement.*\n?/gi, "");
  cleaned = cleaned.replace(/.*sponsored.*\n?/gi, "");
  cleaned = cleaned.replace(/.*Ad:.*\n?/gi, "");
  cleaned = cleaned.replace(/Return to Homepage.*/gi, "");
  cleaned = cleaned.replace(/Top Stories.*/gi, "");
  cleaned = cleaned.replace(/^\s*[\r\n]/gm, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, ""); // Remove HTML comments
  cleaned = cleaned.replace(/(\s{2,})/g, " ");
  return cleaned.trim();
}

// The ultimate gold-standard bulletproof parser
async function tryDirectFetchAndParse(url: string): Promise<{content: string, error?: string}> {
  try {
    // Aggressive timeout
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
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    // --- 1. Try modern article selectors (broad, platform-specific) ---
    const selectors = [
      'article', 'main', '.content', 'section',
      // Yahoo News
      'div.caas-body',
      '[data-type="text"]',
      '[data-test-locator="article-body"]',
      // NYT
      'section[name="articleBody"]',
      // BBC
      '.ssrcss-uf6wea-RichTextComponentWrapper',
      // CNN, Fox, The Guardian
      '.article__content', '.article-body', '.content__article-body',
      // Medium
      'article .section-inner',
      // Substack
      '.body',
      // Fallback for web novels, blogs, etc.
      '.post-content', '.entry-content', '.blog-post', '.story-content'
    ];

    let mainContent: Element | null = null;
    for (const sel of selectors) {
      mainContent = doc.querySelector(sel);
      if (
        mainContent &&
        mainContent.textContent &&
        mainContent.textContent.replace(/\s+/g, " ").length > 120
      ) break;
    }

    // --- 2. If not found, try the largest visible div/section by text length ---
    if (!mainContent) {
      let biggest: Element | null = null;
      let maxLen = 0;
      const candidates: Element[] = Array.from(doc.querySelectorAll('div, section'));
      for (const el of candidates) {
        const txt = el.textContent?.replace(/\s+/g, " ").trim() || "";
        if (txt.length > maxLen) {
          maxLen = txt.length;
          biggest = el;
        }
      }
      if (maxLen > 120) mainContent = biggest;
    }

    // --- 3. If still not found, join all <p> tags with visible text ---
    let cleaned = "";
    if (mainContent && mainContent.innerHTML) {
      cleaned = mainContent.innerHTML.trim();
    } else {
      const allP = Array.from(doc.querySelectorAll("p"))
        .map(p => p.textContent?.replace(/\s+/g, " ").trim() || "")
        .filter(t => t.length > 0 && t.length > 25);
      cleaned = allP.join("\n\n");
    }

    cleaned = cleanArticleText(cleaned);

    // --- 4. As ultimate fallback, use Mozilla Readability (if not enough content) ---
    if ((!cleaned || cleaned.length < 120) && typeof Readability === "function") {
      try {
        const reader = new Readability(doc);
        const article = reader.parse();
        if (article && article.content && article.content.length > 120) {
          cleaned = cleanArticleText(article.content);
        }
      } catch (e) {
        // Ignore, fallback to whatever we have
      }
    }

    // --- 5. If still not enough, try joining all <li> and <span> tags (for chatty/bloggy sites) ---
    if (!cleaned || cleaned.length < 120) {
      const allLi = Array.from(doc.querySelectorAll("li"))
        .map(li => li.textContent?.replace(/\s+/g, " ").trim() || "")
        .filter(t => t.length > 0 && t.length > 15);
      if (allLi.length) cleaned = allLi.join("\n\n");
    }
    if (!cleaned || cleaned.length < 120) {
      const allSpan = Array.from(doc.querySelectorAll("span"))
        .map(span => span.textContent?.replace(/\s+/g, " ").trim() || "")
        .filter(t => t.length > 0 && t.length > 25);
      if (allSpan.length) cleaned = allSpan.join("\n\n");
    }

    // --- 6. Final fallback: just use the document body's plain text ---
    if (!cleaned || cleaned.length < 120) {
      const bodyText = doc.body?.textContent?.replace(/\s+/g, " ").trim() || "";
      cleaned = bodyText;
    }

    cleaned = cleanArticleText(cleaned);

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
    if (!response.ok) {
      let errorMessage = `ScrapingBee error: ${response.status}`;
      try {
        const errJson = await response.json() as { error?: string };
        errorMessage += " " + (errJson.error || JSON.stringify(errJson));
      } catch {}
      beeError = errorMessage;
    }

    let data: { article?: string } = {};
    if (response.ok) {
      try {
        data = (await response.json()) as { article?: string };
      } catch (err) {
        beeError = "Invalid response from ScrapingBee";
      }
    }

    const html = data.article || "";
    let cleaned = "";
    let scrapingBeeWorked = false;

    if (html.length >= 100) {
      try {
        const dom = new JSDOM(html, { url });
        const doc = dom.window.document;
        doc.querySelectorAll("style, script, noscript").forEach(el => el.remove());
        doc.querySelectorAll("div").forEach(div => {
          const id = div.id || "";
          if (/^R[35]b8/.test(id) || /ad/i.test(id)) div.remove();
        });
        cleaned = doc.body.innerHTML.trim();
        cleaned = cleanArticleText(cleaned);

        // If still not enough, try Readability
        if ((!cleaned || cleaned.length < 100) && typeof Readability === "function") {
          try {
            const reader = new Readability(doc);
            const article = reader.parse();
            if (article && article.content && article.content.length > 100) {
              cleaned = cleanArticleText(article.content);
            }
          } catch {}
        }

        scrapingBeeWorked = !!cleaned && cleaned.length >= 100;
      } catch (jsdomErr: any) {
        beeError = "Could not parse content from ScrapingBee preview.";
      }
    }

    if (scrapingBeeWorked) {
      logParse("Cleaned content length (bee):", cleaned.length);
      return res.status(200).json({ article: { content: cleaned } });
    }

    // Fallback: try fetching directly with the gold-standard parser
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