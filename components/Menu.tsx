import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0px #facc15; }
  50% { box-shadow: 0 0 14px #facc15cc; }
  100% { box-shadow: 0 0 0px #facc15; }
`;

const SkipToContent = styled.a`
  position: absolute;
  left: -999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: 2000;
  background: #fff200;
  color: #14213d;
  font-weight: bold;
  padding: 0.8em 1.2em;
  border-radius: 0 0 1em 1em;
  transition: left 0.2s;
  &:focus {
    left: 12px;
    width: auto;
    height: auto;
    outline: 2px solid #3b82f6;
    box-shadow: 0 2px 16px #3b82f699;
  }
`;

const Nav = styled.nav`
  width: 100%;
  background: #0f172a;
  border-bottom: 1px solid #334155;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 18px #0ea5e980;
  backdrop-filter: blur(16px);
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 1rem;
`;

const Logo = styled.a`
  font-weight: 900;
  font-size: 2.2rem;
  color: #facc15;
  letter-spacing: -1px;
  text-shadow: 0 2px 0 #0ea5e9;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
  animation: ${pulseGlow} 3.2s infinite;
  &:focus { outline: 2px solid #facc15; }
`;

const Hamburger = styled.button<{ open: boolean }>`
  display: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.5em 0.7em;
  margin-left: 0.5em;
  z-index: 1002;
  border-radius: 0.6em;
  &:focus { outline: 2px solid #facc15; }
  @media (max-width: 700px) {
    display: flex;
    align-items: center;
  }
  span {
    display: block;
    width: 28px;
    height: 4px;
    margin: 5px 0;
    background: #facc15;
    border-radius: 2px;
    transition: 0.26s;
    ${({ open }) =>
      open &&
      css`
        &:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }
        &:nth-child(2) {
          opacity: 0;
        }
        &:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }
      `}
  }
`;

const MenuLinks = styled.div<{ open?: boolean }>`
  display: flex;
  gap: 2.8rem;
  align-items: center;

  @media (max-width: 700px) {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #0f172ad8;
    box-shadow: 0 6px 30px #0ea5e94c;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.8rem 0 1.5rem 0;
    border-radius: 0 0 1.5em 1.5em;
    transition: max-height 0.33s ease, opacity 0.23s;
    max-height: ${({ open }) => (open ? "400px" : "0")};
    opacity: ${({ open }) => (open ? "1" : "0")};
    pointer-events: ${({ open }) => (open ? "all" : "none")};
    overflow: hidden;
    z-index: 1001;
  }
`;

const MenuLink = styled.a<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#facc15" : "#cbd5e1")};
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: color 0.18s, text-shadow 0.25s;
  position: relative;
  padding: 0.4em 0.9em;
  border-radius: 0.5em;
  cursor: pointer;
  &:hover,
  &:focus {
    color: #facc15;
    background: #1e293b;
    text-shadow: 0 0 6px #facc15;
  }
  &::after {
    content: "";
    display: ${({ active }) => (active ? "block" : "none")};
    position: absolute;
    left: 0; right: 0; bottom: -3px;
    height: 3px;
    background: linear-gradient(90deg, #facc15 0%, #3b82f6 100%);
    border-radius: 2px;
  }
`;

const Overlay = styled.div<{ open: boolean }>`
  display: none;
  @media (max-width: 700px) {
    display: ${({ open }) => (open ? "block" : "none")};
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(16, 23, 45, 0.7);
    z-index: 1000;
    animation: fadein 0.22s;
    @keyframes fadein {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }
`;

export default function Menu() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Home" },
    { href: "/share", label: "Create" },
    { href: "/features", label: "Features" },
    { href: "/how", label: "How it Works" },
    { href: "/api", label: "API" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  useEffect(() => { setMenuOpen(false); }, [router.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen]);

  return (
    <>
      <SkipToContent href="#main-content">Skip to content</SkipToContent>
      <Nav>
        <Container>
          <Link href="/" passHref legacyBehavior>
            <Logo tabIndex={0}>Jump2</Logo>
          </Link>
          <Hamburger
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((v) => !v)}
            open={menuOpen}
          >
            <span />
            <span />
            <span />
          </Hamburger>
          <MenuLinks open={menuOpen} id="main-menu" role="menu" ref={menuRef}>
            {links.map(link => (
              <Link key={link.href} href={link.href} passHref legacyBehavior>
                <MenuLink
                  active={router.pathname === link.href}
                  aria-current={router.pathname === link.href ? "page" : undefined}
                  tabIndex={menuOpen || typeof window === "undefined" || window.innerWidth > 700 ? 0 : -1}
                  role="menuitem"
                >
                  {link.label}
                </MenuLink>
              </Link>
            ))}
          </MenuLinks>
          <Overlay open={menuOpen} onClick={() => setMenuOpen(false)} tabIndex={-1} aria-hidden={!menuOpen} />
        </Container>
      </Nav>
    </>
  );
}
