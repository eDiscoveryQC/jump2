import styled from "styled-components";

const PRIMARY_BLUE = "#2051FF";
const CYAN = "#20E1FF";
const GOLD = "#FFB300";

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.58em;
  user-select: none;
`;

const Wordmark = styled.span`
  font-family: 'Geist', 'Inter', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', sans-serif;
  font-weight: 900;
  font-size: 2.12em;
  color: ${PRIMARY_BLUE};
  letter-spacing: -0.012em;
  line-height: 1;
  display: flex;
  align-items: flex-end;
  > sup {
    font-size: 0.62em;
    color: ${GOLD};
    font-weight: 900;
    margin-left: 0.11em;
    margin-bottom: 0.19em;
    letter-spacing: 0.01em;
  }
`;

const Icon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="jump2-arc" x1="13" y1="7" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor={PRIMARY_BLUE} />
        <stop offset="1" stopColor={CYAN} />
      </linearGradient>
    </defs>
    {/* Upright, bold "J"—no abstraction */}
    <path
      d="M24 9 Q14 9 14 24 Q14 43 34 43"
      stroke="url(#jump2-arc)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    {/* Distinct content node for sharing */}
    <circle cx="34" cy="43" r="4.2" fill={GOLD} />
    {/* Upward accent for energy */}
    <polygon points="34,39 38,35 35,34" fill={GOLD} />
  </svg>
);

const Jump2Logo = () => (
  <LogoWrap>
    <Icon />
    <Wordmark>
      Jump<sup>2</sup>
    </Wordmark>
  </LogoWrap>
);

export default Jump2Logo;