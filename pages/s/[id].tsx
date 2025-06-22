import { GetServerSideProps } from 'next';
import React from 'react';
import { supabase } from '../../lib/supabase';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shortCode = context.params?.id as string;
  if (!shortCode) return { notFound: true };

  const { data, error } = await supabase
    .from('short_links')
    .select('deep_link')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) return { notFound: true };

  // Parse for anchor fragment or text fragment
  const hasFragment = /#/.test(data.deep_link);
  let anchorText = "";
  try {
    const urlObj = new URL(data.deep_link);
    if (urlObj.hash.startsWith("#:~:text=")) {
      anchorText = decodeURIComponent(urlObj.hash.replace("#:~:text=", ""));
    }
  } catch {}

  // Pass anchorText to client for fallback if needed
  if (!hasFragment) {
    return {
      redirect: {
        destination: data.deep_link,
        permanent: false,
      },
    };
  }

  return {
    props: {
      deepLink: data.deep_link,
      anchorText,
    },
  };
};

interface Props {
  deepLink?: string;
  anchorText?: string;
}

export default function Redirect({ deepLink, anchorText }: Props) {
  const [fallback, setFallback] = React.useState(false);
  const [html, setHtml] = React.useState('');
  const previewRef = React.useRef<HTMLDivElement>(null);

  // Try native redirect first (for Chrome/Edge, etc)
  React.useEffect(() => {
    if (!deepLink) return;

    // Only try trick if text fragment is present
    if (window.CSS && (window.CSS as any).supports('selector(:target)') && deepLink.includes(":~:text=")) {
      // Try redirect, but fallback if text fragment not handled
      const timer = setTimeout(() => {
        // Chrome/Edge will handle highlight and jump, others will just land at top
        window.location.replace(deepLink);
        // After 1500ms, if still on this page, show fallback
        setTimeout(() => {
          if (document.visibilityState === "visible") setFallback(true);
        }, 1500);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // No text fragment: fallback directly
      setFallback(true);
    }
  }, [deepLink]);

  // Fallback: fetch page HTML and highlight
  React.useEffect(() => {
    if (!fallback || !deepLink || !anchorText) return;
    // Defensive: don't fetch binary, only fetch HTML
    fetch(deepLink, { method: "GET" })
      .then(r => r.text())
      .then(txt => {
        // Strip scripts/styles for safety
        let safe = txt.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '');
        // Highlight anchorText
        if (anchorText) {
          const esc = anchorText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(esc, 'i');
          safe = safe.replace(regex, match =>
            `<mark id="jump2-highlight" style="background:linear-gradient(90deg,#ffe066 70%,#ffd100 100%);color:#334155;padding:0 0.15em;border-radius:0.33em;font-weight:700;">${match}</mark>`
          );
        }
        setHtml(safe);
      });
  }, [fallback, deepLink, anchorText]);

  // Auto-scroll to highlight in fallback
  React.useEffect(() => {
    if (!fallback) return;
    const timer = setTimeout(() => {
      const el = document.getElementById('jump2-highlight');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    return () => clearTimeout(timer);
  }, [html, fallback]);

  if (!deepLink) {
    return (
      <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "5em", fontSize: "1.2em", color: "#ef4444" }}>
        Invalid or expired Jump2 link.
      </div>
    );
  }

  if (fallback && anchorText) {
    return (
      <div style={{ background: "#111827", minHeight: "100vh", color: "#eaf0fa", padding: "2em" }}>
        <h2 style={{ color: "#ffe066" }}>Jump2 Fallback Preview</h2>
        <div style={{ marginBottom: "1.5em", color: "#b5c7e4" }}>
          Your browser does not support direct highlight/jump.  
          The anchor phrase is highlighted below.<br />
          <a href={deepLink} style={{
            color: "#3b82f6",
            fontWeight: 700,
            textDecoration: "underline"
          }}>Open original article</a>
        </div>
        <div ref={previewRef} style={{
          background: "#202940",
          borderRadius: 16,
          maxWidth: 700,
          margin: "0 auto",
          padding: "2em",
          maxHeight: 500,
          overflowY: "auto",
          fontSize: "1.1em"
        }} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  // The normal case: JS + meta refresh
  return (
    <html lang="en">
      <head>
        <title>Jumping to highlight… | Jump2</title>
        {deepLink && (
          <meta httpEquiv="refresh" content={`2;url=${deepLink}`} />
        )}
        <meta name="robots" content="noindex,nofollow" />
        <style>{`
          body { font-family:sans-serif; background:#111827; color:#2563eb; margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; }
          .jump { font-size:2em; margin-top:2em; }
          .fallback { font-size:1.1em; margin-top:3em; color:#b5c7e4; }
          a.jump-link { color:#3b82f6; font-weight:700; text-decoration:underline; font-size:1.12em; }
        `}</style>
      </head>
      <body>
        <div className="jump">Jumping to highlight…</div>
        {deepLink && (
          <div className="fallback">
            <div>
              If you are not redirected, <a className="jump-link" href={deepLink}>click here</a>.
            </div>
            <div style={{marginTop:"1em"}}>
              Or copy and open this link:<br />
              <span style={{background:"#222b44",padding:"0.4em 0.7em",borderRadius:4,wordBreak:"break-all"}}>{deepLink}</span>
            </div>
          </div>
        )}
        <noscript>
          <div className="fallback" style={{color:"#ef4444",marginTop:"3em"}}>
            JavaScript is required for automatic highlight jump.
            <br/>
            Please click the link above.
          </div>
        </noscript>
      </body>
    </html>
  );
}