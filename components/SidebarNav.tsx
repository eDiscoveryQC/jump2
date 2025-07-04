// components/SidebarNav.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FaShareAlt, FaChartBar, FaUsers, FaCog } from "react-icons/fa";

const Sidebar = styled.nav`
  width: 72px;
  background: #0f172a;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.5rem;
  gap: 2rem;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 20;

  @media (max-width: 768px) {
    display: none; // Add mobile drawer if needed later
  }
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: #facc15;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #0f172a;
`;

const NavLink = styled.a<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.4rem;
  color: ${({ active }) => (active ? "#facc15" : "#94a3b8")};
  transition: color 0.2s;

  &:hover {
    color: #e2e8f0;
  }
`;

const navItems = [
  { href: "/share", icon: <FaShareAlt />, label: "Share" },
  { href: "/dashboard", icon: <FaChartBar />, label: "Dashboard" },
  { href: "/teams", icon: <FaUsers />, label: "Teams" },
  { href: "/settings", icon: <FaCog />, label: "Settings" },
];

export default function SidebarNav() {
  const router = useRouter();

  return (
    <Sidebar>
      <Logo>J2</Logo>
      {navItems.map(({ href, icon, label }) => (
        <Link key={href} href={href} passHref>
          <NavLink active={router.pathname === href} title={label}>
            {icon}
          </NavLink>
        </Link>
      ))}
    </Sidebar>
  );
}
