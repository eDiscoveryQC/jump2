import styled, { keyframes } from "styled-components";

const blue = "#2563eb";
const blueLight = "#3b82f6";
const gold = "#ffd100";

// Keyframes for the ball's jump, bounce off "2", and settle above "J"
const ballBounce = keyframes`
  0%   { transform: translate(0, 0) scale(1);}
  10%  { transform: translate(0, -1.8em) scale(1.1, 0.9);}
  18%  { transform: translate(2.3em, -2.3em) scale(0.92,1.07);}
  23%  { transform: translate(2.9em, -0.8em) scale(1.12,0.88);}
  28%  { transform: translate(2.1em, -1.7em) scale(0.92,1.08);}
  32%  { transform: translate(1.2em, -1.05em) scale(1.04,1);}
  36%  { transform: translate(0.7em, -1.4em);}
  44%  { transform: translate(0, -1.1em);}
  56%  { transform: translate(0, -0.7em);}
  65%  { transform: translate(0, -0.4em);}
  75%  { transform: translate(0, -0.2em);}
  100% { transform: translate(0, 0) scale(1);}
`;

const LogoWrap = styled.h1`
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(2.3rem, 8vw, 4.2rem);
  color: ${blue};
  margin: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.09em;
  user-select: none;
  position: relative;
`;

const JContainer = styled.span`
  position: relative;
  display: inline-block;
  margin-right: 0.06em;
`;

const AnimatedBall = styled.span`
  position: absolute;
  left: 50%;
  top: -0.78em;
  transform: translate(-50%, 0);
  width: 0.42em;
  height: 0.42em;
  background: radial-gradient(circle at 60% 38%, #fff 0%, ${gold} 62%, ${blueLight} 100%);
  border-radius: 50%;
  box-shadow: 0 2px 12px ${blueLight}66;
  z-index: 2;
  animation: ${ballBounce} 2.3s cubic-bezier(.42,0,.38,1.3) infinite;
  will-change: transform;
`;

const Jump = styled.span`
  color: ${blue};
  letter-spacing: -0.01em;
  display: inline-block;
  font-variation-settings: "wght" 900;
  text-shadow: 0 2px 12px ${blueLight}2a;
`;

const Num = styled.sup`
  color: ${gold};
  font-size: 0.68em;
  font-weight: 900;
  margin-left: 0.12em;
  margin-bottom: 0.11em;
  font-family: inherit;
  text-shadow: 0 2px 8px #ffe06688;
  position: relative;
  z-index: 1;
`;

const Jump2Logo = () => (
  <LogoWrap>
    <JContainer>
      <AnimatedBall />
      <Jump>J</Jump>
    </JContainer>
    <Jump>UMP</Jump>
    <Num>2</Num>
  </LogoWrap>
);

export default Jump2Logo;