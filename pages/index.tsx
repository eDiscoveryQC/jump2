import React, {
  useState,
  useCallback,
  useRef,
} from "react";
import styled, { keyframes } from "styled-components";
import ArticlePreviewFull from "../components/ArticlePreviewFull";

// === Animations ===
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  10%, 30%, 50%, 70% { transform: translateY(-3px); }
  20%, 40%, 60% { transform: translateY(3px); }
  80% { transform: translateY(-2px); }
  90% { transform: translateY(2px); }
`;

const lightboxAppear = keyframes`
  from { opacity: 0; transform: scale(0.93);}
  to { opacity: 1; transform: scale(1);}
`;

// === Styled Components ===
const HamburgerButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25em;
  cursor: pointer;
  padding: 0.5em 1em;
  color: #1e293b;
  border-radius: 6px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 0.5em;
  &:hover,
  &:focus {
    background: #f1f5f9;
    outline: none;
  }
`;

const MobileMenu = styled.nav<{ open: boolean }>`
  position: fixed;
  z-index: 10002;
  left: 0;
  top: 0;
  bottom: 0;
  width: 290px;
  background: #f8fafc;
  padding: 1.5em 1.8em;
  box-shadow: 2px 0 22px #22334414;
  border-right: 1.5px solid #e5e7eb;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-110%)")};
  transition: transform 0.29s cubic-bezier(.86,.01,.77,1.09);
`;

const MobileMenuClose = styled.button`
  background: none;
  border: none;
  font-size: 1.8em;
  color: #64748b;
  position: absolute;
  top: 1.0em;
  right: 1.1em;
  cursor: pointer;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  margin: 2.5rem auto 3rem;
  padding: 0 1.2rem;
  gap: 2.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: ${fadeIn} 0.45s;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1em;
  }
`;

const LeftColumn = styled.section`
  flex: 0 0 370px;
  min-width: 320px;
  max-width: 410px;
  margin: 0 0.8em 0 0;
  @media (max-width: 900px) {
    margin: 0;
    max-width: unset;
    min-width: unset;
  }
`;

const Section = styled.section`
  flex: 1 1 0%;
  min-width: 0;
`;

const LogoWrapper = styled.h1`
  display: flex;
  align-items: center;
  font-size: 2.5em;
  font-weight: 800;
  color: #14314d;
  margin-bottom: .28em;
  letter-spacing: -1.7px;
  user-select: none;
`;

const AnimatedLogoText = styled.span`
  color: #3578e5;
  font-weight: 900;
  margin-right: 0.11em;
  animation: ${bounce} 2.4s infinite;
`;

const TwoText = styled.span`
  color: #ffd100;
  font-size: 1.15em;
  font-weight: 900;
  margin-left: -0.04em;
  animation: ${bounce} 2.2s infinite 1s;
`;

const Subtitle = styled.h2`
  font-size: 1.30em;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.6em;
  letter-spacing: -0.6px;
`;

const Description = styled.p`
  font-size: 1.08em;
  color: #64748b;
  margin-bottom: 1.1em;
  font-weight: 400;
`;

const FormWrapper = styled.div`
  background: #f8fafb;
  border-radius: 0.9em;
  padding: 1.6em 1.3em 2em;
  box-shadow: 0 4px 24px #cbd5e115;
  border: 1.5px solid #dbeafe;
  margin-bottom: 1.7em;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  font-size: 1.13em;
  padding: 0.68em 1.05em;
  margin-bottom: 0.9em;
  border-radius: 0.54em;
  border: 1.5px solid #cbd5e1;
  background: #fff;
  color: #374151;
  font-weight: 400;
  outline: 0;
  &:focus {
    border-color: #3578e5;
    background: #f1f5f9;
  }
`;

const ColorInput = styled.input`
  width: 1.65em;
  height: 1.65em;
  border-radius: 0.5em;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px #dbeafe33;
  outline: none;
  margin-right: 0.13em;
  &:focus {
    box-shadow: 0 0 0 2px #3578e599;
  }
`;

const Button = styled.button`
  background: #3578e5;
  color: #fff;
  border: none;
  padding: 0.65em 1.2em;
  border-radius: 0.6em;
  font-size: 1.09em;
  font-weight: 600;
  margin-left: 0.35em;
  cursor: pointer;
  box-shadow: 0 2px 8px #dbeafe55;
  transition: background 0.12s;
  &:hover, &:focus {
    background: #3659b7;
    outline: 0;
  }
`;

const ExampleLinks = styled.div`
  margin: 0.1em 0 0.8em 0;
  a {
    color: #3578e5;
    cursor: pointer;
    text-decoration: underline dotted;
    margin-right: 0.7em;
    font-size: 1em;
    &:hover { text-decoration: underline solid; }
  }
`;

const SupportedSites = styled.p`
  font-size: 0.95em;
  color: #1e293b;
  margin: 0.6em 0 0.5em 0;
`;

const HR = styled.hr`
  border: none;
  border-top: 1.5px solid #e5e7eb;
  margin: 1.2em 0 1.2em 0;
`;

const HowItWorks = styled.div`
  font-size: 0.99em;
  color: #374151;
  ul {
    padding-left: 1.3em;
    margin: 0.5em 0 0 0;
    li { margin-bottom: 0.2em; }
  }
`;

const Footer = styled.footer`
  text-align: center;
  color: #64748b;
  font-size: 1.01em;
  margin: 3em 0 1.2em 0;
  padding: 1em;
`;

const LightboxBackdrop = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10001;
  left: 0; top: 0; bottom: 0; right: 0;
  background: #111827b8;
  animation: ${fadeIn} 0.4s;
`;

const LightboxContent = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 2.5em 2.5em 2.2em;
  box-shadow: 0 8px 56px #1e293b50, 0 2px 6px #1e293b25;
  min-width: 310px;
  max-width: 90vw;
  max-height: 90vh;
  text-align: center;
  animation: ${lightboxAppear} 0.34s;
`;

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

// --- Demo Links ---
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

// --- Highlight Type ---
type Highlight = {
  id: string;
  text: string;
  start: number;
  end: number;
  color: string;
};

// === Main Page ===
export default function Home() {
  const [link, setLink] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  const [highlightArray, setHighlightArray] = useState<string[]>([]);
  const [colorsArray, setColorsArray] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLightbox, setShowLightbox] = useState(true);

  const urlInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);

  // --- Convert highlights to Highlight[] for ArticlePreviewFull ---
  const highlightObjects: Highlight[] = highlightArray.map((text, i) => ({
    id: String(i),
    text,
    start: 0,
    end: text.length,
    color: colorsArray[i] || "#ffe066"
  }));

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
    setColorsArray(highlights.map(() => highlightColor));
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
        <a
          href="mailto:contact@jump2.com"
          tabIndex={mobileMenuOpen ? 0 : -1}
          style={{
            display: "block", marginTop: "2em", color: "#3578e5", fontWeight: 600, fontSize: "1.1em"
          }}
        >
          Contact: contact@jump2.com
        </a>
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
              initialHighlights={highlightObjects}
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