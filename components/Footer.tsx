import styled from "styled-components";
import { useEffect, useState } from "react";

const FooterBar = styled.footer.attrs({ role: "contentinfo" })`
  width: 100%;
  background: rgba(16, 23, 45, 0.97);
  color: #b8c6e4;
  text-align: center;
  padding: 2em 1em 1.3em 1em;
  font-size: 1.05em;
  border-top: 1.5px solid #23305c;
  box-shadow: 0 -2px 24px #0ea5e922;
`;

const FooterContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
`;

const SocialLinks = styled.nav.attrs({ "aria-label": "Social media" })`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2em;
  a {
    color: #67b7fd;
    font-size: 1.2em;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    transition: all 0.18s ease-in-out;
    padding: 0.3em 0.6em;
    border-radius: 0.4em;

    &:hover,
    &:focus {
      color: #ffe066;
      background: #1e293b44;
      outline: 2px solid #ffe06688;
      transform: scale(1.08);
    }

    svg {
      font-size: 1.4em;
    }
  }
`;

const PolicyLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  font-size: 0.95em;
  a {
    color: #93b4e9;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.18s ease;

    &:hover,
    &:focus {
      color: #3b82f6;
      text-decoration: underline;
      background: #1e293b33;
      outline: 2px solid #3b82f688;
      border-radius: 0.3em;
    }
  }
`;

const Copyright = styled.div`
  font-size: 0.94em;
  color: #6a7996;
  font-weight: 500;
`;

const BackToTop = styled.button`
  position: fixed;
  right: 1.4em;
  bottom: 1.4em;
  padding: 0.6em 1.3em;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 0.8em;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  color: #fff;
  box-shadow: 0 4px 16px #2563eb66;
  cursor: pointer;
  display: ${({ visible }: { visible: boolean }) => (visible ? "inline-block" : "none")};
  opacity: 0.94;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    transform: scale(1.1);
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    outline: 2px solid #fff200;
  }

  @media (max-width: 700px) {
    font-size: 0.9em;
    padding: 0.5em 1.1em;
  }
`;

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 220);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <FooterBar>
      <FooterContainer>
        <SocialLinks>
          <a href="https://www.linkedin.com/company/jump2share/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M7.75 8.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 10h1.5v6H7v-6Zm3.75 0h1.43v.82h.02c.2-.36.7-.82 1.47-.82 1.57 0 1.86.99 1.86 2.27V16H15V12.5c0-.84-.01-1.91-1.16-1.91-1.16 0-1.34.91-1.34 1.85V16h-1.5v-6Z" fill="#fff"/></svg>
            LinkedIn
          </a>
          <a href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M17.8 7H15.6l-2.1 2.8L11.4 7H9.2l2.9 4.1L9 17h2.2l1.8-2.5 1.8 2.5H17l-3.1-4.3L17.8 7Zm-4.1 6.7-.6-.8-1.7-2.3h1.1l1.2 1.6 1.2-1.6h1.1l-1.7 2.3-.6.8Z" fill="#fff"/></svg>
            Twitter
          </a>
          <a href="https://github.com/jump2share" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.85 8.33 6.8 9.68.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.77.62-3.36-1.36-3.36-1.36-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.21-.26-4.54-1.14-4.54-5.06 0-1.12.38-2.04 1.01-2.76-.1-.26-.44-1.29.1-2.7 0 0 .83-.27 2.74 1.04a9.29 9.29 0 0 1 2.5-.34c.85 0 1.71.11 2.5.34 1.91-1.31 2.74-1.04 2.74-1.04.54 1.41.2 2.44.1 2.7.63.72 1.01 1.64 1.01 2.76 0 3.93-2.33 4.8-4.55 5.05.36.32.68.94.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .26.18.57.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="#fff"/></svg>
            GitHub
          </a>
        </SocialLinks>

        <PolicyLinks>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/status">Status</a>
          <a href="mailto:support@jump2share.com">Contact</a>
        </PolicyLinks>

        <Copyright>
          &copy; {new Date().getFullYear()} Jump2. All rights reserved.
        </Copyright>
      </FooterContainer>

      <BackToTop
        visible={showTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        ↑ Top
      </BackToTop>
    </FooterBar>
  );
}
