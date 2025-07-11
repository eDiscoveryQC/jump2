import { GetServerSideProps } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

// --- Utility: Robust platform/time/anchor detection ---
function needsClientRedirect(url: string): boolean {
  if (!url) return false;
  // Any #fragment (anchors, text, time, etc.)
  if (/#/.test(url)) return true;
  // YouTube, Vimeo, SoundCloud time (query or fragment)
  if (/[?&]t=\d+[smh]?/i.test(url)) return true;
  if (/#[a-z]*t=\d+[smh]?/i.test(url)) return true;
  if (/[?&#]start=\d+/i.test(url)) return true;
  if (/vimeo\.com.*[#?]t=\d+/i.test(url)) return true;
  if (/soundcloud\.com.*[#?]t=\d+(:\d+)?/i.test(url)) return true;
  // PDF page/nameddest
  if (/\.pdf(#page=\d+|#nameddest=[^&]*)/i.test(url)) return true;
  return false;
}

// --- Utility: Extract text fragment for fallback highlight ---
function extractTextFragment(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.hash.startsWith("#:~:text=")) {
      const match = urlObj.hash.match(/^#:~:text=([^&]*)/);
      if (match) return decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
  } catch {}
  return "";
}

// --- Utility: Sanitize HTML for fallback (basic) ---
function basicSanitize(html: string): string {
  // Remove scripts, styles, and all event attributes
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}

// --- Utility: Anchor reliability check ---
function validateAnchor(rawHtml: string, anchor: string): {
  isValid: boolean,
  reason?: string,
  multiple?: boolean,
  foundIndex?: number
} {
  if (!anchor || anchor.length < 5) return { isValid: false, reason: "Anchor too short." };
  // Must be a match (case-insensitive)
  const occurrences = (rawHtml.match(new RegExp(anchor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi")) || []).length;
  if (occurrences === 0) return { isValid: false, reason: "Phrase not found in this article." };
  if (occurrences > 1) return { isValid: false, reason: `Phrase appears ${occurrences} times; please select a more unique phrase.`, multiple: true };
  // Check for problematic characters
  if (/[\n\r]/.test(anchor)) return { isValid: false, reason: "Anchor contains line breaks." };
  // Heuristic: avoid very generic phrases
  if (/^(the|and|is|a|to|in|of|for|on|at|by|with)$/i.test(anchor.trim())) {
    return { isValid: false, reason: "Anchor is too generic. Please choose a more distinctive phrase." };
  }
  // Optionally: warn if contains HTML tags (broken across tags)
  if (/<[^>]+>/.test(anchor)) return { isValid: false, reason: "Anchor crosses formatting or HTML tags. Please select simple, contiguous text." };
  return { isValid: true, foundIndex: rawHtml.toLowerCase().indexOf(anchor.toLowerCase()) };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shortCode = context.params?.id as string;
  if (!shortCode) return { notFound: true };

  const { data, error } = await supabase
    .from('short_links')
    .select('deep_link')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) return { notFound: true };

  const deepLink = data.deep_link;
  const clientRedirect = needsClientRedirect(deepLink);
  const anchorText = extractTextFragment(deepLink);
  const previewOnly = !!context.query.preview;

  if (!clientRedirect && !previewOnly) {
    return {
      redirect: {
        destination: deepLink,
        permanent: false,
      },
    };
  }

  return {
    props: {
      deepLink,
      anchorText,
      previewOnly,
    },
  };
};

interface Props {
  deepLink?: string;
  anchorText?: string;
  previewOnly?: boolean;
}

export default function Redirect({ deepLink, anchorText, previewOnly }: Props) {
  const [fallback, setFallback] = useState(false);
  const [html, setHtml] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorWarning, setAnchorWarning] = useState<string | null>(null);
  const [browserWarning, setBrowserWarning] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const [showQr, setShowQr] = useState(false);

  const highlightRef = useRef<HTMLDivElement>(null);

  // Preload destination for faster jumps (except in preview-only mode)
  useEffect(() => {
    if (!deepLink || previewOnly) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = deepLink;
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [deepLink, previewOnly]);

  // Try instant redirect (unless previewOnly)
  useEffect(() => {
    if (!deepLink || previewOnly) return;

    // For text fragments, give browser a chance to handle, then fallback
    if (deepLink.includes(":~:text=")) {
      setTimeout(() => {
        window.location.replace(deepLink);
        setTimeout(() => {
          if (document.visibilityState === "visible") setFallback(true);
        }, 1500);
      }, 50);
    } else {
      setTimeout(() => window.location.replace(deepLink), 50);
    }
  }, [deepLink, previewOnly]);

  // Fallback: fetch and highlight text fragment for non-supporting browsers or in previewOnly mode
  useEffect(() => {
    if ((!fallback && !previewOnly) || !deepLink || !anchorText) return;
    setLoading(true);
    setFetchError('');
    fetch(deepLink, { method: "GET" })
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.text();
      })
      .then(txt => {
        let safe = basicSanitize(txt);
        let found = false;
        let anchorVal = validateAnchor(safe, anchorText);
        setAnchorWarning(anchorVal.isValid ? null : anchorVal.reason || null);

        // If phrase is found multiple times, highlight all
        const regex = new RegExp(anchorText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), 'gi');
        let first = true;
        safe = safe.replace(regex, match => {
          found = true;
          // First occurrence gets extra animation
          if (first) {
            first = false;
            return `<mark id="jump2-highlight" style="background:linear-gradient(90deg,#ffe066 70%,#ffd100 100%);color:#334155;padding:0 0.15em;border-radius:0.33em;font-weight:700;animation:pulse 1.4s;">${match}</mark>`;
          }
          return `<mark style="background:#ffe06655;color:#334155;padding:0 0.15em;border-radius:0.33em;">${match}</mark>`;
        });

        if (!found) {
          safe = `<div style="color:#ef4444;font-weight:500;margin-bottom:1em;">Could not highlight – phrase not found in article.</div>` + safe;
        }
        setHtml(safe);
      })
      .catch(() => {
        setFetchError('Failed to load the article preview. Please open the original article directly.');
      })
      .finally(() => setLoading(false));
  }, [fallback, deepLink, anchorText, previewOnly]);

  // Auto-scroll to highlight
  useEffect(() => {
    if (!fallback && !previewOnly) return;
    const timer = setTimeout(() => {
      const el = document.getElementById('jump2-highlight');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    return () => clearTimeout(timer);
  }, [html, fallback, previewOnly]);

  // Browser support warning
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent;
    if (!/Chrome|Edg|Chromium/i.test(ua)) setBrowserWarning(true);
  }, []);

  // Copy helpers
  function handleCopyAnchor() {
    if (anchorText) {
      navigator.clipboard.writeText(anchorText);
      setCopyMsg('Anchor copied!');
      setTimeout(() => setCopyMsg(''), 1400);
    }
  }
  function handleCopyLink() {
    if (deepLink) {
      navigator.clipboard.writeText(deepLink);
      setCopyMsg('Link copied!');
      setTimeout(() => setCopyMsg(''), 1400);
    }
  }

  // ---- Mobile-friendly UI ----
  if (!deepLink) {
    return (
      <div style={{
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "center",
        marginTop: "5em",
        fontSize: "1.2em",
        color: "#ef4444",
        padding: "2em"
      }}>
        Invalid or expired Jump2 link.
      </div>
    );
  }

  // Fallback preview or previewOnly
  if ((fallback || previewOnly) && anchorText) {
    return (
      <div style={{
        background: "#111827",
        minHeight: "100vh",
        color: "#eaf0fa",
        padding: "1.5em 0.5em 2em 0.5em",
        fontFamily: "Inter, Arial, sans-serif"
      }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.4em"
        }}>
          <img
            src="/logo.png"
            alt="Jump2"
            style={{
              width: "38px",
              height: "38px",
              marginRight: "0.65em",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 2px 6px #0002"
            }}
          />
          <span style={{
            fontWeight: 900,
            fontSize: "2em",
            letterSpacing: "-0.04em",
            color: "#ffe066"
          }}>Jump2</span>
        </header>
        <div style={{
          fontWeight: 700,
          fontSize: "1.13em",
          color: "#b5c7e4",
          textAlign: "center",
          marginBottom: "0.8em"
        }}>
          <span role="img" aria-label="flag">🏁</span> Anchor phrase: <span style={{color:"#ffe066"}}>{anchorText}</span>
        </div>
        {browserWarning && (
          <div style={{
            background: "#ffe066",
            color: "#1e293b",
            fontWeight: "bold",
            borderRadius: "1em",
            padding: "0.8em 1.3em",
            marginBottom: "1.1em",
            marginTop: "0.3em"
          }}>
            Notice: Text fragment anchors work best in Chrome/Edge. <a href="https://web.dev/text-fragments/" style={{color:"#1e40af"}} target="_blank">Learn more</a>
          </div>
        )}
        {anchorWarning && (
          <div style={{
            background: "#fecd57",
            color: "#843110",
            fontWeight: "bold",
            borderRadius: "0.7em",
            padding: "0.7em 1.2em",
            marginBottom: "1.1em",
          }}>
            {anchorWarning}
          </div>
        )}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.8em",
          flexWrap: "wrap",
          marginBottom: "1.3em"
        }}>
          <button
            onClick={handleCopyAnchor}
            style={{
              padding: "0.45em 1.3em",
              borderRadius: "0.7em",
              fontWeight: 700,
              background: "#ffe066",
              color: "#1e293b",
              border: "none",
              cursor: "pointer"
            }}
          >
            Copy Anchor
          </button>
          <button
            onClick={handleCopyLink}
            style={{
              padding: "0.45em 1.3em",
              borderRadius: "0.7em",
              fontWeight: 700,
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Copy Link
          </button>
          <button
            onClick={() => setShowQr(q => !q)}
            style={{
              padding: "0.45em 1.3em",
              borderRadius: "0.7em",
              fontWeight: 700,
              background: "#222b44",
              color: "#ffe066",
              border: "none",
              cursor: "pointer"
            }}
          >
            {showQr ? "Hide QR" : "Show QR"}
          </button>
        </div>
        {copyMsg && (
          <div style={{
            color: "#ffe066",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "1.1em"
          }}>
            {copyMsg}
          </div>
        )}
        {showQr && deepLink && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1em"
          }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(deepLink)}`}
              alt="Jump2 QR"
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 6,
                margin: "0 auto"
              }}
            />
          </div>
        )}
        <div style={{
          marginBottom: "1.2em",
          color: "#b5c7e4",
          fontSize: "1.03em",
          textAlign: "center"
        }}>
          {previewOnly ? (
            <>This is a preview only. The anchor phrase is highlighted below.</>
          ) : (
            <>
              Your browser does not support direct highlight/jump.<br />
              The anchor phrase is highlighted below.
            </>
          )}
          <div style={{ marginTop: "0.6em" }}>
            <a href={deepLink} target="_blank" rel="noopener noreferrer" style={{
              color: "#3b82f6",
              fontWeight: 700,
              textDecoration: "underline",
              padding: "0.2em 0.7em",
              borderRadius: 6,
              background: "#202940",
              display: "inline-block"
            }}>Open original article</a>
          </div>
        </div>
        <div
          ref={highlightRef}
          style={{
            background: "#202940",
            borderRadius: 16,
            maxWidth: 700,
            margin: "0 auto",
            padding: "1.1em 0.9em",
            maxHeight: 480,
            overflowY: "auto",
            fontSize: "1.06em",
            wordBreak: "break-word",
            boxShadow: "0 4px 24px #0003"
          }}
          aria-live="polite"
        >
          {loading &&
            <div style={{
              color: "#ffe066",
              fontWeight: 500,
              textAlign: "center",
              margin: "2em 0"
            }}>
              <svg style={{ width: 32, height: 32, marginBottom: 4, verticalAlign: 'middle' }} viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="#ffe066" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.9s" from="0 25 25" to="360 25 25" />
                </circle>
              </svg>
              Loading preview…
            </div>
          }
          {fetchError &&
            <div style={{ color: "#ef4444", fontWeight: 500, marginTop: "1.5em", textAlign: "center" }}>
              {fetchError} <br />
              <a href={deepLink} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>Open original article</a>
            </div>
          }
          {!loading && !fetchError &&
            <div dangerouslySetInnerHTML={{ __html: html }} />
          }
        </div>
        <footer style={{
          fontSize: "0.93em",
          color: "#7c93b4",
          textAlign: "center",
          marginTop: "2.2em"
        }}>
          <span style={{
            display: "inline-block",
            background: "#ffe06611",
            padding: "0.2em 0.8em",
            borderRadius: 8
          }}>
            <b>Tip:</b> For best highlight support, open in Chrome or Edge.
          </span>
          <br />
          <span style={{
            background: "#202940",
            color: "#b5c7e4",
            borderRadius: 8,
            padding: "0.2em 0.7em",
            marginTop: "0.8em",
            display: "inline-block"
          }}>
            <a href="mailto:support@jump2share.com" style={{ color: "#3b82f6" }}>Report issue or feedback</a>
          </span>
        </footer>
        <style>{`
          @media (max-width: 600px) {
            header span {
              font-size: 1.15em !important;
            }
            .preview-content {
              padding: 1em 0.3em !important;
              font-size: 0.98em !important;
            }
            div[style*="max-width: 700px"] {
              max-width: 98vw !important;
              padding: 1em 0.3em !important;
            }
            footer {
              font-size: 0.85em !important;
            }
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 #ffd10088;}
            60% { box-shadow: 0 0 12px 8px #ffd10033;}
            100% { box-shadow: 0 0 0 0 #ffd10000;}
          }
        `}</style>
      </div>
    );
  }

  // Default: jump/redirect for all other cases
  return (
    <html lang="en">
      <head>
        <title>Jumping to destination… | Jump2</title>
        {deepLink && !previewOnly && (
          <>
            <meta httpEquiv="refresh" content={`2;url=${deepLink}`} />
            <link rel="prefetch" href={deepLink} />
          </>
        )}
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
            font-family: Inter, Arial, sans-serif;
            background: #111827;
            color: #2563eb;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: 7vh;
          }
          .jump-logo-row {
            display: flex;
            align-items: center;
            margin-bottom: 1.5em;
            justify-content: center;
          }
          .jump-logo-row img {
            width: 34px;
            height: 34px;
            margin-right: 0.6em;
            border-radius: 7px;
            background: #fff;
            box-shadow: 0 2px 6px #0001;
          }
          .jump-title {
            font-size: 1.5em;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #ffe066;
          }
          .jump {
            font-size: 1.2em;
            margin-bottom: 1.3em;
            font-weight: 500;
            color: #ffe066;
          }
          .fallback {
            font-size: 1.07em;
            margin-top: 2.1em;
            color: #b5c7e4;
            text-align: center;
          }
          a.jump-link {
            color: #3b82f6;
            font-weight: 700;
            text-decoration: underline;
            font-size: 1.09em;
            padding: 0.18em 0.7em;
            border-radius: 6px;
            background: #202940;
            display: inline-block;
            margin-top: 0.6em;
          }
          @media (max-width: 600px) {
            .jump-title {
              font-size: 1.05em !important;
            }
            .jump-logo-row img {
              width: 28px;
              height: 28px;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="jump-logo-row">
          <img src="/logo.png" alt="Jump2" />
          <span className="jump-title">Jump2</span>
        </div>
        <div className="jump">Jumping to your destination…</div>
        {deepLink && (
          <div className="fallback">
            If you are not redirected, <a className="jump-link" href={deepLink}>click here</a>.
            <div style={{marginTop:"1em", fontSize:"0.97em"}}>
              Or copy and open this link:<br />
              <span style={{
                background:"#222b44",
                padding:"0.4em 0.7em",
                borderRadius:4,
                wordBreak:"break-all",
                fontSize: "0.97em",
                display: "inline-block"
              }}>{deepLink}</span>
            </div>
          </div>
        )}
        <noscript>
          <div className="fallback" style={{color:"#ef4444",marginTop:"2.5em"}}>
            JavaScript is required for automatic jump/highlight.<br/>
            Please click the link above.
          </div>
        </noscript>
      </body>
    </html>
  );
}