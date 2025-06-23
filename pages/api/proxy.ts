import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { HeadersInit } from "node-fetch";

// List of ultra-restrictive domains (MSN, Facebook, etc.)
const BLOCKED_DOMAINS = [
  "facebook.com", "instagram.com", "linkedin.com", "tiktok.com", "outlook.com", "office.com", "live.com"
];

// Detect if URL is MSN
function isMSN(url: string): boolean {
  try {
    return new URL(url).hostname.replace(/^www\./, "").endsWith("msn.com");
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== "string") return res.status(400).send("Missing url");

  // Block known non-news, social, etc.
  const hostname = (() => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } })();
  if (BLOCKED_DOMAINS.some(domain => hostname.endsWith(domain))) {
    return res.status(403).send("This domain does not allow proxying.");
  }

  try {
    const headers: HeadersInit = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      // Forward cookies if needed for login/paywall bypass
      ...(req.headers.cookie ? { cookie: req.headers.cookie } : {}),
      // Forward referer for anti-bot
      ...(req.headers.referer ? { referer: req.headers.referer } : {})
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    // Only allow GET (can add POST support if needed)
    const proxied = await fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
      signal: controller.signal
    });
    clearTimeout(timeout);

    // Forward status and headers (except some)
    res.status(proxied.status);
    proxied.headers.forEach((value, key) => {
      if (
        !["set-cookie", "content-encoding", "transfer-encoding", "connection"].includes(
          key.toLowerCase()
        )
      ) {
        res.setHeader(key, value);
      }
    });

    if (!proxied.ok) {
      return res.send(`Upstream failed: ${proxied.status}`);
    }
    // Pipe body
    const body = await proxied.buffer();
    res.send(body);
  } catch (err: any) {
    if (isMSN(url)) {
      // Special message for MSN
      return res.status(502).send(
        "MSN is extremely aggressive about blocking proxies and bots. Even this advanced proxy may not work reliably. If you need 100% MSN support, you may need a paid residential proxy service or a partnership with MSN's API (if available)."
      );
    }
    res.status(500).send("Proxy fetch failed: " + (err.message || err));
  }
}