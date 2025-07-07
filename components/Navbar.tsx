// components/Navbar.tsx (Meta-Unicorn Final)

import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0px #facc15; }
  50% { box-shadow: 0 0 14px #facc15cc; }
`;

const NavBarWrapper = styled.nav`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid #334155;
  box-shadow: 0 4px 30px rgba(14, 165, 233, 0.15);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.9rem 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  font-size: 2rem;
  font-weight: 900;
  color: #facc15;
  display: flex;
  align-items: center;
  animation: ${pulse} 3s infinite;
  text-shadow: 0 2px 4px #0ea5e9;
  cursor: pointer;
`;

const Menu = styled.div<{ open?: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #0f172a;
    padding: 1.5rem;
    display: ${({ open }) => (open ? "flex" : "none")};
    border-top: 1px solid #334155;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const MenuLink = styled(motion.a)<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#facc15" : "#e2e8f0")};
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s ease;
  transform-origin: center;

  &:hover {
    color: #facc15;
    transform: scale(1.05);
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #facc15;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/share", label: "Create" },
    { href: "/features", label: "Features" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <NavBarWrapper role="navigation" aria-label="Main Navigation">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Logo aria-label="Jump2 homepage">Jump2</Logo>
        </Link>

        <MobileToggle
          aria-label="Toggle Menu"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </MobileToggle>

        <Menu open={isOpen} role="menu">
          {links.map((link) => (
            <Link href={link.href} passHref legacyBehavior key={link.href} prefetch>
              <MenuLink
                active={router.pathname === link.href}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                role="menuitem"
              >
                {link.label}
              </MenuLink>
            </Link>
          ))}
        </Menu>
      </Container>
    </NavBarWrapper>
  );
}
