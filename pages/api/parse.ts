import type { NextApiRequest, NextApiResponse } from "next";
import { logParse, logApi } from "@/lib/log";

interface Article { content: string; }
interface ResponseData { article?: Article; error?: string; }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  logApi("Received request with query: %o", req.query);
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL parameter" });
  }

  try {
    const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
    if (!SCRAPINGBEE_API_KEY) {
      throw new Error("ScrapingBee API key is missing");
    }

    const extractRules = JSON.stringify({
      article: "article, main, .article-content, #article-body, .content"
    });

    const apiUrl = `https://app.scrapingbee.com/api/v1?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(
      url
    )}&render_js=false&extract_rules=${encodeURIComponent(extractRules)}`;

    logParse("ScrapingBee request to: %s", apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();

    const articleHtml = data.article;

    if (!articleHtml || articleHtml.length < 100) {
      return res.status(204).json({ article: { content: "" } });
    }

    logApi("Successfully extracted article content");
    return res.status(200).json({ article: { content: articleHtml } });

  } catch (error: any) {
    console.error("[parse.ts] Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
