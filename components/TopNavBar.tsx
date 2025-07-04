// components/TopNavBar.tsx
import React from "react";
import styled from "styled-components";
import { FaRegUserCircle } from "react-icons/fa";

const NavBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0f172a;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #1e293b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: #facc15;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: #e2e8f0;
    font-size: 0.9rem;
    font-weight: 400;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ProfileButton = styled.button`
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 1.4rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #facc15;
  }
`;

export default function TopNavBar() {
  return (
    <NavBar>
      <Logo>
        Jump2 <span>| Share Intelligence</span>
      </Logo>
      <Actions>
        {/* Future: Search bar, notifications, theme toggle */}
        <ProfileButton aria-label="User Profile">
          <FaRegUserCircle />
        </ProfileButton>
      </Actions>
    </NavBar>
  );
}
