import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

const NavBar = styled.header`
  width: 100%;
  background: rgba(16,23,45,0.99);
  box-shadow: 0 2px 14px #2563eb11;
  position: sticky;
  top: 0;
  z-index: 20;
`;

const NavList = styled.ul`
  display: flex;
  gap: 2.3em;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 1.3em 2.7em 1.1em 2.7em;
  font-weight: 700;
  font-size: 1.13em;
`;

const NavItem = styled.li<{ active: boolean }>`
  a {
    color: ${({ active }) => (active ? "#67b7fd" : "#eaf0fa")};
    text-decoration: none;
    border-bottom: ${({ active }) => (active ? "2.5px solid #67b7fd" : "0")};
    padding-bottom: 0.12em;
    transition: color 0.13s;
    &:hover, &:focus {
      color: #67b7fd;
    }
  }
`;

export default function Header() {
  const { pathname } = useRouter();
  const links = [
    { href: "/", label: "Home" },
    { href: "/how", label: "How It Works" },
    { href: "/api", label: "API" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];
  return (
    <NavBar>
      <nav aria-label="Main navigation">
        <NavList>
          {links.map(link => (
            <NavItem key={link.href} active={pathname === link.href}>
              <Link href={link.href}>{link.label}</Link>
            </NavItem>
          ))}
        </NavList>
      </nav>
    </NavBar>
  );
}