import styled from "styled-components";

// Bold, energetic blue gradient
const gradA = "#2439ff";
const gradB = "#20e1ff";
const accent = "#ffb300"; // elite gold

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  user-select: none;
`;

const Wordmark = styled.span`
  font-family: "Geist", "Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", sans-serif;
  font-weight: 900;
  font-size: 2.08em;
  color: ${gradA};
  letter-spacing: -0.012em;
  line-height: 1;
  display: flex;
  align-items: flex-end;
  > sup {
    font-size: 0.60em;
    color: ${accent};
    font-weight: 900;
    margin-left: 0.13em;
    margin-bottom: 0.21em;
    letter-spacing: 0.03em;
  }
`;

// Icon: Abstract "J" + sharing rays + content node
const Icon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <defs>
      <linearGradient id="j2g1" x1="9" y1="8" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor={gradA}/>
        <stop offset="1" stopColor={gradB}/>
      </linearGradient>
      <linearGradient id="j2g2" x1="35" y1="18" x2="28" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor={accent}/>
        <stop offset="1" stopColor={gradB}/>
      </linearGradient>
    </defs>
    {/* Iconic J with energy beams/rays */}
    <path
      d="M12 9 Q12 34 29 36 Q39 37 37 21 Q36 13 19 13"
      stroke="url(#j2g1)"
      strokeWidth="5.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Sharing/content node */}
    <circle cx="37" cy="21" r="4.1" fill="url(#j2g2)" />
    {/* Subtle "sharing rays" (optional for extra energy/brand identity) */}
    <path d="M37 21 L40 16" stroke="url(#j2g2)" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M37 21 L42 25" stroke="url(#j2g2)" strokeWidth="2.2" strokeLinecap="round" />
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