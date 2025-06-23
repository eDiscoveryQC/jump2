import styled from "styled-components";
import { useLayoutEffect, useRef } from "react";

// Elite color palette
const blue = "#1546ef";
const blueLight = "#2f6cf6";
const gold = "#ffd700";

// Ultra-tight, elite logo wrapper
const LogoWrap = styled.h1`
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(1.25rem, 3.6vw, 2.2rem);
  color: ${blue};
  margin: 0;
  display: flex;
  align-items: flex-end;
  gap: 0.07em;
  user-select: none;
  position: relative;
  line-height: 1.08;
`;

const JContainer = styled.span`
  position: relative;
  display: inline-block;
  min-width: 1.08em;
`;

// SVG ball animation: smooth, elite parabola from J to 2 and back
const BallSVG = styled.svg`
  position: absolute;
  left: 0.46em;
  top: -1.13em;
  width: 0.98em;
  height: 1.1em;
  pointer-events: none;
  overflow: visible;
`;

const BallCircle = styled.circle`
  fill: url(#ballGradientElite);
  filter: drop-shadow(0 1px 5px ${blueLight}29);
  transition: transform 0.08s cubic-bezier(.42,0,.58,1.27);
`;

const Jump = styled.span`
  color: ${blue};
  letter-spacing: -0.01em;
  display: inline-block;
`;

const Num = styled.sup`
  color: ${gold};
  font-size: 0.59em;
  font-weight: 900;
  margin-left: 0.08em;
  margin-bottom: 0.04em;
  font-family: inherit;
  text-shadow: 0 1px 3px #ffe06633;
  position: relative;
  z-index: 1;
  min-width: 0.7em;
  letter-spacing: 0.01em;
`;

// Elite, physically-plausible bounce with gentle squash
function useBallEliteBounce(ballRef, pathRef) {
  useLayoutEffect(() => {
    const ball = ballRef.current;
    const path = pathRef.current;
    if (!ball || !path) return;
    let t = 0;
    let forward = true;
    let raf;
    function animate() {
      t += (forward ? 1 : -1) * 0.012;
      if (t > 1) {
        t = 1;
        forward = false;
      } else if (t < 0) {
        t = 0;
        forward = true;
      }
      const len = path.getTotalLength();
      const pos = path.getPointAtLength(len * t);
      ball.setAttribute("cx", pos.x.toString());
      ball.setAttribute("cy", pos.y.toString());

      // Subtle, elite squash (never silly)
      let scale = 1;
      if (Math.abs(t - 0.57) < 0.10) scale = 1.10 - 0.15 * Math.abs((t - 0.57) * 10);
      if (Math.abs(t - 1) < 0.07) scale = 1.13 - 1.1 * Math.abs((t - 1) * 14);
      ball.setAttribute("transform", `scale(${scale},${2 - scale})`);
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [ballRef, pathRef]);
}

const Jump2Logo = () => {
  const ballRef = useRef(null);
  const pathRef = useRef(null);
  // Parabola: from above J (6,25) to above 2 (36,7)
  const parabola = "M 6 25 Q 19 0 36 7";
  useBallEliteBounce(ballRef, pathRef);

  return (
    <LogoWrap>
      <JContainer>
        <BallSVG viewBox="0 0 42 32">
          <defs>
            <radialGradient id="ballGradientElite" cx="62%" cy="36%" r="80%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="70%" stopColor={gold} />
              <stop offset="100%" stopColor={blueLight} />
            </radialGradient>
          </defs>
          <path d={parabola} ref={pathRef} fill="none" stroke="none"/>
          <BallCircle
            ref={ballRef}
            r="3.3"
            cx="6"
            cy="25"
          />
        </BallSVG>
        <Jump>J</Jump>
      </JContainer>
      <Jump>UMP</Jump>
      <Num>2</Num>
    </LogoWrap>
  );
};

export default Jump2Logo;