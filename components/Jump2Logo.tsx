import React, { useRef, useLayoutEffect } from "react";
import styled, { keyframes } from "styled-components";

// Brand colors
const blue = "#1e3af2";
const blueGlow = "#3b82f6";
const gold = "#ffd700";
const white = "#ffffff";

// Gold pulse around the "2"
const pulse = keyframes`
  0% { text-shadow: 0 0 4px ${gold}44, 0 0 2px ${gold}22; }
  100% { text-shadow: 0 0 8px ${gold}aa, 0 0 3px ${gold}55; }
`;

// Logo wrapper
const Logo = styled.h1`
  display: flex;
  align-items: center;
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, sans-serif;
  font-weight: 900;
  font-size: clamp(1.8rem, 5vw, 3rem);
  line-height: 1.1;
  color: ${white};
  letter-spacing: -0.02em;
  user-select: none;
  margin: 0;
  gap: 0.08em;
`;

const JWrap = styled.span`
  position: relative;
  display: inline-block;
  min-width: 1.2em; /* Ensures room for the ball animation */
`;

const BallSVG = styled.svg.attrs(() => ({
  'aria-hidden': true,
  focusable: false,
}))`
  position: absolute;
  top: -1.5em;
  left: 0.52em;
  width: 1.1em;
  height: 1.1em;
  pointer-events: none;
  z-index: 1;
`;

const Ball = styled.circle`
  fill: url(#jump2Gradient);
  filter: drop-shadow(0 2px 5px ${blueGlow}44);
  transition: transform 0.15s ease-in-out;
`;

const Sup2 = styled.sup`
  font-size: 0.55em;
  font-weight: 900;
  color: ${gold};
  animation: ${pulse} 2.8s ease-in-out infinite alternate;
  margin-left: 0.05em;
  position: relative;
  top: -0.15em;
`;

const useParabolicMotion = (ballRef: React.RefObject<SVGCircleElement>, pathRef: React.RefObject<SVGPathElement>) => {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const ball = ballRef.current;
    const path = pathRef.current;
    if (!ball || !path) return;

    let t = 0;
    let forward = true;
    let raf: number;

    const animate = () => {
      t += (forward ? 1 : -1) * 0.014;
      if (t > 1) { t = 1; forward = false; }
      if (t < 0) { t = 0; forward = true; }

      const len = path.getTotalLength();
      const pos = path.getPointAtLength(t * len);
      ball.setAttribute("cx", pos.x.toString());
      ball.setAttribute("cy", pos.y.toString());

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [ballRef, pathRef]);
};

const Jump2Logo = () => {
  const ballRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useParabolicMotion(ballRef, pathRef);

  return (
    <Logo aria-label="Jump squared logo">
      <JWrap>
        <BallSVG viewBox="0 0 50 30">
          <defs>
            <radialGradient id="jump2Gradient" cx="60%" cy="40%" r="80%">
              <stop offset="0%" stopColor={white} />
              <stop offset="65%" stopColor={gold} />
              <stop offset="100%" stopColor={blue} />
            </radialGradient>
            <title>Jump ball animation path</title>
          </defs>
          <path
            d="M 5 25 Q 25 0 45 10"
            fill="none"
            stroke="none"
            ref={pathRef}
          />
          <Ball ref={ballRef} r="3.5" cx="5" cy="25" />
        </BallSVG>
        J
      </JWrap>
      UMP<Sup2>2</Sup2>
    </Logo>
  );
};

export default Jump2Logo;