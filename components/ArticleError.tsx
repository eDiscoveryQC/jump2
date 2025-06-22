import React from "react";

type Props = {
  error?: string;
  url?: string;
};

const KNOWN_BLOCKED = [
  "news.google.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "reddit.com"
];

export default function ArticleError({ error, url }: Props) {
  const domain = url ? (new URL(url)).hostname : "";

  // Custom message for known blocked domains
  const knownBlocked = KNOWN_BLOCKED.find(d => domain.includes(d));
  if (knownBlocked) {
    return (
      <div className="jump2-error">
        <h2>Sorry, Jump2 can't preview this page</h2>
        <p>
          <b>{domain}</b> blocks preview extraction or requires a login. 
          <br />
          <br />
          <b>Try this instead:</b>
          <ul>
            <li>Open the original article and copy its direct URL (not the aggregator or social link).</li>
            <li>Paste the article link here for reliable highlighting and sharing.</li>
          </ul>
          <hr />
          <div style={{ fontSize: "0.98em", color: "#888" }}>
            Why? Platforms like Google News, Facebook, and LinkedIn restrict or obfuscate content to block bots, so nobody can offer reliable previews of these pages.
          </div>
        </p>
      </div>
    );
  }

  // Generic error
  return (
    <div className="jump2-error">
      <h2>Couldn’t generate a preview</h2>
      <p>
        {error ? <b>{error}</b> : <>We tried everything, but this page can't be previewed right now.</>}
        <br /><br />
        <b>What you can do:</b>
        <ul>
          <li>Make sure you're using the direct link to an article (not a news aggregator or login page).</li>
          <li>Try opening the article in your browser, and copying the URL from the address bar.</li>
        </ul>
        <hr />
        <div style={{ fontSize: "0.98em", color: "#888" }}>
          Jump2 works great with most news articles, blogs, and public sites. 
          <br />
          <b>Having trouble?</b> <a href="mailto:support@jump2.link">Let us know</a>!
        </div>
      </p>
    </div>
  );
}