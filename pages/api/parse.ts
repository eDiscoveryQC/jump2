import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { logParse, logApi } from "@/lib/log";

interface Article {
  content: string;
}

interface ResponseData {
  article?: Article;
  error?: string;
}

interface ScrapingBeeResponse {
  article?: string;
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  logApi("Received request", req.query);
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL parameter" });
  }

  try {
    const API_KEY = process.env.SCRAPINGBEE_API_KEY;
    if (!API_KEY) throw new Error("Missing ScrapingBee API key");

    const extractRules = JSON.stringify({ article: "article, main, .content" });
    const apiUrl = `https://app.scrapingbee.com/api/v1?api_key=${API_KEY}&url=${encodeURIComponent(
      url
    )}&extract_rules=${encodeURIComponent(extractRules)}`;

    logParse("Fetching from ScrapingBee:", apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`ScrapingBee error: ${response.status}`);

    const data = (await response.json()) as ScrapingBeeResponse;
    const html = data.article || "";
    if (html.length < 100) {
      return res.status(204).json({ article: { content: "" } });
    }

    const dom = new JSDOM(html);
    const doc = dom.window.document;
    doc.querySelectorAll("style, script").forEach(el => el.remove());
    doc.querySelectorAll("div").forEach(div => {
      const id = div.id || "";
      if (/^R[35]b8/.test(id) || /ad/i.test(id)) div.remove();
    });

    const cleaned = doc.body.innerHTML.trim();
    logParse("Cleaned content length:", cleaned.length);
    return res.status(200).json({ article: { content: cleaned } });
  } catch (err: any) {
    console.error("[parse.ts] Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
