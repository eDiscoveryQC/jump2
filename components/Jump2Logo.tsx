import styled from "styled-components";

const primaryBlue = "#2151FF";
const secondaryBlue = "#18E0FF";
const gold = "#FFB300";

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55em;
  user-select: none;
`;

const Wordmark = styled.span`
  font-family: "Geist", "Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", sans-serif;
  font-weight: 900;
  font-size: 2.1em;
  color: ${primaryBlue};
  letter-spacing: -0.01em;
  line-height: 1;
  display: flex;
  align-items: flex-end;
  > sup {
    font-size: 0.60em;
    color: ${gold};
    font-weight: 900;
    margin-left: 0.13em;
    margin-bottom: 0.20em;
    letter-spacing: 0.02em;
  }
`;

const Icon = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
    <defs>
      <linearGradient id="j2g1" x1="13" y1="6" x2="34" y2="41" gradientUnits="userSpaceOnUse">
        <stop stopColor={primaryBlue}/>
        <stop offset="1" stopColor={secondaryBlue}/>
      </linearGradient>
    </defs>
    {/* Unmistakable, upright "J" with energy */}
    <path
      d="M23 9 Q15 9 15 23 Q15 40 34 40"
      stroke="url(#j2g1)"
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Sharing/content node at the tip */}
    <circle cx="34" cy="40" r="4.2" fill={gold} />
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