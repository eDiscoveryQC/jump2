import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { logParse, logApi } from "@/lib/log";
import { JSDOM } from "jsdom";

interface Article {
  content: string;
}

interface ResponseData {
  article?: Article;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  logApi("Received request with query: %o", req.query);
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL parameter" });
  }

  try {
    const API_KEY = process.env.SCRAPINGBEE_API_KEY;
    if (!API_KEY) {
      throw new Error("Missing ScrapingBee API key");
    }

    const extractRules = JSON.stringify({
      article: "article, main, .article-content, #article-body, .content",
    });

    const apiUrl = `https://app.scrapingbee.com/api/v1?api_key=${API_KEY}&url=${encodeURIComponent(
      url
    )}&render_js=false&extract_rules=${encodeURIComponent(extractRules)}`;

    logParse("ScrapingBee request to: %s", apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`ScrapingBee fetch failed: ${response.status}`);
    }
    const data = await response.json();
    let html = data.article as string;

    if (!html || html.length < 100) {
      return res.status(204).json({ article: { content: "" } });
    }

    // Clean up HTML using JSDOM
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Remove all <style> and <script> tags
    doc.querySelectorAll("style, script").forEach((el) => el.remove());

    // Remove ad-like divs with IDs starting with R3b8 or R5b8 or containing 'ad'
    doc.querySelectorAll("div").forEach((div) => {
      const id = div.id || "";
      if (id.startsWith("R3b8") || id.startsWith("R5b8") || /ad/i.test(id)) {
        div.remove();
      }
    });

    const cleanedHtml = doc.body.innerHTML.trim();
    logParse("Cleaned article content");

    return res.status(200).json({ article: { content: cleanedHtml } });
  } catch (error: any) {
    console.error("[parse.ts] Error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
