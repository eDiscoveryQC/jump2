// components/Navbar.tsx
import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0px #facc15; }
  50% { box-shadow: 0 0 14px #facc15cc; }
`;

const NavBarWrapper = styled.nav`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #334155;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  font-size: 1.8rem;
  font-weight: 900;
  color: #facc15;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${pulse} 3s infinite;
  text-shadow: 0 1px 3px #0ea5e9;
  cursor: pointer;
`;

const Menu = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuLink = styled.a<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#facc15" : "#e2e8f0")};
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #facc15;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 2px;
    background: ${({ active }) => (active ? "#facc15" : "transparent")};
    transition: background 0.3s;
  }
`;

export default function Navbar() {
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/share", label: "Create" },
    { href: "/features", label: "Features" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <NavBarWrapper>
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Logo>Jump2</Logo>
        </Link>
        <Menu>
          {links.map((link) => (
            <Link href={link.href} passHref legacyBehavior key={link.href}>
              <MenuLink active={router.pathname === link.href}>{link.label}</MenuLink>
            </Link>
          ))}
        </Menu>
      </Container>
    </NavBarWrapper>
  );
}
