import styled, { keyframes } from "styled-components";

const blue = "#2563eb";
const blueLight = "#3b82f6";
const gold = "#ffd100";

const bounce = keyframes`
  0%, 100% { transform: translateY(0);}
  40% { transform: translateY(-0.32em);}
  60% { transform: translateY(-0.1em);}
`;

const LogoWrap = styled.h1`
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(2.3rem, 8vw, 4.1rem);
  color: ${blue};
  margin: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.08em;
  user-select: none;
`;

const JContainer = styled.span`
  position: relative;
  display: inline-block;
  margin-right: 0.06em;
`;

const Dot = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -0.7em;
  width: 0.38em;
  height: 0.38em;
  background: linear-gradient(135deg, ${gold} 60%, ${blueLight});
  border-radius: 50%;
  animation: ${bounce} 1.6s infinite cubic-bezier(.42,0,.58,1.27);
  box-shadow: 0 2px 10px ${blueLight}66;
`;

const Jump = styled.span`
  color: ${blue};
  letter-spacing: -0.01em;
  display: inline-block;
`;

const Num = styled.sup`
  color: ${gold};
  font-size: 0.68em;
  font-weight: 900;
  margin-left: 0.09em;
  font-family: inherit;
`;

const Jump2Logo = () => (
  <LogoWrap>
    <JContainer>
      <Dot />
      <Jump>J</Jump>
    </JContainer>
    <Jump>UMP</Jump>
    <Num>2</Num>
  </LogoWrap>
);

export default Jump2Logo;