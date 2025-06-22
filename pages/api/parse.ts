import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { logParse, logApi } from "@/lib/log";

interface Article {
  content: string;
}
interface ResponseData {
  article: Article;
  error?: string;
}
interface ScrapingBeeResponse {
  article?: string;
  [key: string]: any;
}

async function tryDirectFetchAndParse(url: string): Promise<{content: string, error?: string}> {
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Jump2Bot/1.0)' } });
    if (!resp.ok) return { content: "", error: `Direct fetch failed: ${resp.status}` };
    const html = await resp.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    let mainContent = doc.querySelector("article, main, .content");
    if (!mainContent) {
      // fallback: body, but strip scripts/styles
      doc.querySelectorAll("style, script").forEach(el => el.remove());
      mainContent = doc.body;
    }
    let cleaned = mainContent?.innerHTML?.trim() || "";
    // Remove ads/noise divs
    doc.querySelectorAll("div").forEach(div => {
      const id = div.id || "";
      if (/^R[35]b8/.test(id) || /ad/i.test(id)) div.remove();
    });
    if (!cleaned || cleaned.length < 100) {
      return { content: "", error: "Fetched content too short or not found." };
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

    const extractRules = JSON.stringify({ article: "article, main, .content" });
    const apiUrl = `https://app.scrapingbee.com/api/v1?api_key=${API_KEY}&url=${encodeURIComponent(
      url
    )}&extract_rules=${encodeURIComponent(
      extractRules
    )}&render_js=true`;

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

    let data: ScrapingBeeResponse = {};
    if (response.ok) {
      try {
        data = (await response.json()) as ScrapingBeeResponse;
      } catch (err) {
        beeError = "Invalid response from ScrapingBee";
      }
    }

    const html = data.article || "";
    let cleaned = "";
    let scrapingBeeWorked = false;

    if (html.length >= 100) {
      try {
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        doc.querySelectorAll("style, script").forEach(el => el.remove());
        doc.querySelectorAll("div").forEach(div => {
          const id = div.id || "";
          if (/^R[35]b8/.test(id) || /ad/i.test(id)) div.remove();
        });
        cleaned = doc.body.innerHTML.trim();
        scrapingBeeWorked = !!cleaned && cleaned.length >= 100;
      } catch (jsdomErr: any) {
        beeError = "Could not parse content from ScrapingBee preview.";
      }
    }

    // If ScrapingBee returned good content, use it
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

    // Both failed, return error
    return res.status(200).json({
      article: { content: "" },
      error: fallbackResult.error
        ? `Preview failed: ${beeError ? beeError + " / " : ""}${fallbackResult.error}`
        : `Preview failed: ${beeError || "Could not fetch preview"}`
    });
  } catch (err: any) {
    console.error("[parse.ts] Error:", err);
    return res
      .status(200)
      .json({ article: { content: "" }, error: err.message || "Internal server error" });
  }
}