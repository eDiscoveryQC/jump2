import styled, { keyframes } from 'styled-components';

const logoGradient = "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)";
const gold = "#ffd100";
const goldShadow = "#ffe066";
const blueShadow = "#2563eb";
const white = "#fff";

const arrowAnim = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.7;}
  50% { transform: translateY(-8px) scale(1.13); opacity: 1;}
  80% { transform: translateY(1px) scale(0.97); opacity: 0.88;}
  100% { transform: translateY(0) scale(1); opacity: 0.7;}
`;

const glow = keyframes`
  0% { text-shadow: 0 0 7px ${blueShadow}33, 0 0 3px ${goldShadow}22; }
  100% { text-shadow: 0 0 18px ${blueShadow}88, 0 0 8px ${goldShadow}66; }
`;

const LogoWrap = styled.h1.attrs(() => ({
  'aria-label': 'Jump2 logo',
  role: 'img'
}))`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 6vw, 4.3rem); /* slightly smaller min for mobile */
  letter-spacing: -0.04em;
  user-select: none;
  color: ${white};
  margin: 1.1em 0 0.1em 0;
  line-height: 1;
  touch-action: manipulation;

  @media (max-width: 500px) {
    font-size: clamp(1.6rem, 9vw, 2.3rem);
    margin-top: 0.6em;
  }

  @media (hover: none) and (pointer: coarse) {
    &:active {
      filter: brightness(1.05) drop-shadow(0 2px 8px #2563eb88);
      transform: scale(0.97);
      transition: filter 0.12s, transform 0.12s;
    }
  }
`;

const JumpText = styled.span`
  background: ${logoGradient};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 12px #3b82f655, 0 1.5px 0 #ffe06633;
  animation: ${glow} 2.8s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Num = styled.span`
  color: ${gold};
  margin-left: 0.08em;
  font-weight: 900;
  text-shadow: 0 0 18px #3b82f6aa, 0 0.5px 0 #ffd10044;
  display: inline-block;
`;

const Arrow = styled.span`
  color: ${gold};
  margin-left: 0.13em;
  font-size: 1.14em;
  font-weight: 900;
  text-shadow: 0 0 12px ${gold}80, 0 0 6px ${blueShadow}60;
  animation: ${arrowAnim} 2.6s cubic-bezier(.7,-0.13,.3,1.08) infinite;
  will-change: transform, opacity;
  display: inline-block;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Jump2Logo = () => (
  <LogoWrap>
    <JumpText>Jump</JumpText>
    <Num>2</Num>
    <Arrow>➤</Arrow>
  </LogoWrap>
);

export default Jump2Logo;