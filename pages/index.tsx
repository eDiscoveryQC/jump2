import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import styled, { keyframes, css } from "styled-components";
import ArticlePreviewFull from "../components/ArticlePreviewFull";

// === Animations ===
// ... [All your animation constants unchanged] ...

// [All styled components unchanged]

// --- Highlight Color Palette ---
const HIGHLIGHT_COLORS = [
  "#ffe066", // yellow
  "#a7f3d0", // green
  "#bae6fd", // blue
  "#fcd34d", // orange
  "#fca5a5", // red
  "#d8b4fe", // purple
  "#fbcfe8"  // pink
];

// === Helper hooks & utils ===
// ... [All your helper hooks and utility functions unchanged] ...

export default function Home() {
  // --- State ---
  const [link, setLink] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  const [highlightArray, setHighlightArray] = useState<string[]>([]);
  const [colorsArray, setColorsArray] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLightbox, setShowLightbox] = useState(true);

  // For focus management
  const urlInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);

  // Example demo links for onboarding
  const EXAMPLES = [
    {
      url: "https://www.bbc.com/news/world-us-canada-66159295",
      text: "democracy"
    },
    {
      url: "https://www.nytimes.com/2024/06/20/technology/ai-future.html",
      text: "artificial intelligence"
    },
    {
      url: "https://www.theguardian.com/environment/2025/jun/08/renewable-energy-breakthrough",
      text: "solar power"
    }
  ];

  // --- Handle submit ---
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim()) {
      urlInputRef.current?.focus();
      return;
    }
    // Build arrays: allow multiple highlights split by ";"
    const highlights = highlightText.split(";").map(h => h.trim()).filter(Boolean);
    setHighlightArray(highlights);
    setColorsArray(highlights.map((_, i) => highlightColor));
    setShowPreview(true);
  }

  // --- Handle "Try Example" click ---
  function handleExample(url: string, text: string) {
    setLink(url);
    setHighlightText(text);
    setHighlightColor(HIGHLIGHT_COLORS[0]);
    setShowPreview(false);
    setTimeout(() => {
      setShowPreview(true);
    }, 75);
  }

  // --- Handle color palette click ---
  function handleColorPick(color: string) {
    setHighlightColor(color);
    highlightInputRef.current?.focus();
  }

  // --- Handle closing preview ---
  function handleClosePreview() {
    setShowPreview(false);
    setTimeout(() => {
      urlInputRef.current?.focus();
    }, 100);
  }

  // --- Mobile menu ---
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);

  return (
    <>
      <HamburgerButton aria-label="Toggle menu" onClick={toggleMobileMenu}>
        ☰ Menu
      </HamburgerButton>

      <MobileMenu open={mobileMenuOpen} aria-hidden={!mobileMenuOpen} aria-label="Mobile navigation menu">
        <MobileMenuClose
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          ×
        </MobileMenuClose>
        <Subtitle>Jump2 — Content Sharer</Subtitle>
        <Description>
          Paste any link (articles, videos) to highlight and share the best parts.
        </Description>
        <ContactEmail href="mailto:contact@jump2.com" tabIndex={mobileMenuOpen ? 0 : -1}>
          Contact: contact@jump2.com
        </ContactEmail>
      </MobileMenu>

      <LightboxBackdrop
        open={showLightbox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcomeTitle"
        aria-describedby="welcomeDesc"
      >
        <LightboxContent>
          <h2 id="welcomeTitle">Welcome to Jump2!</h2>
          <p id="welcomeDesc">
            Easily highlight the best parts of any article or video, generate a
            quick shareable link, and skip the fluff.
          </p>
          <Button
            type="button"
            onClick={() => setShowLightbox(false)}
            style={{ marginTop: "1.5rem", backgroundColor: "#64748b", animation: "none" }}
            aria-label="Close welcome dialog"
          >
            Close
          </Button>
        </LightboxContent>
      </LightboxBackdrop>

      <PageContainer role="main" aria-label="Jump2 content sharer">
        <LeftColumn>
          <LogoWrapper aria-label="Jump2 logo" role="img" tabIndex={-1}>
            <AnimatedLogoText>Jump</AnimatedLogoText>
            <TwoText>2</TwoText>
          </LogoWrapper>

          <Subtitle>Skip the fluff. Jump2 the good part.</Subtitle>

          <Description>
            Paste a link (article or video) and highlight the best part — timestamp, quote, or keyword.
          </Description>

          <FormWrapper aria-live="polite" aria-atomic="true" aria-describedby="form-error">
            <form onSubmit={handleSubmit} autoComplete="off" spellCheck={false}>
              <Input
                ref={urlInputRef}
                type="url"
                required
                placeholder="Paste article or video URL..."
                value={link}
                onChange={e => setLink(e.target.value)}
                autoFocus
                aria-label="Paste article URL"
                data-testid="url-input"
              />
              <Input
                ref={highlightInputRef}
                type="text"
                placeholder='Highlight (e.g. "key finding"; separate multiple with ;)'
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                aria-label="Highlight text"
                data-testid="highlight-input"
              />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                {HIGHLIGHT_COLORS.map(color => (
                  <ColorInput
                    key={color}
                    as="input"
                    type="color"
                    value={color}
                    checked={highlightColor === color}
                    onClick={() => handleColorPick(color)}
                    title="Highlight color"
                    aria-label={`Highlight color ${color}`}
                    style={{
                      border: highlightColor === color ? "2.5px solid #3578e5" : undefined,
                      outline: highlightColor === color ? "2px solid #60a5fa" : undefined
                    }}
                  />
                ))}
                <Button type="submit">Preview</Button>
              </div>
            </form>
            <div style={{ fontSize: "0.99em", margin: "0.5em 0 1.2em 0", color: "#64748b" }}>
              <b>Tip:</b> Paste your link &amp; highlight, pick a color, then Preview!
            </div>
            <ExampleLinks>
              Try:&nbsp;
              {EXAMPLES.map(({ url, text }, i) => (
                <a key={i} onClick={() => handleExample(url, text)}>
                  {url.replace(/^https?:\/\//, '').split("/")[0]}
                </a>
              ))}
            </ExampleLinks>
            <SupportedSites>
              <b>Works best with:</b> NYT, BBC, CNN, Yahoo, Wikipedia, Substack, most public news/blogs.
            </SupportedSites>
            <HR />
            <HowItWorks>
              <b>How it works:</b>
              <ul>
                <li>Paste a news/article/blog link above.</li>
                <li>Add a highlight (optionally use <b>;</b> to highlight multiple phrases).</li>
                <li>Pick a color (optional).</li>
                <li>Click <b>Preview</b> to see a live preview, highlight, and share instantly.</li>
                <li>Copy your unique share link and send it to anyone!</li>
              </ul>
            </HowItWorks>
          </FormWrapper>
        </LeftColumn>
        <Section>
          {showPreview && link && (
            <ArticlePreviewFull
              url={link}
              initialHighlights={highlightArray}
              initialColors={colorsArray}
              onClose={handleClosePreview}
            />
          )}
        </Section>
      </PageContainer>
      <Footer>
        <div>
          <b>Jump2</b> — Competition-level article highlighting for the web. <br />
          <span style={{ color: "#3578e5" }}>Open source, privacy-first, built for you.</span>
        </div>
        <div>
          Need help? <a href="mailto:support@jump2.link" style={{ color: "#3578e5" }}>Contact us</a>
        </div>
      </Footer>
    </>
  );
}
// [All styled components & helpers from your original file are preserved and used above]