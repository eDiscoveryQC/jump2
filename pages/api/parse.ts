import type { NextApiRequest, NextApiResponse } from "next";

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;

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
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL parameter" });
  }

  if (!SCRAPINGBEE_API_KEY) {
    return res.status(500).json({ error: "Missing ScrapingBee API key" });
  }

  try {
    const apiUrl = `https://app.scrapingbee.com/api/v1?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(
      url
    )}&render_js=false`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`ScrapingBee request failed with status ${response.status}`);
    }

    const html = await response.text();

    if (!html || html.length < 100) {
      return res.status(204).json({ article: { content: "" } });
    }

    return res.status(200).json({ article: { content: html } });
  } catch (error: any) {
    console.error("[parse.ts] Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
