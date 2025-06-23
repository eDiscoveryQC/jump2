import React, { useRef, useLayoutEffect } from "react";
import styled, { keyframes } from "styled-components";

const blue = "#1e3af2";
const blueGlow = "#3b82f6";
const gold = "#ffd700";
const white = "#ffffff";

const pulse = keyframes`
  0% { text-shadow: 0 0 4px ${gold}44, 0 0 2px ${gold}22; }
  100% { text-shadow: 0 0 8px ${gold}aa, 0 0 3px ${gold}55; }
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
`;

const JWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: flex-end;
`;

const BallSVG = styled.svg`
  position: absolute;
  top: -1.1em;
  left: 0.6em;
  width: 0.9em;
  height: 0.9em;
  pointer-events: none;
  z-index: 0;
`;

const Ball = styled.circle.attrs(() => ({
  r: 3.3,
}))`
  fill: url(#jump2Gradient);
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.3));
  transform-origin: center;
  transition: transform 0.15s ease-out;
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

const useFinalBounce = (ballRef: any, pathRef: any) => {
  useLayoutEffect(() => {
    const ball = ballRef.current;
    const path = pathRef.current;
    if (!ball || !path) return;

    let t = 0;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      t = Math.min(elapsed / duration, 1);

      const len = path.getTotalLength();
      const pos = path.getPointAtLength(t * len);
      ball.setAttribute("cx", pos.x.toString());
      ball.setAttribute("cy", pos.y.toString());

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final subtle bounce
        ball.animate(
          [
            { transform: "scale(1, 1)" },
            { transform: "scale(1.15, 0.85)" },
            { transform: "scale(0.95, 1.05)" },
            { transform: "scale(1, 1)" },
          ],
          {
            duration: 300,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    };

    requestAnimationFrame(animate);
  }, [ballRef, pathRef]);
};

const Jump2Logo = () => {
  const ballRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useFinalBounce(ballRef, pathRef);

  return (
    <Logo>
      <JWrap>
        <BallSVG viewBox="0 0 120 30">
          <defs>
            <radialGradient id="jump2Gradient" cx="60%" cy="40%" r="80%">
              <stop offset="0%" stopColor={white} />
              <stop offset="65%" stopColor={gold} />
              <stop offset="100%" stopColor={blue} />
            </radialGradient>
          </defs>
          <path
            d="M 5 25 Q 20 5 30 22
               T 50 18
               T 70 23
               T 92 19
               T 113 26"
            fill="none"
            stroke="none"
            ref={pathRef}
          />
          <Ball ref={ballRef} cx="5" cy="25" />
        </BallSVG>
        J
      </JWrap>
      UMP<Sup2>2</Sup2>
    </Logo>
  );
};

export default Jump2Logo;
