import styled from "styled-components";
import { useEffect, useState } from "react";

const FooterBar = styled.footer.attrs({ role: "contentinfo" })`
  width: 100%;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #cbd5e1;
  padding: 2rem 1.5rem;
  font-size: 1rem;
  border-top: 1px solid #334155;
  box-shadow: 0 -2px 18px rgba(14, 165, 233, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const SocialLinks = styled.nav.attrs({ "aria-label": "Social media" })`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  a {
    color: #7dd3fc;
    font-weight: 600;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    background: rgba(30, 58, 138, 0.3);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      background: rgba(34, 197, 94, 0.2);
      color: #a3e635;
      outline: 2px solid #a3e63566;
      transform: translateY(-2px);
    }
  }
`;

const PolicyLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  font-size: 0.9rem;
  a {
    color: #93c5fd;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;

    &:hover,
    &:focus {
      color: #60a5fa;
      text-decoration: underline;
      outline: 1px solid #60a5fa88;
      border-radius: 0.3em;
    }
  }
`;

const Copyright = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 400;
  text-align: center;
`;

const BackToTop = styled.button`
  position: fixed;
  right: 1.2rem;
  bottom: 1.2rem;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.5);
  cursor: pointer;
  display: ${({ visible }: { visible: boolean }) => (visible ? "inline-block" : "none")};
  opacity: 0.95;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    transform: scale(1.08);
    background: linear-gradient(135deg, #6366f1, #3b82f6);
    outline: 2px solid #facc15;
  }

  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0.45rem 1rem;
  }
`;

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <FooterBar>
      <FooterContainer>
        <SocialLinks>
          <a href="https://www.linkedin.com/company/jump2share/" target="_blank" rel="noopener noreferrer">
            <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="#67b7fd" />
              <path d="M7.75 8.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 10h1.5v6H7v-6Zm3.75 0h1.43v.82h.02c.2-.36.7-.82 1.47-.82 1.57 0 1.86.99 1.86 2.27V16H15V12.5c0-.84-.01-1.91-1.16-1.91-1.16 0-1.34.91-1.34 1.85V16h-1.5v-6Z" fill="#fff"/>
            </svg>
            LinkedIn
          </a>
          <a href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer">
            <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="#67b7fd" />
              <path d="M17.8 7H15.6l-2.1 2.8L11.4 7H9.2l2.9 4.1L9 17h2.2l1.8-2.5 1.8 2.5H17l-3.1-4.3L17.8 7Zm-4.1 6.7-.6-.8-1.7-2.3h1.1l1.2 1.6 1.2-1.6h1.1l-1.7 2.3-.6.8Z" fill="#fff"/>
            </svg>
            Twitter
          </a>
          <a href="https://github.com/jump2share" target="_blank" rel="noopener noreferrer">
            <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="#67b7fd" />
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.85 8.33 6.8 9.68.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.77.62-3.36-1.36-3.36-1.36-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.21-.26-4.54-1.14-4.54-5.06 0-1.12.38-2.04 1.01-2.76-.1-.26-.44-1.29.1-2.7 0 0 .83-.27 2.74 1.04a9.29 9.29 0 0 1 2.5-.34c.85 0 1.71.11 2.5.34 1.91-1.31 2.74-1.04 2.74-1.04.54 1.41.2 2.44.1 2.7.63.72 1.01 1.64 1.01 2.76 0 3.93-2.33 4.8-4.55 5.05.36.32.68.94.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .26.18.57.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="#fff"/>
            </svg>
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
