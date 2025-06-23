import Link from "next/link";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  background: #111827;
  border-bottom: 1px solid #2563eb33;
  padding: 0.8rem 0;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 1px 12px #0ea5e933;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.span`
  font-weight: 900;
  font-size: 1.6rem;
  color: #3b82f6;
  letter-spacing: -1px;
  text-shadow: 0 1px 0 #0ea5e9;
`;

const MenuLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const MenuLink = styled(Link)`
  color: #cbd5e1;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: none;
  transition: color 0.18s;
  &:hover,
  &[aria-current="page"] {
    color: #3b82f6;
    text-shadow: 0 0 5px #2563eb77;
  }
`;

export default function Menu() {
  return (
    <Nav>
      <Container>
        <Logo>Jump2</Logo>
        <MenuLinks>
          <MenuLink href="/" aria-current={typeof window !== "undefined" && window.location.pathname === "/" ? "page" : undefined}>Home</MenuLink>
          <MenuLink href="/how">How it Works</MenuLink>
          <MenuLink href="/about">About</MenuLink>
          <MenuLink href="/contact">Contact</MenuLink>
        </MenuLinks>
      </Container>
    </Nav>
  );
}