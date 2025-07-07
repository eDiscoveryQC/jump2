// components/LightToggle.tsx — Meta-Style Theme Toggle

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaMoon, FaSun } from "react-icons/fa";

const ToggleWrapper = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #facc15;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 999;

  &:hover {
    transform: scale(1.1);
  }
`;

const LightToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ToggleWrapper onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </ToggleWrapper>
  );
};

export default LightToggle;
