import React from "react";
import styled, { keyframes } from "styled-components";

const blue = "#1e3af2";
const gold = "#ffd700";
const white = "#ffffff";

const pulse = keyframes`
  0% { text-shadow: 0 0 4px ${gold}44, 0 0 2px ${gold}22; }
  100% { text-shadow: 0 0 8px ${gold}aa, 0 0 3px ${gold}55; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const Logo = styled.h1`
  display: inline-flex;
  align-items: flex-end;
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, sans-serif;
  font-weight: 900;
  font-size: clamp(1.8rem, 5vw, 3rem);
  line-height: 1.1;
  color: ${white};
  letter-spacing: -0.03em;
  user-select: none;
  margin: 0;
  gap: 0.04em;

  &:hover span.j {
    animation: ${bounce} 0.6s ease;
  }
`;

const J = styled.span.attrs({ className: 'j' })`
  display: inline-block;
`;

const Sup2 = styled.sup`
  font-size: 0.52em;
  font-weight: 800;
  color: ${gold};
  animation: ${pulse} 2.8s ease-in-out infinite alternate;
  margin-left: 0.05em;
  position: relative;
  top: -0.2em;
`;

const Jump2Logo = () => {
  return (
    <Logo>
      <J>J</J>UMP<Sup2>2</Sup2>
    </Logo>
  );
};

export default Jump2Logo;
